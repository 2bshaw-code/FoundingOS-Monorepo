/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Serverless entry point used only by the Vercel build (see
// scripts/build-core-operations-api.mjs). Not used for local dev, which
// still runs src/server.ts with app.listen().
import { app } from './app.js'

export default app
