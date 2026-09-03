/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'
import { brands } from '@foundingos/config'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundHealth",
  "logo": "✚",
  "accent": "#33CCFF",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#00A896",
    "secondary": "#0A3D38",
    "accent": "#33CCFF",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
      "title": "Patients, scheduling, records",
      "subtitle": "Track daily health operations across patients, appointments, records, staffing, and compliance.",
      "metrics": [
          {
              "label": "Appointments Today",
              "value": "142",
              "trend": "+8",
              "icon": "▶",
              "tone": "good"
          },
          {
              "label": "Avg Wait Time",
              "value": "14 min",
              "trend": "-4m",
              "icon": "◈",
              "tone": "good"
          },
          {
              "label": "Compliance Score",
              "value": "97%",
              "trend": "+1%",
              "icon": "✓",
              "tone": "good"
          }
      ],
      "tableTitle": "Operational snapshot",
      "tableHeaders": [
          "Clinic",
          "Status",
          "Load",
          "Action"
      ],
      "tableRows": [
          [
              "Manchester Central",
              "Healthy",
              "82%",
              "Monitor"
          ],
          [
              "Leeds North",
              "Busy",
              "94%",
              "Review"
          ],
          [
              "Bristol West",
              "Stable",
              "68%",
              "Monitor"
          ]
      ],
      "workflows": [
          "Review Appointments workflow active",
          "Update Patient Record workflow active",
          "Check Compliance workflow active",
          "Run Staffing Review workflow active"
      ]
    },
  "modules": [
    {
          "id": "patients",
          "label": "Patients",
          "description": "FoundHealth patients workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Active Patients",
                      "value": "1,284",
                      "trend": "+22",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "New This Week",
                      "value": "36",
                      "trend": "+4",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Follow-ups Due",
                      "value": "18",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Add Patient",
                "Update Record",
                "Schedule Follow-up",
                "Export Summary"
          ],
          "workflow": [
                "Review Patients queue",
                "Update Patients records",
                "Publish Patients report"
          ]
    },
    {
          "id": "appointments",
          "label": "Appointments",
          "description": "FoundHealth appointments workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Booked Today",
                      "value": "142",
                      "trend": "+8",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Fill Rate",
                      "value": "91%",
                      "trend": "+3%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "No-shows",
                      "value": "5",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Book Appointment",
                "Reschedule",
                "Send Reminder",
                "Export Schedule"
          ],
          "workflow": [
                "Review Appointments queue",
                "Update Appointments records",
                "Publish Appointments report"
          ]
    },
    {
          "id": "records",
          "label": "Records",
          "description": "FoundHealth records workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Records Updated",
                      "value": "312",
                      "trend": "This week",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Pending Review",
                      "value": "11",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Data Accuracy",
                      "value": "98.6%",
                      "trend": "+0.4%",
                      "icon": "✓",
                      "tone": "good"
                }
          ],
          "actions": [
                "Update Record",
                "Flag Discrepancy",
                "Archive Record",
                "Export Records"
          ],
          "workflow": [
                "Review Records queue",
                "Update Records records",
                "Publish Records report"
          ]
    },
    {
          "id": "compliance",
          "label": "Compliance",
          "description": "FoundHealth compliance workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Audit Readiness",
                      "value": "97%",
                      "trend": "+1%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Open Actions",
                      "value": "3",
                      "trend": "Due this month",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Policies Reviewed",
                      "value": "21",
                      "trend": "This quarter",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Review Policy",
                "Log Audit Note",
                "Assign Action",
                "Export Compliance Report"
          ],
          "workflow": [
                "Review Compliance queue",
                "Update Compliance records",
                "Publish Compliance report"
          ]
    },
    {
          "id": "billing",
          "label": "Billing",
          "description": "FoundHealth billing workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Claims Submitted",
                      "value": "96",
                      "trend": "This week",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Approved",
                      "value": "89%",
                      "trend": "+2%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Pending",
                      "value": "11",
                      "trend": "Awaiting review",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Submit Claim",
                "Chase Payer",
                "Apply Adjustment",
                "Export Statement"
          ],
          "workflow": [
                "Review Billing queue",
                "Update Billing records",
                "Publish Billing report"
          ]
    },
    {
          "id": "referrals",
          "label": "Referrals",
          "description": "FoundHealth referrals workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Active Referrals",
                      "value": "58",
                      "trend": "+6",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Avg Turnaround",
                      "value": "3.2 days",
                      "trend": "-0.3d",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Awaiting Specialist",
                      "value": "9",
                      "trend": "Needs follow-up",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Send Referral",
                "Update Status",
                "Escalate Case",
                "Export Referral List"
          ],
          "workflow": [
                "Review Referrals queue",
                "Update Referrals records",
                "Publish Referrals report"
          ]
    },
    {
          "id": "staffing",
          "label": "Staffing",
          "description": "FoundHealth staffing workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "On Shift",
                      "value": "38",
                      "trend": "Today",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Coverage",
                      "value": "94%",
                      "trend": "+2%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Open Shifts",
                      "value": "4",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Assign Shift",
                "Approve Leave",
                "Review Coverage",
                "Export Roster"
          ],
          "workflow": [
                "Review Staffing queue",
                "Update Staffing records",
                "Publish Staffing report"
          ]
    },
    {
          "id": "supplies",
          "label": "Supplies",
          "description": "FoundHealth supplies workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Stock Level",
                      "value": "88%",
                      "trend": "Healthy",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Low Stock Items",
                      "value": "6",
                      "trend": "Needs reorder",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Orders In Transit",
                      "value": "3",
                      "trend": "This week",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Reorder Supply",
                "Log Delivery",
                "Flag Shortage",
                "Export Inventory"
          ],
          "workflow": [
                "Review Supplies queue",
                "Update Supplies records",
                "Publish Supplies report"
          ]
    },
    {
          "id": "telehealth",
          "label": "Telehealth",
          "description": "FoundHealth telehealth workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Sessions Today",
                      "value": "24",
                      "trend": "+3",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Satisfaction",
                      "value": "4.7/5",
                      "trend": "+0.1",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Technical Issues",
                      "value": "1",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Start Session",
                "Reschedule Call",
                "Log Outcome",
                "Export Session Notes"
          ],
          "workflow": [
                "Review Telehealth queue",
                "Update Telehealth records",
                "Publish Telehealth report"
          ]
    },
      {
          "id": "appointment-manager",
          "label": "Appointment Manager",
          "description": "Book, reschedule, and track appointments across every clinic.",
          "metrics": [
                {
                      "label": "Appointments Today",
                      "value": "142",
                      "trend": "+8",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Cancellations",
                      "value": "4",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "No-shows",
                      "value": "2",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "Book Appointment",
                "Reschedule",
                "Cancel Appointment",
                "Export Schedule"
          ],
          "workflow": [
                "Review Appointment Manager queue",
                "Update Appointment Manager records",
                "Publish Appointment Manager report"
          ]
    },
    {
          "id": "patient-notes",
          "label": "Patient Notes",
          "description": "Keep clinical notes organised and accessible to the care team.",
          "metrics": [
                {
                      "label": "Notes Added Today",
                      "value": "48",
                      "trend": "+6",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Pending Review",
                      "value": "5",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Flagged",
                      "value": "1",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "Add Note",
                "Review Note",
                "Flag Note",
                "Export Notes"
          ],
          "workflow": [
                "Review Patient Notes queue",
                "Update Patient Notes records",
                "Publish Patient Notes report"
          ]
    },
    {
          "id": "accounting",
          "label": "Accounting",
          "description": "Track cashflow, invoices, and reconciliation in one workspace.",
          "metrics": [
                {
                      "label": "Cash Position",
                      "value": "\u00a362.4k",
                      "trend": "+\u00a34.1k",
                      "icon": "\u00a3",
                      "tone": "good"
                },
                {
                      "label": "Overdue Invoices",
                      "value": "7",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Reconciled",
                      "value": "94%",
                      "trend": "This month",
                      "icon": "\u2713",
                      "tone": "good"
                }
          ],
          "actions": [
                "Create Invoice",
                "Reconcile Accounts",
                "Export Ledger",
                "Review Overdue"
          ],
          "workflow": [
                "Review Ledger",
                "Reconcile Transactions",
                "Publish Report"
          ]
    },
    {
          "id": "messaging",
          "label": "Messaging",
          "description": "Manage conversations, templates, and automation across channels.",
          "metrics": [
                {
                      "label": "Open Conversations",
                      "value": "34",
                      "trend": "12 unread",
                      "icon": "\u2709",
                      "tone": "watch"
                },
                {
                      "label": "Avg Response",
                      "value": "4m",
                      "trend": "-1m",
                      "icon": "\u23f1",
                      "tone": "good"
                },
                {
                      "label": "Automation Rate",
                      "value": "58%",
                      "trend": "+5%",
                      "icon": "\u25c9",
                      "tone": "good"
                }
          ],
          "actions": [
                "Open Inbox",
                "Create Template",
                "Assign Conversation",
                "Review Automation"
          ],
          "workflow": [
                "Triage Inbox",
                "Respond to Customer",
                "Close Conversation"
          ]
    },
    {
          "id": "customer-service",
          "label": "Customer Service",
          "description": "Resolve tickets and track satisfaction across every customer touchpoint.",
          "metrics": [
                {
                      "label": "Open Tickets",
                      "value": "21",
                      "trend": "5 urgent",
                      "icon": "\u25b2",
                      "tone": "watch"
                },
                {
                      "label": "CSAT",
                      "value": "92%",
                      "trend": "+2%",
                      "icon": "\u2661",
                      "tone": "good"
                },
                {
                      "label": "Avg Resolution",
                      "value": "2h 40m",
                      "trend": "-20m",
                      "icon": "\u23f1",
                      "tone": "good"
                }
          ],
          "actions": [
                "Open Ticket Queue",
                "Escalate Ticket",
                "Reply to Customer",
                "Review CSAT"
          ],
          "workflow": [
                "Triage Ticket",
                "Resolve Ticket",
                "Close Ticket"
          ]
    },
    {
          "id": "ai-demo",
          "label": "AI Demo",
          "description": "See FoundAI's suggestions and autonomous actions for this brand in action.",
          "metrics": [
                {
                      "label": "AI Actions Today",
                      "value": "48",
                      "trend": "+12",
                      "icon": "\u25c6",
                      "tone": "good"
                },
                {
                      "label": "Suggestions Accepted",
                      "value": "76%",
                      "trend": "+4%",
                      "icon": "\u2713",
                      "tone": "good"
                },
                {
                      "label": "Automations Live",
                      "value": "9",
                      "trend": "Stable",
                      "icon": "\u25c9",
                      "tone": "good"
                }
          ],
          "actions": [
                "Run AI Demo",
                "Review Suggestions",
                "Configure Automation",
                "View AI Log"
          ],
          "workflow": [
                "Generate Suggestion",
                "Review Suggestion",
                "Apply Automation"
          ]
    }
  ],
  "crm": {
      "title": "FoundHealth CRM",
      "summary": "FoundHealth CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
      "records": [
          {
              "name": "Riverside Family Practice",
              "type": "Partner Clinic",
              "stage": "Active",
              "value": "1,284 patients",
              "nextAction": "Update Record"
          },
          {
              "name": "Chen Physiotherapy Group",
              "type": "Referral Partner",
              "stage": "Active",
              "value": "58 referrals",
              "nextAction": "Send Referral"
          },
          {
              "name": "MedSupply Direct",
              "type": "Vendor",
              "stage": "Order pending",
              "value": "3 orders",
              "nextAction": "Reorder Supply"
          }
      ],
      "pipeline": [
          "New",
          "Qualified",
          "Active",
          "Won"
      ],
      "tasks": [
          "Update Record",
          "Send Referral",
          "Reorder Supply",
          "Review Compliance"
      ]
    },
  "navigation": [
    {
      "label": "Dashboard",
      "href": "/dashboard",
      "icon": "▦",
      "section": "Core"
    },
    {
      "label": "Demos & Surveys",
      "href": `${brands.foundingos.consoleUrl}/tester/dashboard?fromBrand=health`,
      "icon": "🧭",
      "section": "Core"
    },
    {
      "label": "Intelligence",
      "href": "/intelligence",
      "icon": "◈",
      "section": "Analytics"
    },
    {
      "label": "CRM",
      "href": "/crm",
      "icon": "◎",
      "section": "Core"
    },
        {
      "label": "Patients",
      "href": "/modules/patients",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Appointments",
      "href": "/modules/appointments",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Records",
      "href": "/modules/records",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Compliance",
      "href": "/modules/compliance",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Billing",
      "href": "/modules/billing",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Referrals",
      "href": "/modules/referrals",
      "icon": "▣",
      "section": "Modules"
    },
{
      "label": "Accounting",
      "href": "/modules/accounting",
      "icon": "banknotes",
      "section": "Modules"
    },
    {
      "label": "Messaging",
      "href": "/modules/messaging",
      "icon": "chat-bubble-left-right",
      "section": "Modules"
    },
    {
      "label": "Customer Service",
      "href": "/modules/customer-service",
      "icon": "lifebuoy",
      "section": "Modules"
    },
        {
      "label": "Sales",
      "href": "/modules/sales",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "FoundAI Demo",
      "href": "/modules/foundai-demo",
      "icon": "sparkles",
      "section": "Modules"
    },
    {
      "label": "Appointment Manager",
      "href": "/modules/appointment-manager",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Patient Notes",
      "href": "/modules/patient-notes",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Settings",
      "href": "/settings",
      "icon": "⚙",
      "section": "Core"
    }
  ],
  "quickActions": [
    "Book Appointment",
    "Update Record",
    "Send Referral",
    "Review Compliance"
  ],
  "settings": [
    "Data Access Controls",
    "Appointment Rules",
    "Compliance Thresholds",
    "Alert Preferences",
    "Staffing Rota",
    "CRM Configuration"
  ]
}
