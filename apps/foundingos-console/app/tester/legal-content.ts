/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
// Draft legal content for the FoundRetail tester/investor/lawyer program.
//
// IMPORTANT: this is DRAFT template text generated to a spec, not legal advice, and
// is NOT a substitute for review by a qualified lawyer in the relevant jurisdiction.
// The program already includes a "Commercial Lawyer" reviewer role (LAW-REVIEW) —
// this content should be treated as the starting draft for that review, not as final,
// binding, or "bulletproof". A few specific flags before this goes anywhere real:
//   - A blanket "£0 liability cap" is unlikely to be fully enforceable under UK/EU
//     law for certain claims (e.g. death/personal injury from negligence, fraud) —
//     the text below caps liability "to the maximum extent permitted by law" instead
//     of asserting an absolute cap, which is the honest, defensible framing.
//   - "GDPR compliant" is a legal conclusion, not something generated text can
//     certify — the Privacy Policy below describes actual current data handling
//     (which IS minimal) but compliance itself must be confirmed by the reviewing
//     lawyer, not asserted by this file.
//   - This module is exported to the browser bundle (rendered on the login screen),
//     so it must never contain secrets — it doesn't.

export const LEGAL_CONTENT_VERSION = '2026-08-30.1'

export type LegalDocument = { id: string; title: string; body: string }

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'tos',
    title: '1. Terms of Service',
    body: `FoundRetail, FoundingOS, QuantumOS, IntelligenceOS, and SystemOS (together, "the System") are pre-release software provided for evaluation only.

"Tester" means a person accessing the System with a TST- access code to evaluate a specific module and complete its survey. "Investor" means a person accessing the System with an INV- access code to view the read-only SuperDashboard Demo. "Legal Reviewer" means a person accessing the System with the LAW-REVIEW access code to review UI, terms, compliance, and legal exposure.

By signing in you acknowledge the System is unfinished, pre-release software and may contain bugs, incomplete features, or unexpected behaviour. Access is granted at FoundRetail's sole discretion and may be suspended or revoked at any time, for any reason, without notice.

You must not attempt to reverse engineer, decompile, copy, redistribute, or create derivative works from the System, its code, or its content. All content you access is confidential and proprietary (see Section 7).`,
  },
  {
    id: 'privacy',
    title: '2. Privacy Policy',
    body: `What we collect: your access code (password), which module/survey it is associated with, and the answers you submit in that survey.

What we do NOT collect: your real name (unless you choose to enter one), government ID numbers, financial account details, or payment information.

How it's stored: locally, on the server running this evaluation instance, in a JSON file — not shared with any third party or external service.

How it's used: solely to run the testing/evaluation program and improve the System.

Retention: for the duration of the testing program; data is not automatically deleted afterward unless requested.

Deletion requests: contact the program administrator to request removal of your submitted data.`,
  },
  {
    id: 'nda',
    title: '3. Confidentiality Agreement (NDA)',
    body: `By accepting, you agree not to: share screenshots or recordings of the System; share dashboard contents; share your or anyone else's access code; discuss the contents or logic of internal modules; discuss survey questions or your answers; discuss any metrics shown in the SuperDashboard Demo; or otherwise disclose any part of the System publicly, in any form, without prior written permission from FoundRetail.`,
  },
  {
    id: 'tester-agreement',
    title: '4. Tester Agreement',
    body: `As a Tester, you acknowledge you are testing pre-release software and bugs are expected. You agree to report issues responsibly (via the provided bug report process) rather than exploiting them, and you agree not to attempt unauthorized access to modules, data, or accounts other than the one assigned to you. You agree not to use the System for real business operations, real customer data, or real transactions.`,
  },
  {
    id: 'investor-agreement',
    title: '5. Investor Preview Agreement',
    body: `As an Investor, your access is read-only. Metrics and figures shown in the SuperDashboard Demo are illustrative/demo data for evaluation purposes and are not audited financial statements, guarantees, or promises of future performance. No investment decision should be made in reliance solely on data shown in this preview. FoundRetail is not liable for any interpretation you draw from the demo data.`,
  },
  {
    id: 'legal-scope',
    title: '6. Legal Review Scope',
    body: `The Legal Reviewer's engagement is scoped to reviewing: the user interface, these terms, compliance posture, and legal exposure of the System as presented. The Legal Reviewer is explicitly NOT reviewing business viability, financial projections, or module business logic, and is not responsible for investor decisions made using this System.`,
  },
  {
    id: 'ip',
    title: '7. Intellectual Property',
    body: `All code, visuals, dashboards, modules, surveys, and associated materials are the proprietary property of FoundRetail/FoundingOS. All trademarks and brand names shown are protected. No Tester, Investor, or Legal Reviewer gains any ownership, licence, or reuse rights in the System by virtue of accessing it. No part of the System may be copied, reused, or adapted without prior written permission.`,
  },
  {
    id: 'liability',
    title: '8. Liability',
    body: `To the maximum extent permitted by applicable law, FoundRetail excludes liability for bugs, outages, data loss, incorrect metrics, misinterpretation of dashboards, Tester misuse, or Investor assumptions arising from use of this pre-release System. Nothing in this agreement excludes or limits liability that cannot lawfully be excluded or limited (for example, liability for death or personal injury caused by negligence, or for fraud). Subject to that, liability to Testers and Investors is limited to the greatest extent the law allows. The Legal Reviewer's liability is limited strictly to the scope defined in Section 6.`,
  },
  {
    id: 'compliance',
    title: '9. Compliance Notes',
    body: `This System is designed with data minimization as a default: no financial data and no sensitive personal data is collected, and no data beyond an access code, module assignment, and survey answers is stored. Whether this program is fully GDPR/UK-GDPR compliant in your specific deployment is a legal determination for the Legal Reviewer to confirm, not a status this document can certify on its own. If cookies are introduced later, a cookie policy will need to be added at that time.`,
  },
]
