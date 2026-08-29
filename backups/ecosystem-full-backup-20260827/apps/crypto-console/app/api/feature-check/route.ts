/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { NextRequest } from 'next/server'
import { featureDenial, featureForModule, hasFeature } from '@foundingos/ui/feature-gating'
import { customerAccess } from '../../brand-config'

export async function GET(request: NextRequest) {
  const moduleId = new URL(request.url).searchParams.get('module') ?? 'crm'
  const feature = featureForModule(moduleId)

  if (!hasFeature(customerAccess, feature)) {
    return Response.json(featureDenial(customerAccess, feature ?? moduleId, moduleId), { status: 401 })
  }

  return Response.json({ ok: true, package: customerAccess.package, feature, module: moduleId })
}
