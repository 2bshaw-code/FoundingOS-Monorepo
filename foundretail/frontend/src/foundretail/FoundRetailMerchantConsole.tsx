/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { MerchantOperationsConsole } from '@founder-os/ui'
import { authClient } from '../auth'

export function FoundRetailMerchantConsole() { return <MerchantOperationsConsole client={authClient} title="Staff Console" /> }
