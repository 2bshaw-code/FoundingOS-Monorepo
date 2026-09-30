# FoundingOS desktop app

FoundingOS for Windows and Mac. The app opens the live FoundingOS workspace in its own window, so it
always shows the latest version. There's no need to reinstall when the website is updated.

- Links outside FoundingOS (WhatsApp, payments, help pages) open in your normal browser.
- The microphone is only allowed for FoundingOS itself, so you can talk to FoundAI.
- If there is no internet, a simple "You're offline" screen offers to try again.

## Build

```bash
cd apps/foundingos-desktop
npm install --workspaces=false
npm test
npm start            # run it locally
npm run dist:mac     # dist/FoundingOS-1.0.0-universal.dmg (Apple silicon and Intel)
npm run dist:win     # dist/FoundingOS Setup 1.0.0.exe (needs Windows, or use the workflow below)
```

The Windows installer tool only runs on Intel, so on an Apple silicon Mac use
`npx electron-builder --win zip --x64` for a zip, or run the **Desktop apps** GitHub workflow.
It builds the Windows installer and the Mac dmg on real machines and attaches them to the run.

## Before selling to the public

The builds are not code signed yet, so Windows shows "Windows protected your PC" (click
**More info**, then **Run anyway**). On a Mac, right click the app and choose **Open** the first time.
To remove these warnings:

- **Mac:** a Developer ID Application certificate from the Apple Developer account, plus notarisation.
- **Windows:** a code signing certificate (OV or EV) from a provider such as Sectigo or DigiCert.
