# Approved FOS icons

The main FoundingOS icon is the user-approved multicolour blue/amber/red FOS
artwork. Nine workspace variants retain the same shape and lettering:
Retail emerald, Finance gold, Marketing rose, Logistics coral, Legal indigo,
Health sky blue, Talent orange, HR teal and Intelligence violet.

SuperDash has a separate navy/cyan FOS mark with a gold SuperDash badge, used
on its login/header and directory entry on web/Mac, and its native header.
It is not a tenth customer workspace and does not replace the multicolour
FoundingOS main icon. Only the eleven approved PNG paths bypass the access gate.

These 256px PNGs were exported locally from the approved 768px raster artwork.
They are not vector originals. Do not enlarge them for print; use the approved
high-resolution originals instead. The matching native assets are bundled in
`apps/foundingos-mobile/assets/brand`.

Web/Mac use `FoundingOSBrandMark`; native uses its React Native equivalent.
The shared web component bundles the matching `packages/ui/assets/fos` images
through Next static imports so other consoles do not depend on website-only
public paths. The explicit public paths are used for favicons and metadata.
Workspace names remain visible rather than relying on colour alone.
The animated sphere character remains exclusively in FoundAI help.

The desktop packaging icon is updated in `apps/foundingos-desktop/build/icon.png`.
An already installed app's Dock icon only changes after repackaging/installing.
Native in-app icons can be delivered by compatible OTA updates; iOS/Android
launcher and splash icons require a new binary and are not changed by an OTA.
