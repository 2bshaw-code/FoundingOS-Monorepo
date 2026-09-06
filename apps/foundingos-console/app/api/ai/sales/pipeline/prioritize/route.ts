/* 
  © 2024–2026 FoundingOS API. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { NextRequest } from 'next/server'
import { runAIActionRequest } from '../../../_run-aal'

export async function POST(request: NextRequest) {
  return runAIActionRequest(request, 'sales', 'prioritizePipeline')
}
