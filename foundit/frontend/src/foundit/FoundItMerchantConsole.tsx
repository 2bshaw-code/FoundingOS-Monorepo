/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MerchantOperationsConsole, type MerchantClient } from '@founder-os/ui'
import { FoundThisBrandMark } from '@founder-os/brand-assets'
import { authClient } from '../auth'

const merchantClient: MerchantClient = { request: (path, init) => authClient.request(`/foundretail-merchant${path}`, init) }
export function FoundThisMerchantConsole() { return <div className="theme-foundit relative"><FoundThisBrandMark className="pointer-events-none absolute left-5 top-5 z-10 h-11 w-11"/><div className="[&_main>header]:pl-20"><MerchantOperationsConsole client={merchantClient} title="Data Operations Console"/></div></div> }
