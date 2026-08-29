/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { FoundCryptoConsole } from './routes/console/FoundCryptoConsole'
import { FoundCryptoWebsite } from './routes/website/FoundCryptoWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <FoundCryptoWebsite />
      <FoundCryptoConsole />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
