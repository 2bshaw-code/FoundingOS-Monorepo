/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { FoundRetailWebsite } from './routes/website/FoundRetailWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <FoundRetailWebsite />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
