/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import { app } from './app.js'

const port = Number(process.env.PORT || 4005)
app.listen(port, () => console.log(`Core.Workforce API listening on ${port}`))
