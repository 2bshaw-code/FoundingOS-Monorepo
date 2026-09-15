/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import bcrypt from 'bcrypt'
import { randomBytes } from 'node:crypto'
import { prisma } from './auth.js'
import { Prisma } from './generated/prisma/index.js'

export const merchantPermissionKeys = ['uploadStock','updatePrices','manageAvailability','manageCategories','viewOrders'] as const
export type MerchantPermission = typeof merchantPermissionKeys[number]
const defaults = Object.fromEntries(merchantPermissionKeys.map(key=>[key,true])) as Record<MerchantPermission,boolean>
const json=(value:unknown)=>JSON.parse(JSON.stringify(value??{})) as Prisma.InputJsonValue
const text=(value:unknown)=>String(value||'').trim()

export const permissionsFor = (value:unknown) => {
 const record=value&&typeof value==='object'&&!Array.isArray(value)?value as Record<string,unknown>:{}
 return Object.fromEntries(merchantPermissionKeys.map(key=>[key,record[key]===undefined?defaults[key]:Boolean(record[key])])) as Record<MerchantPermission,boolean>
}

export const requirePermission = async (userId:string,permission:MerchantPermission) => {
 const user=await prisma.authUser.findUniqueOrThrow({where:{id:userId}})
 if(user.role==='Owner'||user.role==='founder_master')return user
 if(!permissionsFor(user.permissions)[permission])throw new Error(`${permission} permission is disabled`)
 return user
}

export const logMerchantActivity=(tenantId:string,userId:string,action:string,entity:string,entityId?:string,details?:unknown)=>prisma.merchantActivity.create({data:{tenantId,userId,action,entity,entityId,details:details===undefined?undefined:json(details)}})

export const merchantWorkspace=async(tenantId:string,userId:string)=>{
 const user=await prisma.authUser.findFirstOrThrow({where:{id:userId,tenantId}})
 const [inventory,orders,changes]=await Promise.all([
  prisma.inventoryItem.findMany({where:{tenantId},orderBy:{updatedAt:'desc'}}),
  permissionsFor(user.permissions).viewOrders?prisma.salesOrder.findMany({where:{tenantId},orderBy:{createdAt:'desc'},take:100}):Promise.resolve([]),
  prisma.merchantChange.findMany({where:{tenantId,submittedBy:userId},orderBy:{createdAt:'desc'},take:100}),
 ])
 return{inventory,orders,changes,permissions:permissionsFor(user.permissions)}
}

export const submitMerchantChange=async(tenantId:string,userId:string,input:Record<string,unknown>)=>{
 const action=text(input.action)
 const itemId=text(input.itemId)||undefined
 const proposed=input.proposed&&typeof input.proposed==='object'&&!Array.isArray(input.proposed)?input.proposed as Record<string,unknown>:{}
 const permission:MerchantPermission=action==='create'?'uploadStock':proposed.pricePence!==undefined?'updatePrices':proposed.availability!==undefined||proposed.active!==undefined?'manageAvailability':'manageCategories'
 await requirePermission(userId,permission)
 if(itemId)await prisma.inventoryItem.findFirstOrThrow({where:{id:itemId,tenantId}})
 if(action==='create'&&(!text(proposed.name)||!text(proposed.sku)))throw new Error('Item name and SKU are required')
 const change=await prisma.merchantChange.create({data:{tenantId,itemId,submittedBy:userId,action:action||'update',proposed:json(proposed)}})
 await logMerchantActivity(tenantId,userId,'submitted_change','inventory',itemId||change.id,{permission,proposed})
 return change
}

export const reviewMerchantChange=async(id:string,tenantId:string,reviewedBy:string,status:string,note?:string)=>prisma.$transaction(async database=>{
 const change=await database.merchantChange.findFirstOrThrow({where:{id,tenantId}})
 if(change.status!=='pending')throw new Error('Change has already been reviewed')
 if(status==='approved'){
  const proposed=change.proposed as Record<string,unknown>
  if(change.action==='create')await database.inventoryItem.create({data:{tenantId,name:text(proposed.name),sku:text(proposed.sku),category:text(proposed.category)||'General',supplierName:text(proposed.supplierName)||undefined,pricePence:Math.max(0,Number(proposed.pricePence||0)),stock:Math.max(0,Number(proposed.stock||0)),lowStockLevel:Math.max(0,Number(proposed.lowStockLevel||5)),variants:json(proposed.variants||[]),availability:text(proposed.availability)||'available',approvalStatus:'approved',lastChangedBy:change.submittedBy,approvedBy:reviewedBy,approvedAt:new Date()}})
  else if(change.itemId)await database.inventoryItem.update({where:{id:change.itemId,tenantId},data:{...(proposed.name!==undefined?{name:text(proposed.name)}:{}),...(proposed.category!==undefined?{category:text(proposed.category)}:{}),...(proposed.pricePence!==undefined?{pricePence:Math.max(0,Number(proposed.pricePence))}:{}),...(proposed.stock!==undefined?{stock:Math.max(0,Number(proposed.stock))}:{}),...(proposed.availability!==undefined?{availability:text(proposed.availability)}:{}),...(proposed.active!==undefined?{active:Boolean(proposed.active)}:{}),approvalStatus:'approved',lastChangedBy:change.submittedBy,approvedBy:reviewedBy,approvedAt:new Date()}})
 }
 const reviewed=await database.merchantChange.update({where:{id},data:{status,reviewedBy,reviewNote:note,reviewedAt:new Date()}})
 await database.merchantActivity.create({data:{tenantId,userId:reviewedBy,action:`change_${status}`,entity:'inventory',entityId:change.itemId||change.id,details:json({changeId:id,note})}})
 return reviewed
})

