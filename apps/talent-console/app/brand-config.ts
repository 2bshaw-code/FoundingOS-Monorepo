/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'
import { brands } from '@foundingos/config'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundTalent",
  "logo": "⬢",
  "accent": "#FF8800",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#E2A84A",
    "secondary": "#3D2B12",
    "accent": "#FF8800",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Candidates, jobs, pipelines",
    "subtitle": "Coordinate candidates, roles, recruiter activity, interviews, offers, and onboarding progress.",
    "metrics": [
      {
        "label": "Applicants",
        "value": "1,284",
        "trend": "Active",
        "icon": "◍",
        "tone": "good"
      },
      {
        "label": "Jobs Active",
        "value": "38",
        "trend": "Hiring now",
        "icon": "▦",
        "tone": "good"
      },
      {
        "label": "Recruiter Pipeline",
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
      "Interviews",
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
      "id": "ats",
      "label": "Ats",
      "description": "FoundTalent ats workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
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
      "description": "FoundTalent crm workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review CRM queue",
        "Update CRM records",
        "Publish CRM report"
      ]
    },
    {
      "id": "onboarding",
      "label": "Onboarding",
      "description": "FoundTalent onboarding workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Onboarding queue",
        "Update Onboarding records",
        "Publish Onboarding report"
      ]
    },
    {
      "id": "candidates",
      "label": "Candidates",
      "description": "FoundTalent candidates workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
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
      "description": "FoundTalent jobs workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
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
      "description": "FoundTalent pipelines workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Pipelines queue",
        "Update Pipelines records",
        "Publish Pipelines report"
      ]
    },
    {
      "id": "interviews",
      "label": "Interviews",
      "description": "FoundTalent interviews workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
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
      "description": "FoundTalent offers workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Offers queue",
        "Update Offers records",
        "Publish Offers report"
      ]
    }
  ,
        {
          "id": "candidate-pipeline",
          "label": "Candidate Pipeline",
          "description": "Track candidates from application through offer in one pipeline view.",
          "metrics": [
                {
                      "label": "Active Candidates",
                      "value": "142",
                      "trend": "+9",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Interviews Scheduled",
                      "value": "18",
                      "trend": "This week",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Offers Extended",
                      "value": "5",
                      "trend": "Awaiting response",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Add Candidate",
                "Schedule Interview",
                "Extend Offer",
                "Export Pipeline"
          ],
          "workflow": [
                "Review Candidate Pipeline queue",
                "Update Candidate Pipeline records",
                "Publish Candidate Pipeline report"
          ]
    },
    {
          "id": "cv-parser",
          "label": "CV Parser",
          "description": "Automatically parse and structure incoming CVs for faster review.",
          "metrics": [
                {
                      "label": "CVs Parsed Today",
                      "value": "36",
                      "trend": "+4",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Parse Accuracy",
                      "value": "96%",
                      "trend": "+1%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Manual Reviews",
                      "value": "3",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Upload CV",
                "Review Parse",
                "Correct Field",
                "Export Parsed Data"
          ],
          "workflow": [
                "Review CV Parser queue",
                "Update CV Parser records",
                "Publish CV Parser report"
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
    "title": "FoundTalent CRM",
    "summary": "FoundTalent CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "Store Manager",
        "type": "Candidates",
        "stage": "42 candidates",
        "value": "8",
        "nextAction": "Add Candidate"
      },
      {
        "name": "Data Analyst",
        "type": "Candidates",
        "stage": "31 candidates",
        "value": "5",
        "nextAction": "Create Job"
      },
      {
        "name": "Recruiter",
        "type": "Candidates",
        "stage": "22 candidates",
        "value": "4",
        "nextAction": "Schedule Interview"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Add Candidate",
      "Create Job",
      "Schedule Interview",
      "Start Onboarding"
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
      "href": `${brands.foundingos.consoleUrl}/tester/dashboard?fromBrand=talent`,
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
      "label": "Ats",
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
      "label": "Onboarding",
      "href": "/modules/onboarding",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Candidates",
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
      "label": "Candidate Pipeline",
      "href": "/modules/candidate-pipeline",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "CV Parser",
      "href": "/modules/cv-parser",
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
    "Add Candidate",
    "Create Job",
    "Schedule Interview",
    "Start Onboarding"
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
