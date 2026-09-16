/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "Core.Health",
  "logo": "⬢",
  "accent": "#3AA6A0",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#3AA6A0",
    "secondary": "#0F2C2A",
    "accent": "#3AA6A0",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Patients, appointments, billing",
    "subtitle": "Coordinate patients, appointments, clinical records, treatments, and medical billing.",
    "metrics": [
      {
        "label": "Patients",
        "value": "1,284",
        "trend": "Active",
        "icon": "◍",
        "tone": "good"
      },
      {
        "label": "Appointments Today",
        "value": "38",
        "trend": "Hiring now",
        "icon": "▦",
        "tone": "good"
      },
      {
        "label": "Billing Reconciled",
        "value": "72%",
        "trend": "Moving",
        "icon": "◌",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "Role",
      "Pipeline",
      "Treatments",
      "Owner"
    ],
    "tableRows": [
      [
        "Store Manager",
        "42 candidates",
        "8",
        "Ava"
      ],
      [
        "Data Analyst",
        "31 candidates",
        "5",
        "Noah"
      ],
      [
        "Recruiter",
        "22 candidates",
        "4",
        "Mia"
      ]
    ],
    "workflows": [
      "Add Candidate workflow active",
      "Create Job workflow active",
      "Schedule Interview workflow active",
      "Start Onboarding workflow active"
    ]
  },
  "modules": [
    {
      "id": "clinical",
      "label": "Clinical",
      "description": "CoreHealth ats workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Ats queue",
        "Update Ats records",
        "Publish Ats report"
      ]
    },
    {
      "id": "crm",
      "label": "CRM",
      "description": "CoreHealth crm workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review CRM queue",
        "Update CRM records",
        "Publish CRM report"
      ]
    },
    {
      "id": "billing",
      "label": "Billing",
      "description": "CoreHealth onboarding workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Onboarding queue",
        "Update Onboarding records",
        "Publish Onboarding report"
      ]
    },
    {
      "id": "candidates",
      "label": "Patients",
      "description": "CoreHealth candidates workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Candidates queue",
        "Update Candidates records",
        "Publish Candidates report"
      ]
    },
    {
      "id": "jobs",
      "label": "Jobs",
      "description": "CoreHealth jobs workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Jobs queue",
        "Update Jobs records",
        "Publish Jobs report"
      ]
    },
    {
      "id": "pipelines",
      "label": "Pipelines",
      "description": "CoreHealth pipelines workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Pipelines queue",
        "Update Pipelines records",
        "Publish Pipelines report"
      ]
    },
    {
      "id": "interviews",
      "label": "Treatments",
      "description": "CoreHealth interviews workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Interviews queue",
        "Update Interviews records",
        "Publish Interviews report"
      ]
    },
    {
      "id": "offers",
      "label": "Offers",
      "description": "CoreHealth offers workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Patients",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Appointments",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Treatments",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Patient",
        "Book Appointment",
        "Start Treatment",
        "Send Invoice"
      ],
      "workflow": [
        "Review Offers queue",
        "Update Offers records",
        "Publish Offers report"
      ]
    }
  ,
    {
          "id": "marketing-suite",
          "label": "Marketing Suite",
          "description": "Plan, launch, and track marketing campaigns across every channel.",
          "metrics": [
                {
                      "label": "Campaigns Live",
                      "value": "12",
                      "trend": "+3 this week",
                      "icon": "\u25b6",
                      "tone": "good"
                },
                {
                      "label": "Reach",
                      "value": "48.2k",
                      "trend": "+6%",
                      "icon": "\u25c8",
                      "tone": "good"
                },
                {
                      "label": "Conversion",
                      "value": "3.8%",
                      "trend": "Stable",
                      "icon": "%",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Launch Campaign",
                "Duplicate Template",
                "Schedule Send",
                "Review Analytics"
          ],
          "workflow": [
                "Draft Campaign",
                "Approve Campaign",
                "Publish Campaign"
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
          "description": "See IntelligenceAI's suggestions and autonomous actions for this brand in action.",
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
    "title": "CoreHealth CRM",
    "summary": "CoreHealth CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "Store Manager",
        "type": "Patients",
        "stage": "42 candidates",
        "value": "8",
        "nextAction": "Add Patient"
      },
      {
        "name": "Data Analyst",
        "type": "Patients",
        "stage": "31 candidates",
        "value": "5",
        "nextAction": "Book Appointment"
      },
      {
        "name": "Recruiter",
        "type": "Patients",
        "stage": "22 candidates",
        "value": "4",
        "nextAction": "Start Treatment"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Add Patient",
      "Book Appointment",
      "Start Treatment",
      "Send Invoice"
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
      "label": "Clinical",
      "href": "/modules/ats",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "CRM",
      "href": "/modules/crm",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Billing",
      "href": "/modules/onboarding",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Patients",
      "href": "/modules/candidates",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Jobs",
      "href": "/modules/jobs",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Pipelines",
      "href": "/modules/pipelines",
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
    "Add Patient",
    "Book Appointment",
    "Start Treatment",
    "Send Invoice"
  ],
  "settings": [
    "Hiring Workflow",
    "Pipeline Stages",
    "Recruiter Permissions",
    "Candidate Messaging",
    "Offer Templates",
    "CRM Configuration"
  ]
}
