/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'
import { AnalyticsMetricCard, BarChart, Card, FunnelChart, HeatMap, LineChart, WaterfallChart } from './index'

export interface AnalyticsClient { request<T>(path: string, init?: RequestInit): Promise<T> }
export type AnalyticsDomain = 'inventory'|'orders'|'invoices'|'delivery'|'marketing'|'social'|'media'|'location'
type Item = Record<string, unknown>
type OperationsAnalyticsData = { inventory: Item[]; orders: Item[]; invoices: Item[]; campaigns: Item[]; socialPosts: Item[]; media: Item[]; deliveryZones: Item[]; deliveryAssignments: Item[]; locationProfiles: Item[]; metrics: Record<string, number> }
const empty: OperationsAnalyticsData = { inventory: [], orders: [], invoices: [], campaigns: [], socialPosts: [], media: [], deliveryZones: [], deliveryAssignments: [], locationProfiles: [], metrics: {} }
const money=(value=0)=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(value/100)
const countBy=(items:Item[],key:string)=>Object.entries(items.reduce<Record<string,number>>((result,item)=>{const label=String(item[key]||'Unknown');result[label]=(result[label]||0)+1;return result},{})).map(([label,value])=>({label,value}))
const recentTrend=(items:Item[],valueKey?:string)=>Array.from({length:7},(_,offset)=>{const day=new Date();day.setDate(day.getDate()-(6-offset));const label=day.toLocaleDateString(undefined,{weekday:'short'});const value=items.filter(item=>String(item.createdAt||item.scheduledAt||item.assignedAt||'').slice(0,10)===day.toISOString().slice(0,10)).reduce((sum,item)=>sum+(valueKey?Number(item[valueKey]||0):1),0);return{label,value}})

