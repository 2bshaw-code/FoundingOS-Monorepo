# FoundingOS native mobile app

The iOS and Android app uses Expo/React Native screens, not a WebView or website
wrapper. It shares the backend, SuperDash navigation, approved media catalogue,
caption/preview rules and company legal review definitions with the Mac/web app.

## SuperDash parity

Finance shares formal Sales invoices, Accounts payable, Bank accounts, Bank
reconciliation and Tax & VAT labels with web/Mac, without changing stored module
identifiers. The CSV bulk-import, register/PDF printing and animated FoundAI
character are currently web/Mac features, not native-mobile controls.

- Business, Finance, Sales, Marketing and Legal use a scoped navy/blue native theme.
  Modules opened from SuperDash retain that theme; standalone workspaces retain
  their own accents. The route's `source=superdash` is presentation only and grants
  no backend permission.
- Marketing starts with **Media library**: seven videos play in a native player;
  seven JPG social posts have complete captions, clipboard copying and native
  file saving/sharing. Internet is required to fetch media. Downloaded sharing
  files are held temporarily in the app cache, then cleaned up.
- **Use caption and image link** opens the native post composer. Existing founder
  post APIs save the link as text, not a native social attachment. Native image/
  video publishing still requires manual upload.
- Post titles, images and **Preview post** open a native modal with full caption,
  hashtags, media, channel, status, campaign and schedule. Select a calendar day,
  then open its post to preview. Previewing never publishes or saves.
- Legal manages FoundingOS's UK seller obligations, subscriptions, privacy,
  company requirements and individual India/African country launch reviews.
  It reads/appends the same tenant `legal/founder-compliance` records as web/Mac.
  Evidence is not a compliance certificate. Public terms and versioned checkout
  acceptance remain outstanding; qualified UK and local advice is required.
- Demo/investor views cannot write founder marketing, finance or legal reviews.
  Modules opened from SuperDash also guard writes while view-only or in demo mode.
  Backend authorization remains authoritative.

## Talent recruiter desk

Talent shares its module catalogue, source options and specialist forms with
web/Mac. Client submissions, manual outreach follow-ups and recorded recruiter
activity use the existing workspace records API. The candidate pipeline now
distinguishes Offer from Hired. These features do not post jobs, send outreach
or connect to job-board CV databases. See [Talent capabilities and integration
boundaries](../../packages/ui/TALENT.md) for the implemented scope and remaining work.

## Validation and delivery

From the repository root:

```sh
npm run typecheck --workspace @foundingos/mobile
```

From this app directory:

```sh
npx expo export --platform ios --platform android
npx eas build --platform ios --profile production
npx eas build --platform android --profile production-apk
```

The iOS production build must be delivered through TestFlight/App Store Connect;
an IPA link is not directly installable on an ordinary iPhone. Android's APK
profile produces a directly installable test file, subject to Android's installer
permissions. Building does not publish an App Store release.

Video, file-system, clipboard and sharing native dependencies require a new
installed binary. Runtime compatibility uses Expo's fingerprint policy so these
updates cannot be sent to an older binary lacking the required native modules.
Website deployment alone does not update this native app.

Before calling a release device-tested, verify on both physical platforms:
login/logout; SuperDash access; every tab and back navigation; video controls;
image sharing/saving; clipboard actions; complete post previews and modal close;
live legal persistence and failures; and demo/investor write restrictions.
