/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { useCallback, useEffect, useState } from 'react'
import { getJSON, setJSON } from './local-store'
import { postBespokeAction } from './bespoke-actions'

const SAVED_KEY = 'fo_foundthat_saved_products'

// Real write-back "save/like" flow — every toggle now also persists to the real
// module_actions table (moduleId "saved-products") via POST /api/console/bespoke-actions, so
// a saved product is real, durable state visible to anyone else hitting this brand's data
// next, not just this device. The on-device set below still drives instant/offline UI.
export function useSavedProducts(): {
  savedIds: Set<string>
  loaded: boolean
  isSaved: (id: string) => boolean
  toggleSaved: (id: string) => void
} {
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getJSON<string[]>(SAVED_KEY, []).then((ids) => {
      setSavedIds(new Set(ids))
      setLoaded(true)
    })
  }, [])

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((current) => {
      const next = new Set(current)
      const nowSaved = !next.has(id)
      if (nowSaved) {
        next.add(id)
      } else {
        next.delete(id)
      }
      setJSON(SAVED_KEY, [...next])
      postBespokeAction({ moduleId: 'saved-products', action: nowSaved ? 'Save product' : 'Unsave product', payload: { productId: id } })
      return next
    })
  }, [])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  return { savedIds, loaded, isSaved, toggleSaved }
}