export function OperationsAnalytics({client,domain}:{client:AnalyticsClient;domain:AnalyticsDomain}){
 const [data,setData]=useState(empty);const [message,setMessage]=useState('')
 const load=async()=>{try{setData((await client.request<{success:true;data:OperationsAnalyticsData}>('/owner/operations')).data);setMessage('')}catch(error){setMessage(error instanceof Error?error.message:'Analytics unavailable')}}
 useEffect(()=>{void load();const timer=window.setInterval(()=>void load(),30_000);return()=>window.clearInterval(timer)},[client])
 const m=data.metrics
 const content=(()=>{
  switch(domain){
   case'inventory':return{cards:[['Items',String(m.inventoryItems||data.inventory.length)],['Value',money(m.inventoryValuePence)],['Low stock',String(m.lowStock||0)],['Categories',String(new Set(data.inventory.map(item=>item.category)).size)]],title:'Inventory category performance',chart:<BarChart data={countBy(data.inventory,'category')}/>}
   case'orders':return{cards:[['Orders',String(m.orders||data.orders.length)],['Revenue',money(m.orderRevenuePence)],['Open',String(data.orders.filter(item=>item.status==='open').length)],['Average value',money(data.orders.length?Number(m.orderRevenuePence||0)/data.orders.length:0)]],title:'Order trend',chart:<LineChart data={recentTrend(data.orders,'totalPence')}/>}
   case'invoices':return{cards:[['Invoices',String(data.invoices.length)],['Outstanding',money(m.outstandingPence)],['Unpaid',String(m.unpaidInvoices||0)],['Paid',String(data.invoices.filter(item=>item.status==='paid').length)]],title:'Invoice revenue flow',chart:<WaterfallChart data={[{label:'Issued',value:data.invoices.reduce((sum,item)=>sum+Number(item.totalPence||0),0)/100},{label:'Paid',value:-data.invoices.filter(item=>item.status==='paid').reduce((sum,item)=>sum+Number(item.totalPence||0),0)/100},{label:'Outstanding',value:Number(m.outstandingPence||0)/100}]}/>}
   case'delivery':return{cards:[['Active',String(m.activeDeliveries||0)],['Delivered',String(m.delivered||0)],['Success',`${m.deliverySuccessRate||0}%`],['Fees',money(m.deliveryRevenuePence)]],title:'Delivery zone activity',chart:<HeatMap data={data.deliveryZones.map(zone=>({label:String(zone.name||'Zone'),value:data.deliveryAssignments.filter(item=>item.zoneId===zone.id).length}))}/>}
    case'marketing':return{cards:[['Campaigns',String(m.campaigns||data.campaigns.length)],['Impressions',String(data.campaigns.reduce((sum,item)=>sum+Number(item.impressions||0),0))],['Engagements',String(data.campaigns.reduce((sum,item)=>sum+Number(item.engagements||0),0))],['Revenue',money(data.campaigns.reduce((sum,item)=>sum+Number(item.revenuePence||0),0))]],title:'Campaign performance and revenue flow',chart:<div className="grid gap-5 lg:grid-cols-2"><LineChart data={recentTrend(data.campaigns,'engagements')}/><WaterfallChart data={[{label:'Impressions',value:data.campaigns.reduce((sum,item)=>sum+Number(item.impressions||0),0)},{label:'Engagements',value:-data.campaigns.reduce((sum,item)=>sum+Number(item.engagements||0),0)},{label:'Conversions',value:data.campaigns.reduce((sum,item)=>sum+Number(item.conversions||0),0)},{label:'Revenue',value:data.campaigns.reduce((sum,item)=>sum+Number(item.revenuePence||0),0)/100}]}/></div>}
   case'social':return{cards:[['Scheduled',String(m.scheduledPosts||0)],['Drafts',String(data.socialPosts.filter(item=>item.status==='draft').length)],['Published',String(data.socialPosts.filter(item=>item.status==='published').length)],['Auto-post',String(data.socialPosts.filter(item=>item.autoPost).length)]],title:'Platform activity',chart:<BarChart data={['Facebook','Instagram','TikTok','X','LinkedIn'].map(label=>({label,value:data.socialPosts.filter(item=>Array.isArray(item.platforms)&&item.platforms.includes(label)).length}))}/>}
   case'media':return{cards:[['Generations',String(data.media.length)],['Formats',String(new Set(data.media.map(item=>item.format)).size)],['This week',String(data.media.filter(item=>Date.now()-new Date(String(item.createdAt||0)).getTime()<604800000).length)],['Usage trend',String(recentTrend(data.media).reduce((sum,item)=>item.value,0))]],title:'FoundAI usage by format',chart:<BarChart data={countBy(data.media,'format')}/>}
   case'location':return{cards:[['Profiles',String(data.locationProfiles.length)],['GPS enabled',String(data.locationProfiles.filter(item=>item.gpsEnabled).length)],['IP fallback',String(data.locationProfiles.filter(item=>item.ipFallbackEnabled).length)],['Delivery zones',String(data.deliveryZones.length)]],title:'Location service coverage',chart:<HeatMap data={data.locationProfiles.map(item=>({label:String(item.locality||item.label||'Location'),value:1}))}/>}
  }
 })()
 return <section className="space-y-5" aria-label={`${domain} analytics`}><div className="grid gap-4 md:grid-cols-4">{content.cards.map(([title,value],index)=><AnalyticsMetricCard key={title} title={title} value={value} trend={index===0?data[domain==='marketing'?'campaigns':domain==='social'?'socialPosts':domain==='media'?'media':domain==='delivery'?'deliveryAssignments':domain==='location'?'locationProfiles':domain].length:undefined}/>)}</div><Card title={content.title}>{content.chart}</Card>{message&&<p className="text-sm text-[#B42318]">{message}</p>}</section>
}

export function PipelineAnalytics({leads,customers=0,title='Pipeline conversion'}:{leads:Array<{stage:string;valuePence?:number;createdAt?:string}>;customers?:number;title?:string}){
 const stages=['new','qualified','converted'].map(label=>({label,value:leads.filter(item=>item.stage===label).length}))
 const value=leads.reduce((sum,item)=>sum+Number(item.valuePence||0),0)
 return <section className="space-y-5"><div className="grid gap-4 md:grid-cols-4"><AnalyticsMetricCard title="Pipeline value" value={money(value)}/><AnalyticsMetricCard title="Leads" value={String(leads.length)}/><AnalyticsMetricCard title="Customers" value={String(customers)}/><AnalyticsMetricCard title="Conversion" value={`${leads.length?Math.round(stages[2].value/leads.length*100):0}%`} trend={leads.length?stages[2].value/leads.length*100:0}/></div><Card title={title}><FunnelChart data={stages}/></Card></section>
}

export function EntityAnalytics({title,items,labelKey='name'}:{title:string;items:Item[];labelKey?:string}){
 const chart=countBy(items,labelKey)
 return <section className="space-y-5"><div className="grid gap-4 md:grid-cols-4"><AnalyticsMetricCard title="Total" value={String(items.length)}/><AnalyticsMetricCard title="Active" value={String(items.filter(item=>item.active!==false).length)}/><AnalyticsMetricCard title="Categories" value={String(chart.length)}/><AnalyticsMetricCard title="Coverage" value={`${items.length?100:0}%`} trend={items.length?100:0}/></div><Card title={title}><BarChart data={chart}/></Card></section>
}
