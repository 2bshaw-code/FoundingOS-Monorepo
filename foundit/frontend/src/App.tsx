/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { FoundThisConsole } from './routes/console/FoundThisConsole'
import { FoundThisWebsite } from './routes/website/FoundThisWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <FoundThisWebsite />
      <FoundThisConsole />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
