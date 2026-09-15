/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import FoundingOSFooter from './components/FoundingOSFooter'
import { BrowserRouter } from 'react-router-dom'
import { CoreOperationsWebsite } from './routes/website/CoreOperationsWebsite'

export default function App() {
  return (
    <BrowserRouter>
      <CoreOperationsWebsite />
      <FoundingOSFooter />
    </BrowserRouter>
  )
}
