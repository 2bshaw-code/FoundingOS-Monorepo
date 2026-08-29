/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useEffect, useState } from 'react'

type PublicCompany={id:string;slug:string;settings?:{brandColor?:string}|null}
const validColour=(value:unknown)=>typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value)

export function useCompanyBrand(founderApiUrl:string,tenantId:string|undefined,fallback:string){
 const [colour,setColour]=useState(fallback)
 useEffect(()=>{setColour(fallback);if(!tenantId)return;const root=founderApiUrl.replace(/\/+$/,'');fetch(`${root}/api/v1/public/companies`).then(response=>response.ok?response.json():Promise.reject()).then((body:{data:PublicCompany[]})=>{const value=body.data.find(company=>company.id===tenantId)?.settings?.brandColor;if(validColour(value))setColour(value!)}).catch(()=>setColour(fallback))},[founderApiUrl,tenantId,fallback])
 return colour
}
