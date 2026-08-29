'use client'

import { useEffect, useState } from 'react'
import { useFounderGlobalisation } from './founder-globalisation'

export function ClientDate({ value }: { value: number }) {
  const geo = useFounderGlobalisation()
  const [formatted, setFormatted] = useState('')

  useEffect(() => {
    setFormatted(geo.formatDate(value))
  }, [geo, value])

  return <>{formatted}</>
}
