# New customer activation

1. Create a Lite account using `/signup`. Paid plans activate only after the billing webhook confirms payment.
2. Enter the account password once at the website access page. An encrypted, two-minute, email/device-bound HttpOnly handoff exchanges the backend refresh token for the same account's workspace session. It never grants preview or owner privileges from a guest cookie. Invitation-code roles keep their existing exchange.
3. Retail Home shows a three-step launch checklist backed by loaded catalogue data. Add a product name, category and non-negative GBP price. Verify it survives reload. Live forms do not offer fictitious demo staff.
4. Open Integrations → WhatsApp. Choose **Connect my WhatsApp Business app** (keep the same number on the phone) or **Connect a new number**, sign in with Facebook and pick the business and number. If quick connect is unavailable, use the manual Cloud API setup below.
5. Send a test message from an opted-in phone, open WhatsApp Inbox and refresh. Select the real conversation, confirm consent and send a reply. Refresh to distinguish Meta acceptance from delivered/read status.

## Quick connect (Meta Embedded Signup)

The recommended path appears when the backend has `WHATSAPP_APP_ID`, `WHATSAPP_APP_SECRET` and `WHATSAPP_EMBEDDED_SIGNUP_CONFIG_ID` set. FoundingOS exchanges the Meta code server-side, confirms the number belongs to the chosen WhatsApp Business Account, subscribes the app and stores the connection as ready. No tokens or webhook settings are copied by the customer.

- **WhatsApp Business app (coexistence):** the same number keeps working in the phone app. Contacts and up to six months of chat history are imported once (Meta allows one sync within 24 hours of connecting). Replies sent from the phone appear in Inbox; imported history never opens the 24-hour service window. Linked companion devices are unlinked once, broadcast lists become read-only and disappearing/view-once/live location are disabled. Groups are not copied. If the customer declines history sharing, it is logged and Inbox starts from new messages.
- **New number:** for numbers not already on WhatsApp. Meta verifies by code; FoundingOS registers the number with a generated two-step PIN.
- A **Retry chat sync** button re-requests the sync if it did not start.

Platform requirements: one global webhook (`/ops/whatsapp/webhook`) subscribed to `messages`, `account_update`, `history`, `smb_app_state_sync` and `smb_message_echoes`. Unpublished Meta apps receive only dashboard test webhooks, so customer numbers must not be connected until the app is published. The current configuration issues 60-day tokens; after Tech Provider approval, replace it with a non-expiring WhatsApp Embedded Signup configuration.

## Manual WhatsApp configuration

Use Meta's [current setup guide](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started). New apps use the WhatsApp use case; older app menus may differ.

| FoundingOS field | Meta source |
| --- | --- |
| Access token | API Setup for temporary testing. Business Settings → System users → assign the app/WhatsApp assets → Generate token for production. |
| Phone number ID | API Setup. Not the displayed number or Business Account ID. |
| Verify token | Generate your own value in FoundingOS. Repeat exactly in Meta's webhook form. |
| App secret | App settings → Basic. Validates signed incoming requests. |
| Business Account ID | API Setup; optional in the current connector. |

The in-app guide includes system-user asset assignment and Meta's listed `business_management`, `whatsapp_business_messaging` and `whatsapp_business_management` permissions. Temporary tokens expire. Follow Meta's current number eligibility, publishing, review and verification requirements.

Callback: configured API root + `/ops/whatsapp/webhook/:tenantId`. Save credentials first, verify the callback in Meta, then subscribe to `messages`. Test-number recipients must be verified in Meta API Setup.

## Actual messaging behaviour

- Retail and Marketing production Inbox read the shared tenant's real WhatsApp conversations, not workspace demo records. Email/SMS threads are not implemented here.
- Non-staff customer contacts are stored in Inbox without executing business commands or receiving an unauthorised-staff warning. Only explicitly authorised messaging participants can issue operational commands.
- Owner/manager access and tenant scope apply to list, thread, reply and diagnostic endpoints.
- Replies require explicit opt-in confirmation, an inbound message within 24 hours and an idempotency key. Provider failures persist a failed message and return an error. A queued or failed retry does not automatically resend.
- `sent` means accepted by Meta, not delivered. Signed status callbacks advance delivery/read state without allowing older callbacks to downgrade it.
- Tenant webhooks validate the expected phone ID before processing; configured numbers cannot be reassigned from another company.
- Replacing a company's WhatsApp phone disables its previous channel connection.
- Connection checks show credential verification, webhook verification, incoming messages, accepted replies and delivery confirmation separately. They are historical evidence, not a guarantee of future availability.

## Deployment and validation boundaries

The shared CORS policy permits `Idempotency-Key` while preserving the origin allowlist. Tests cover consent, tenant isolation, closed windows, duplicate replies, provider errors, webhook phone scope, delivery ordering and encrypted sign-in handoff. The website typecheck and production builds must pass before publication.

Live signup and product persistence were verified using an authorised free QA account with clearly named test products. No paid checkout or real customer messaging is authorised as part of those QA checks. Live Meta verification requires the owner to enter credentials in the app, configure Meta and nominate an opted-in test contact.

The customer tutorial should teach signup, product setup, finding Meta credentials, callback configuration and Inbox use; internal audit findings and development backlog belong outside the video. Any illustrated conversation must be labelled as an example, never presented as delivery evidence.

Meta Embedded Signup is implemented for web and its web-backed Mac app; live customer onboarding waits for app publishing, business verification and Tech Provider approval. Native mobile has separate screens.
