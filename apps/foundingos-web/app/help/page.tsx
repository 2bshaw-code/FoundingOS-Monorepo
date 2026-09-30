/*
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Public user guide (outside the site access gate, see middleware.ts matcher) so new customers
// and invited teammates can read it before they have an account. Keep steps in line with the app.
import type { ReactNode } from 'react'
import { AI_DISCLAIMER_LONG } from '@foundingos/ui/ai-disclaimer'

export const metadata = {
  title: 'User guide — FoundingOS',
  description: 'Step by step help for setting up FoundingOS, importing your data and inviting your team.',
}

const sections: Array<[string, string]> = [
  ['access', 'Getting in'],
  ['account', 'Creating your account'],
  ['sign-in', 'Signing in'],
  ['tour', 'Finding your way around'],
  ['details', 'Adding your business details'],
  ['import', 'Importing your data'],
  ['add', 'Adding records by hand'],
  ['team', 'Inviting your team'],
  ['joining', 'Joining a team you were invited to'],
  ['connect', 'Connecting WhatsApp, payments and email'],
  ['foundai', 'Using FoundAI'],
  ['export', 'Getting your data out'],
  ['apps', 'Installing the apps'],
  ['help', 'Getting help'],
]

function Steps({ children }: { children: ReactNode }) {
  return <ol style={{ paddingLeft: 22, lineHeight: 1.7 }}>{children}</ol>
}

function Tip({ children }: { children: ReactNode }) {
  return <p style={{ borderLeft: '3px solid #24c47a', padding: '6px 12px', background: 'rgba(36,196,122,0.08)', borderRadius: 6 }}><strong>Tip: </strong>{children}</p>
}

export default function UserGuidePage() {
  return (
    <main className="complete-workspace-access">
      <section className="privacy-policy" style={{ maxWidth: 760, textAlign: 'left' }}>
        <div className="complete-workspace-access-brand"><span>F</span><div><strong>FoundingOS</strong><small>User guide</small></div></div>
        <p className="eyebrow">Last updated 1 October 2026</p>
        <h1>User guide</h1>
        <p>
          This guide takes you from a brand new account to a working business in FoundingOS. Follow the steps in
          order the first time. Each part is short, and you can come back to any of them later.
        </p>

        <nav aria-label="Guide contents">
          <h2>Contents</h2>
          <ol style={{ paddingLeft: 22, lineHeight: 1.8 }}>
            {sections.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}
          </ol>
        </nav>

        <h2 id="access">1. Getting in</h2>
        <p>FoundingOS is in private preview, so the website asks you to sign in before you see it.</p>
        <Steps>
          <li>Go to <a href="https://www.foundingos.com">www.foundingos.com</a>.</li>
          <li>On the <strong>Sign in to FoundingOS</strong> page, enter your email address and the invitation code we sent you.</li>
          <li>Press <strong>Open FoundingOS</strong>.</li>
        </Steps>
        <Tip>If a teammate invited you, you do not need a code. Open the link they sent you and follow <a href="#joining">Joining a team you were invited to</a>.</Tip>

        <h2 id="account">2. Creating your account</h2>
        <Steps>
          <li>Go to <a href="https://www.foundingos.com/signup">www.foundingos.com/signup</a>.</li>
          <li>Fill in <strong>Your name</strong>, <strong>Business name</strong> and <strong>Work email</strong>.</li>
          <li>Choose a password of at least 12 characters. A short sentence you will remember works well.</li>
          <li>
            Pick a plan:
            <ul>
              <li><strong>Lite</strong> is free for one person, so you can try things out.</li>
              <li><strong>Core</strong> is £19 a month for each workspace and includes 3 users.</li>
              <li><strong>Complete</strong> is £89 a month and includes 15 users.</li>
              <li><strong>Enterprise</strong> is for larger groups. Contact us and we will set it up with you.</li>
            </ul>
          </li>
          <li>Tick the workspaces you need, such as Retail &amp; Logistics, Talent, HR or Health, and any bolt ons such as Commerce Pro or Core.Intelligence. Extra team members are £5 a month each.</li>
          <li>Finish the form. On a paid plan you go to a secure Stripe page to pay by card. On Lite you see <strong>Your account is ready</strong> straight away.</li>
        </Steps>
        <Tip>You can start on Lite and move to a paid plan later. Nothing you add is lost when you upgrade.</Tip>

        <h2 id="sign-in">3. Signing in</h2>
        <Steps>
          <li>Go to <a href="https://www.foundingos.com/app">www.foundingos.com/app</a>, or open the FoundingOS app on your computer or phone.</li>
          <li>Enter the email and password you chose when you created your account.</li>
          <li>You arrive on your workspace home. Your data is the same on the web, desktop and mobile apps.</li>
        </Steps>
        <p>To leave, press <strong>Sign out</strong>. Always sign out on shared computers.</p>

        <h2 id="tour">4. Finding your way around</h2>
        <ul style={{ lineHeight: 1.7 }}>
          <li><strong>Workspaces</strong> are the big areas of your business: Retail, Logistics, Finance, Marketing, Talent, HR, Health and Intelligence. You only see the ones on your plan.</li>
          <li><strong>Modules</strong> are the lists inside each workspace, such as customers, orders, products or candidates. Pick one from the side menu.</li>
          <li><strong>Search</strong> at the top jumps to any workspace, module or record. Start typing a name.</li>
          <li><strong>Administration</strong> holds Team &amp; access, Integrations, Security &amp; Access and Settings.</li>
        </ul>
        <Tip>Want to look around before adding real data? Press <strong>Load demo data</strong>. Press <strong>Back to my data</strong> when you are done.</Tip>

        <h2 id="details">5. Adding your business details</h2>
        <Steps>
          <li>Open <strong>Settings</strong> in the Administration part of the menu.</li>
          <li>Check your business name and pick your operating region. This sets your currency and date format.</li>
          <li>Save your changes.</li>
        </Steps>

        <h2 id="import">6. Importing your data</h2>
        <p>
          You can bring in customers, products, orders, suppliers, staff and more from a spreadsheet, so you do not
          have to type them again. Each import goes into the list you have open, and you can import up to 500 rows
          at a time.
        </p>
        <h3>Step A: Get a CSV file from your old system</h3>
        <p>FoundingOS reads CSV files, which every spreadsheet and accounting tool can make.</p>
        <ul style={{ lineHeight: 1.7 }}>
          <li><strong>Excel:</strong> File, Save As, then choose <em>CSV UTF-8 (Comma delimited)</em>.</li>
          <li><strong>Google Sheets:</strong> File, Download, then <em>Comma separated values (.csv)</em>.</li>
          <li><strong>Numbers:</strong> File, Export To, then <em>CSV</em>.</li>
          <li><strong>Xero, QuickBooks, Shopify and most other tools:</strong> look for <em>Export</em> on the contacts, customers or products list and choose CSV.</li>
        </ul>
        <p>Make sure the first row of the file holds the column names, such as Name, Email, Phone and Status.</p>
        <h3>Step B: Import it</h3>
        <Steps>
          <li>Open the workspace and the list you want to fill, for example Retail then Customers.</li>
          <li>Press <strong>Import</strong> in the toolbar, next to Export CSV.</li>
          <li>Press <strong>Choose CSV file</strong> and pick your file. Not sure how to lay it out? Press <strong>Download a blank template</strong>, fill it in and use that.</li>
          <li>
            Check the columns. FoundingOS guesses which column in your file matches each field. Change any that are
            wrong, or choose <em>Not in my file</em> for fields you do not have. Only the name is required.
          </li>
          <li>Look at the preview of the first rows to make sure they look right.</li>
          <li>If some rows are already in FoundingOS, leave the <strong>Skip already in FoundingOS</strong> box ticked so you do not get doubles.</li>
          <li>Press the <strong>Import</strong> button at the bottom. Keep the window open until the bar finishes.</li>
          <li>You will see how many rows went in. If any could not be saved, press <strong>Download the ones that did not import</strong>, fix them in your spreadsheet and import that file.</li>
        </Steps>
        <Tip>Names split into First name and Last name columns are joined for you. Dates written the UK way, like 31/12/2026, are understood.</Tip>
        <Tip>Have more than 500 rows? Split the file into smaller files and import them one after another.</Tip>

        <h2 id="add">7. Adding records by hand</h2>
        <Steps>
          <li>Open the list you want, for example Customers.</li>
          <li>Press <strong>+ New</strong>. The button names the record, such as + New customer.</li>
          <li>Fill in the details and save. The record appears in the list.</li>
          <li>Open any record to edit it, add notes, attach files or move it to the next stage.</li>
        </Steps>

        <h2 id="team">8. Inviting your team</h2>
        <Steps>
          <li>Open <strong>Team &amp; access</strong> in the Administration part of the menu.</li>
          <li>Press <strong>+ Invite team member</strong>.</li>
          <li>Enter your teammate&apos;s email address.</li>
          <li>
            Choose their role:
            <ul>
              <li><strong>Viewer</strong> can look but not change anything.</li>
              <li><strong>Operator</strong> can work in their workspaces but cannot approve.</li>
              <li><strong>Manager</strong> can work in their workspaces and approve.</li>
              <li><strong>Owner</strong> can do everything, including team and settings.</li>
            </ul>
          </li>
          <li>Tick the workspaces they should see.</li>
          <li>Press <strong>Create invitation</strong>. A box shows their personal invite link.</li>
          <li>Press <strong>Copy link</strong>, <strong>Send on WhatsApp</strong> or <strong>Send by email</strong> to share it. The link works once and lasts 72 hours.</li>
        </Steps>
        <Tip>Link expired or lost? Press <strong>New link</strong> next to their name in Pending invitations and share the new one. Press <strong>Revoke</strong> to cancel an invite. You can change a role or press <strong>Suspend</strong> at any time.</Tip>

        <h2 id="joining">9. Joining a team you were invited to</h2>
        <Steps>
          <li>Open the invite link your teammate sent you.</li>
          <li>Check the business name, your email and your role.</li>
          <li>Choose a password of at least 12 characters and type it again to confirm.</li>
          <li>Press <strong>Accept invitation</strong>, then <strong>Continue to sign in</strong>.</li>
          <li>Sign in with your email and new password.</li>
        </Steps>

        <h2 id="connect">10. Connecting WhatsApp, payments and email</h2>
        <p>Open <strong>Integrations</strong> in the Administration part of the menu. For each one, press <strong>Configure</strong>, paste the details and press <strong>Save and check</strong>. FoundingOS tells you straight away whether it worked.</p>
        <ul style={{ lineHeight: 1.7 }}>
          <li><strong>WhatsApp Business:</strong> from your Meta Business account you need the access token, phone number ID, verify token and app secret. The FoundingOS mobile app shows the webhook address to paste back into Meta.</li>
          <li><strong>Stripe payments:</strong> your Stripe secret key and webhook secret, from the Developers section of Stripe.</li>
          <li><strong>Email (Resend):</strong> your Resend API key and the address emails should come from.</li>
          <li><strong>Facebook, Instagram and LinkedIn:</strong> follow the steps shown on screen to link your pages.</li>
        </ul>
        <Tip>Your keys are stored encrypted. Never share them in chat or by email.</Tip>

        <h2 id="foundai">11. Using FoundAI</h2>
        <p>
          FoundAI is the assistant built into FoundingOS. Ask it questions in plain words, by typing or speaking,
          such as &ldquo;Which customers have not ordered this month?&rdquo; or &ldquo;How are prices moving for my products?&rdquo;
          On SuperDash and the higher plans it also follows market trends, national prices and competitors for you.
        </p>
        <p><strong>{AI_DISCLAIMER_LONG}</strong></p>

        <h2 id="export">12. Getting your data out</h2>
        <Steps>
          <li>Open any list and press <strong>Export CSV</strong> to download everything in it.</li>
          <li>To download only some records, tick them and press <strong>Export selected</strong>.</li>
          <li>Owners can download a full record of account activity with <strong>Export governance data</strong>.</li>
        </Steps>
        <p>Your data belongs to you. You can take it with you at any time.</p>

        <h2 id="apps">13. Installing the apps</h2>
        <ul style={{ lineHeight: 1.7 }}>
          <li><strong>Web:</strong> nothing to install. Use any modern browser at www.foundingos.com/app.</li>
          <li><strong>Mac and Windows:</strong> ask us for the FoundingOS desktop installer. On a Mac, open it and drag FoundingOS into Applications. On Windows, run it and follow the steps.</li>
          <li><strong>iPhone and Android:</strong> we will send you a link to install the FoundingOS app while it is in preview.</li>
        </ul>
        <p>Sign in with the same email and password everywhere. Updates arrive on their own.</p>

        <h2 id="help">14. Getting help</h2>
        <ul style={{ lineHeight: 1.7 }}>
          <li>Questions or problems: <a href="mailto:hello@foundingos.com">hello@foundingos.com</a></li>
          <li>Privacy and your data: <a href="mailto:privacy@foundingos.com">privacy@foundingos.com</a>, or read our <a href="/privacy">Privacy &amp; Cookies</a> page.</li>
        </ul>
      </section>
    </main>
  )
}
