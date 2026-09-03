/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'
import { brands } from '@foundingos/config'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundThat",
  "logo": "✦",
  "accent": "#FFDD00",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#FFD600",
    "secondary": "#3D3200",
    "accent": "#FFDD00",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Tickets, systems, uptime",
    "subtitle": "Manage service desk operations, monitored systems, alerts, assets, and incident response.",
    "metrics": [
      {
        "label": "System Health",
        "value": "99.98%",
        "trend": "30 days",
        "icon": "✓",
        "tone": "good"
      },
      {
        "label": "Alerts",
        "value": "6",
        "trend": "2 critical",
        "icon": "!",
        "tone": "risk"
      },
      {
        "label": "Data Throughput",
        "value": "1.8M",
        "trend": "events/day",
        "icon": "▦",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "System",
      "Uptime",
      "Alerts",
      "Owner"
    ],
    "tableRows": [
      [
        "API Gateway",
        "99.99%",
        "1",
        "Platform"
      ],
      [
        "CRM Sync",
        "99.91%",
        "3",
        "Ops"
      ],
      [
        "Data Jobs",
        "99.95%",
        "2",
        "Engineering"
      ]
    ],
    "workflows": [
      "Create Ticket workflow active",
      "Acknowledge Alert workflow active",
      "Register Asset workflow active",
      "Run Health Check workflow active"
    ]
  },
  "modules": [
    {
      "id": "tickets",
      "label": "Tickets",
      "description": "FoundThat tickets workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Tickets queue",
        "Update Tickets records",
        "Publish Tickets report"
      ]
    },
    {
      "id": "monitoring",
      "label": "Monitoring",
      "description": "FoundThat monitoring workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Monitoring queue",
        "Update Monitoring records",
        "Publish Monitoring report"
      ]
    },
    {
      "id": "alerts",
      "label": "Alerts",
      "description": "FoundThat alerts workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Alerts queue",
        "Update Alerts records",
        "Publish Alerts report"
      ]
    },
    {
      "id": "assets",
      "label": "Assets",
      "description": "FoundThat assets workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Assets queue",
        "Update Assets records",
        "Publish Assets report"
      ]
    },
    {
      "id": "systems",
      "label": "Systems",
      "description": "FoundThat systems workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Systems queue",
        "Update Systems records",
        "Publish Systems report"
      ]
    },
    {
      "id": "uptime",
      "label": "Uptime",
      "description": "FoundThat uptime workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Uptime queue",
        "Update Uptime records",
        "Publish Uptime report"
      ]
    },
    {
      "id": "incidents",
      "label": "Incidents",
      "description": "FoundThat incidents workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Incidents queue",
        "Update Incidents records",
        "Publish Incidents report"
      ]
    },
    {
      "id": "reports",
      "label": "Reports",
      "description": "FoundThat reports workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Uptime",
          "value": "99.98%",
          "trend": "30 days",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Tickets",
          "value": "43",
          "trend": "11 urgent",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Alerts",
          "value": "6",
          "trend": "2 critical",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Create Ticket",
        "Acknowledge Alert",
        "Register Asset",
        "Run Health Check"
      ],
      "workflow": [
        "Review Reports queue",
        "Update Reports records",
        "Publish Reports report"
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
    "title": "FoundThat CRM",
    "summary": "FoundThat CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "API Gateway",
        "type": "Clients",
        "stage": "99.99%",
        "value": "1",
        "nextAction": "Create Ticket"
      },
      {
        "name": "CRM Sync",
        "type": "Clients",
        "stage": "99.91%",
        "value": "3",
        "nextAction": "Acknowledge Alert"
      },
      {
        "name": "Data Jobs",
        "type": "Clients",
        "stage": "99.95%",
        "value": "2",
        "nextAction": "Register Asset"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Create Ticket",
      "Acknowledge Alert",
      "Register Asset",
      "Run Health Check"
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
      "href": `${brands.foundingos.consoleUrl}/tester/dashboard?fromBrand=foundthat`,
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
      "label": "Tickets",
      "href": "/modules/tickets",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Monitoring",
      "href": "/modules/monitoring",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Alerts",
      "href": "/modules/alerts",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Assets",
      "href": "/modules/assets",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Systems",
      "href": "/modules/systems",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Uptime",
      "href": "/modules/uptime",
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
    "Create Ticket",
    "Acknowledge Alert",
    "Register Asset",
    "Run Health Check"
  ],
  "settings": [
    "SLA Policy",
    "Alert Routing",
    "Asset Categories",
    "Monitoring Integrations",
    "Notification Channels",
    "CRM Configuration"
  ]
}