export const ownerMerchantSummary=async(tenantId:string)=>{
 const [staff,changes,activity,inventory,orders]=await Promise.all([
  prisma.authUser.findMany({where:{tenantId,role:{in:['Merchant','Staff','MeatTrader']}},select:{id:true,email:true,role:true,active:true,permissions:true,createdAt:true,updatedAt:true},orderBy:{email:'asc'}}),
  prisma.merchantChange.findMany({where:{tenantId},orderBy:{createdAt:'desc'},take:100}),
  prisma.merchantActivity.findMany({where:{tenantId},orderBy:{createdAt:'desc'},take:100}),
  prisma.inventoryItem.findMany({where:{tenantId},orderBy:{updatedAt:'desc'}}),
  prisma.salesOrder.findMany({where:{tenantId},orderBy:{createdAt:'desc'},take:100}),
 ])
 return{staff:staff.map(user=>({...user,permissions:permissionsFor(user.permissions)})),changes,activity,inventory,orders,metrics:{staff:staff.length,activeStaff:staff.filter(user=>user.active).length,pendingChanges:changes.filter(change=>change.status==='pending').length,approvedChanges:changes.filter(change=>change.status==='approved').length,inventoryItems:inventory.length,orders:orders.length,revenuePence:orders.reduce((sum,order)=>sum+order.totalPence,0)}}
}

export const addMerchantStaff=async(tenantId:string,input:Record<string,unknown>)=>{
 const email=text(input.email).toLowerCase();if(!email)throw new Error('Email is required')
 const temporaryPassword=text(input.temporaryPassword)||randomBytes(12).toString('base64url')+'!A1'
 const role=['Merchant','Staff','MeatTrader'].includes(text(input.role))?text(input.role):'Staff'
 const user=await prisma.authUser.create({data:{email,passwordHash:await bcrypt.hash(temporaryPassword,12),role,tenantId,active:true,permissions:json(permissionsFor(input.permissions))}})
 await logMerchantActivity(tenantId,user.id,'staff_added','staff',user.id,{role})
 return{user:{id:user.id,email:user.email,role:user.role,active:user.active,permissions:permissionsFor(user.permissions)},temporaryPassword}
}

export const updateMerchantStaff=async(id:string,tenantId:string,input:Record<string,unknown>)=>{
 const current=await prisma.authUser.findFirstOrThrow({where:{id,tenantId,role:{in:['Merchant','Staff','MeatTrader']}}})
 const user=await prisma.authUser.update({where:{id},data:{...(input.active!==undefined?{active:Boolean(input.active)}:{}),...(input.role!==undefined&&['Merchant','Staff','MeatTrader'].includes(text(input.role))?{role:text(input.role)}:{}),...(input.permissions!==undefined?{permissions:json(permissionsFor(input.permissions))}:{})}})
 await logMerchantActivity(tenantId,id,'staff_updated','staff',id,{previousRole:current.role,active:user.active,role:user.role})
 return{id:user.id,email:user.email,role:user.role,active:user.active,permissions:permissionsFor(user.permissions)}
}

export const resetMerchantPassword=async(id:string,tenantId:string)=>{
 await prisma.authUser.findFirstOrThrow({where:{id,tenantId,role:{in:['Merchant','Staff','MeatTrader']}}})
 const temporaryPassword=randomBytes(12).toString('base64url')+'!A1'
 await prisma.$transaction([prisma.authUser.update({where:{id},data:{passwordHash:await bcrypt.hash(temporaryPassword,12)}}),prisma.authSession.updateMany({where:{userId:id,revokedAt:null},data:{revokedAt:new Date()}})])
 await logMerchantActivity(tenantId,id,'password_reset','staff',id)
 return{temporaryPassword}
}

export const removeMerchantStaff=async(id:string,tenantId:string)=>{
 await prisma.authUser.findFirstOrThrow({where:{id,tenantId,role:{in:['Merchant','Staff','MeatTrader']}}})
 await prisma.authSession.deleteMany({where:{userId:id}});await prisma.authUser.delete({where:{id}})
 return{id}
}
