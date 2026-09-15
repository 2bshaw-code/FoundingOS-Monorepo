/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export interface MediaAsset {
  id: string
  url: string
  mimeType: string
  filename: string
}

export interface MediaUploader {
  upload(file: File, scope: string): Promise<MediaAsset>
}

export const createHttpMediaUploader = (endpoint: string): MediaUploader => ({
  async upload(file, scope) {
    const body = new FormData()
    body.append('file', file)
    body.append('scope', scope)
    const response = await fetch(endpoint, { method: 'POST', body, credentials: 'include' })
    if (!response.ok) throw new Error('Media upload failed')
    return response.json() as Promise<MediaAsset>
  },
})
