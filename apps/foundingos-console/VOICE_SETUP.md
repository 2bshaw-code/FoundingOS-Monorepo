# FoundingOS spoken SuperDash briefings

The FoundingOS mobile SuperDash can read a short briefing aloud using the configured ElevenLabs voice. Audio is generated on demand and is not cached by the API.

Configure these server-side environment variables in local development and the deployment environment:

- `ELEVENLABS_API_KEY` - private API credential. Never use a `NEXT_PUBLIC_` prefix or include it in a mobile build.
- `ELEVENLABS_VOICE_ID` - the selected ElevenLabs voice ID.

The mobile app sends the briefing text to the authenticated FoundingOS API. The API sends that text to ElevenLabs and returns an MP3 with `Cache-Control: private, no-store`. The briefing contains aggregate SuperDash figures and does not include tenant names, email addresses, or other customer identifiers. The mobile UI discloses that summary text is sent to ElevenLabs.

The endpoint accepts up to 1,800 characters per request and requires an authenticated FoundingOS session. If either environment variable is missing, the API returns a configuration error instead of falling back silently.

The mobile app uses `expo-audio` for playback. Publishing the server route does not update already-installed mobile apps; a new native build and app release are required for the playback control to reach users.
