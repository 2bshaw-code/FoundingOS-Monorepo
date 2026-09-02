/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundingOS",
  "logo": "FO",
  "accent": "#00E0FF",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#4A90E2",
    "secondary": "#0F2742",
    "accent": "#00E0FF",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Ecosystem overview",
    "subtitle": "Monitor brand health, revenue, subscriptions, access, and activity across the full FoundingOS group.",
    "metrics": [
      {
        "label": "Brands",
        "value": "6",
        "trend": "All systems mapped",
        "icon": "▦",
        "tone": "good"
      },
      {
        "label": "MRR",
        "value": "£48.2k",
        "trend": "Portfolio forecast",
        "icon": "£",
        "tone": "good"
      },
      {
        "label": "Approvals",
        "value": "12",
        "trend": "Needs review",
        "icon": "◌",
        "tone": "watch"
      },
      {
        "label": "Health",
        "value": "99.9%",
        "trend": "Infrastructure stable",
        "icon": "✓",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "Brand",
      "Status",
      "Revenue",
      "Owner"
    ],
    "tableRows": [
      [
        "FoundRetail",
        "Live",
        "£12.4k",
        "Retail Ops"
      ],
      [
        "FoundMeat",
        "Live",
        "£8.7k",
        "Supply"
      ],
      [
        "FoundThat",
        "Live",
        "£9.1k",
        "Data"
      ],
      [
        "FoundTalent",
        "Live",
        "£10.2k",
        "Talent"
      ],
      [
        "FoundCrypto",
        "Live",
        "£7.8k",
        "Trading"
      ]
    ],
    "workflows": [
      "Create Brand workflow active",
      "Review Subscriptions workflow active",
      "Audit Activity workflow active",
      "Configure Access workflow active"
    ]
  },
  "modules": [
    {
      "id": "brand-registry",
      "label": "Brand Registry",
      "description": "FoundingOS brand registry workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Brands",
          "value": "6",
          "trend": "All systems mapped",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "MRR",
          "value": "£48.2k",
          "trend": "Portfolio forecast",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Approvals",
          "value": "12",
          "trend": "Needs review",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Create Brand",
        "Review Subscriptions",
        "Audit Activity",
        "Configure Access"
      ],
      "workflow": [
        "Review Brand Registry queue",
        "Update Brand Registry records",
        "Publish Brand Registry report"
      ]
    },
    {
      "id": "subscriptions",
      "label": "Subscriptions",
      "description": "FoundingOS subscriptions workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Brands",
          "value": "6",
          "trend": "All systems mapped",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "MRR",
          "value": "£48.2k",
          "trend": "Portfolio forecast",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Approvals",
          "value": "12",
          "trend": "Needs review",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Create Brand",
        "Review Subscriptions",
        "Audit Activity",
        "Configure Access"
      ],
      "workflow": [
        "Review Subscriptions queue",
        "Update Subscriptions records",
        "Publish Subscriptions report"
      ]
    },
    {
      "id": "activity-log",
      "label": "Activity Log",
      "description": "FoundingOS activity log workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Brands",
          "value": "6",
          "trend": "All systems mapped",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "MRR",
          "value": "£48.2k",
          "trend": "Portfolio forecast",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Approvals",
          "value": "12",
          "trend": "Needs review",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Create Brand",
        "Review Subscriptions",
        "Audit Activity",
        "Configure Access"
      ],
      "workflow": [
        "Review Activity Log queue",
        "Update Activity Log records",
        "Publish Activity Log report"
      ]
    },
    {
      "id": "access-control",
      "label": "Access Control",
      "description": "FoundingOS access control workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Brands",
          "value": "6",
          "trend": "All systems mapped",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "MRR",
          "value": "£48.2k",
          "trend": "Portfolio forecast",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Approvals",
          "value": "12",
          "trend": "Needs review",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Create Brand",
        "Review Subscriptions",
        "Audit Activity",
        "Configure Access"
      ],
      "workflow": [
        "Review Access Control queue",
        "Update Access Control records",
        "Publish Access Control report"
      ]
    },
    {
      "id": "billing",
      "label": "Billing",
      "description": "FoundingOS billing workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Brands",
          "value": "6",
          "trend": "All systems mapped",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "MRR",
          "value": "£48.2k",
          "trend": "Portfolio forecast",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Approvals",
          "value": "12",
          "trend": "Needs review",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Create Brand",
        "Review Subscriptions",
        "Audit Activity",
        "Configure Access"
      ],
      "workflow": [
        "Review Billing queue",
        "Update Billing records",
        "Publish Billing report"
      ]
    },
    {
      "id": "system-health",
      "label": "System Health",
      "description": "FoundingOS system health workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Brands",
          "value": "6",
          "trend": "All systems mapped",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "MRR",
          "value": "£48.2k",
          "trend": "Portfolio forecast",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Approvals",
          "value": "12",
          "trend": "Needs review",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Create Brand",
        "Review Subscriptions",
        "Audit Activity",
        "Configure Access"
      ],
      "workflow": [
        "Review System Health queue",
        "Update System Health records",
        "Publish System Health report"
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
    "title": "FoundingOS CRM",
    "summary": "FoundingOS CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "FoundRetail",
        "type": "Brand Accounts",
        "stage": "Live",
        "value": "£12.4k",
        "nextAction": "Create Brand"
      },
      {
        "name": "FoundMeat",
        "type": "Brand Accounts",
        "stage": "Live",
        "value": "£8.7k",
        "nextAction": "Review Subscriptions"
      },
      {
        "name": "FoundThat",
        "type": "Brand Accounts",
        "stage": "Live",
        "value": "£9.1k",
        "nextAction": "Audit Activity"
      },
      {
        "name": "FoundTalent",
        "type": "Brand Accounts",
        "stage": "Live",
        "value": "£10.2k",
        "nextAction": "Configure Access"
      },
      {
        "name": "FoundCrypto",
        "type": "Brand Accounts",
        "stage": "Live",
        "value": "£7.8k",
        "nextAction": "Create Brand"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Create Brand",
      "Review Subscriptions",
      "Audit Activity",
      "Configure Access"
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
      "href": "/tester/dashboard",
      "icon": "🧭",
      "section": "Core"
    },
    {
      "label": "SuperDashboard",
      "href": "/superdashboard",
      "icon": "◈",
      "section": "Core"
    },
    {
      "label": "CRM",
      "href": "/crm",
      "icon": "◎",
      "section": "Core"
    },
    {
      "label": "Brand Registry",
      "href": "/modules/brand-registry",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Subscriptions",
      "href": "/modules/subscriptions",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Activity Log",
      "href": "/modules/activity-log",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Access Control",
      "href": "/modules/access-control",
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
      "label": "System Health",
      "href": "/modules/system-health",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Finance",
      "href": "/finance",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Crypto",
      "href": "/crypto",
      "icon": "▣",
      "section": "Modules"
    },
        {
      "label": "Marketing",
      "href": "/modules/marketing",
      "icon": "megaphone",
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
      "label": "Settings",
      "href": "/settings",
      "icon": "⚙",
      "section": "Core"
    }
  ],
  "quickActions": [
    "Create Brand",
    "Review Subscriptions",
    "Audit Activity",
    "Configure Access"
  ],
  "settings": [
    "Founder Profile",
    "Global Branding",
    "Billing Defaults",
    "Brand Provisioning",
    "Module Permissions",
    "Deployment Settings"
  ]
}
