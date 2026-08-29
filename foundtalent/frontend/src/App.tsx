/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { FoundTalentConsole } from './routes/console/FoundTalentConsole'
import { FoundTalentWebsite } from './routes/website/FoundTalentWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <FoundTalentWebsite />
      <FoundTalentConsole />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
