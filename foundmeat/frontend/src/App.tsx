/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { FoundMeatConsole } from './routes/console/FoundMeatConsole'
import { FoundMeatWebsite } from './routes/website/FoundMeatWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <FoundMeatWebsite />
      <FoundMeatConsole />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
