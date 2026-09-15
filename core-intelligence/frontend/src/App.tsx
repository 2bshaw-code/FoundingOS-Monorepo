/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { IntelligenceConsole } from './routes/console/IntelligenceConsole'
import { IntelligenceWebsite } from './routes/website/IntelligenceWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <IntelligenceWebsite />
      <IntelligenceConsole />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
