import { notFound } from 'next/navigation'
import { BrandPackagePage } from '@foundingos/ui/console'
import { packageCatalogForBrand } from '@foundingos/ui/package-data'
import { brandConfig } from '../../../brand-config'

export default async function PackagePage({ params }: { params: Promise<{ package?: string }> }) {
  const { package: packageSlug } = await params
  const packages = packageCatalogForBrand(brandConfig.name)
  if (!packageSlug || !packages.some((entry) => entry.slug === packageSlug)) notFound()
  return <BrandPackagePage config={brandConfig} packageSlug={packageSlug} />
}
