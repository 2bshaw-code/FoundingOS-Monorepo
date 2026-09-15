/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { CoreWorkforceConsole } from './routes/console/CoreWorkforceConsole'
import { CoreWorkforceWebsite } from './routes/website/CoreWorkforceWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <CoreWorkforceWebsite />
      <CoreWorkforceConsole />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
