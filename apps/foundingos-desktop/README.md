# FoundingOS desktop app

FoundingOS for Windows and Mac. The app opens the live FoundingOS workspace in its own window, so it
always shows the latest version. There's no need to reinstall when the website is updated.

The approved multicolour FOS mark is the main logo; workspaces use matching
colour variants, and FoundAI retains its sphere character. In-window branding
updates with the website. The packaging icon in `build/icon.png` uses the same
multicolour design; the Dock/launcher icon requires the newly packaged app.
FoundAI's floating help button shows the small character without a green circular
background; it keeps its labelled button, keyboard focus and open/close behavior.
Open the bot and choose **Bot settings & accessories** to change its name (up to
30 characters), colour, free accessory, device voice or speaking speed. Preview
changes before saving; settings are stored in this Mac app/browser, not synced
across accounts or devices. Reset defaults restores the standard appearance and
voice selection, without deleting chat or companion progress.
Settings scroll independently, while the high-contrast Save settings and Cancel
buttons remain visible at the bottom. A saved confirmation appears in chat.
Preview voice, Stop voice, Reset defaults and accessories are in the scrollable
settings area. Back to chat discards unsaved changes, like Cancel.
Collapsed page coaches keep the small bot's face, arms and legs visible rather
than reverting to a coloured sphere. Older console logo imports now display the
approved FOS mark; the legacy sphere artwork is no longer rendered.
Drag the floating bot with mouse or touch, or focus it and use arrow keys.
Dragging does not open help. Bot movement controls provide Dance, Slide,
Stop moving, Reset position and an optional Move on his own switch.
Automatic moves run at most every 30 seconds while help is closed, the page is
visible and no drag is active. Reduced motion disables dance/slide, not dragging.
Position and automatic movement are session-only and reset on reload.

Glasses, a bow tie and a crown are free try-on accessories, with no checkout.
Companion levels advance after 5, 20 and 50 completed chat/action interactions
on this device; they are cosmetic and do not train a model or grant permissions.
Measured intelligence remains the Intelligence workspace's assessed outcomes
and accuracy, not the companion level.

**Hear my welcome** replaces the story action with a spoken introduction using
the bot's saved name and instructions for personalising it. The welcome is also
shown in chat and plays only when requested (or with reply narration enabled).
Voice selection applies to replies, speaker buttons, the welcome and previews.
Available voices depend on the device. Additional Mac voices can be downloaded
from System Settings > Accessibility > Spoken Content (or Read & Speak).
Online device voices may send spoken text to the device provider; no paid voice
API is added. Unavailable voices and storage/playback failures display an error.

- Links outside FoundingOS (WhatsApp, payments, help pages) open in your normal browser.
- The microphone is only allowed for FoundingOS itself, so you can talk to FoundAI.
- If there is no internet, a simple "You're offline" screen offers to try again.

## SuperDash and marketing videos

The app starts at `https://www.foundingos.com/app`. Core Intelligence is the
customer workspace; it is not the founder SuperDash. Founder, partner and investor
accounts can use the separate **Founder SuperDash** entry at `/superdash`.
The entry remains visible even when access verification fails; opening it does
not grant access. Backend founder/investor authorization still protects the data.
**Sign out** clears both the workspace session and website invitation cookie,
so restarting the app cannot silently re-adopt the same preview session.
In SuperDash, choose **Marketing > Media library** to preview or download seven
promotional videos. **FoundAI posts > Use video link** adds a public MP4 link to the
composer for drafting/scheduling; this does not upload a native social video.
Only approved promotional media paths are public. Workspace and SuperDash
access controls remain unchanged. The older console's `/superdashboard` is a
different application and is not the desktop app's destination.

The media library also includes seven JPG screenshots extracted from those videos
with editable social captions and hashtags. Download the JPG and copy the caption
for a native image post, or load a caption plus image link into the post composer.
Four screenshot posts appear in SuperDash example figures; three also seed the
Marketing content-studio demo. These are illustrative drafts, not real publications
or customer testimonials. Existing browser-saved demo records stay unchanged;
reset Marketing demo data to load its updated seed. Only the fourteen approved
MP4/JPG paths are public; other files remain behind the website gate.
In SuperDash FoundAI posts, click a post title, its image, **Preview post**, or a
calendar event to open the complete post. The preview shows the full caption,
hashtags, media, channel, status and schedule without publishing or changing it.
Press Escape or **Close preview** to return to the queue.
All SuperDash tabs, embedded workspace modules and professional reports use the
same navy/blue palette as the Business overview. This override is scoped to
SuperDash; standalone customer workspaces keep their existing theme and accents.
To regenerate the stills on macOS, run `swift scripts/extract-marketing-stills.swift`
from the repository root. Full video-frame dimensions are preserved without cropping.

## Private family testing

Share the universal Mac DMG, not the source repository or your founder password.
It supports Apple silicon and Intel Macs and requires internet access.
Each tester should use their own invited email/account. Use tester access for
workspace testing; grant view-only investor preview only when you intend to share
the founder dashboard. Do not share partner codes, which grant full founder access.
The current build is unsigned and not notarised. On recent macOS versions, after
attempting to open it, go to **System Settings > Privacy & Security > Open Anyway**
only if you recognise and trust the installer.

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

SuperDash Legal runs FoundingOS's own UK-registered subscription business, not a customer's
legal practice. Its subscription, privacy, country-launch and company review topics cover
India and individual African markets; a listed market is not approved for launch.
Named reviewers can append evidence, scope and next-review dates to the tenant's existing
records API (`legal/founder-compliance`). Demo and investor views cannot save reviews.
Review entries are not compliance certificates, do not change checkout/billing/published
terms, and do not verify terms acceptance. The public subscription terms page and
versioned checkout acceptance still need implementation and qualified legal review.
Agreement documents and NDAs remain available; client matters, time billing and client
invoices belong in the separate customer Legal workspace.

The builds are not code signed yet, so Windows shows "Windows protected your PC" (click
**More info**, then **Run anyway**). On a Mac, right click the app and choose **Open** the first time.
To remove these warnings:

- **Mac:** a Developer ID Application certificate from the Apple Developer account, plus notarisation.
- **Windows:** a code signing certificate (OV or EV) from a provider such as Sectigo or DigiCert.
