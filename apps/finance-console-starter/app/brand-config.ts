/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundFinance",
  "logo": "£",
  "accent": "#D4AF37",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#D4AF37",
    "secondary": "#4A3B0A",
    "accent": "#D4AF37",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Wallets, charts, transactions",
    "subtitle": "Monitor portfolios, exchange connections, signals, transaction volume, automation, and risk exposure.",
    "metrics": [
      {
        "label": "Wallet Balance",
        "value": "£284k",
        "trend": "+4.8%",
        "icon": "£",
        "tone": "good"
      },
      {
        "label": "Trigger Activity",
        "value": "26",
        "trend": "Open",
        "icon": "▦",
        "tone": "watch"
      },
      {
        "label": "Automation Status",
        "value": "92%",
        "trend": "Live",
        "icon": "◍",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "Asset",
      "Signal",
      "Exposure",
      "Action"
    ],
    "tableRows": [
      [
        "BTC",
        "Breakout",
        "34%",
        "Watch"
      ],
      [
        "ETH",
        "Accumulation",
        "22%",
        "Review"
      ],
      [
        "SOL",
        "Volatile",
        "8%",
        "Limit"
      ]
    ],
    "workflows": [
      "Add Wallet workflow active",
      "Create Signal workflow active",
      "Open Chart workflow active",
      "Run Risk Check workflow active"
    ]
  },
  "modules": [
    {
      "id": "wallets",
      "label": "Wallets",
      "description": "FoundCrypto wallets workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Wallets queue",
        "Update Wallets records",
        "Publish Wallets report"
      ]
    },
    {
      "id": "charts",
      "label": "Charts",
      "description": "FoundCrypto charts workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Charts queue",
        "Update Charts records",
        "Publish Charts report"
      ]
    },
    {
      "id": "transactions",
      "label": "Transactions",
      "description": "FoundCrypto transactions workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Transactions queue",
        "Update Transactions records",
        "Publish Transactions report"
      ]
    },
    {
      "id": "analytics",
      "label": "Analytics",
      "description": "FoundCrypto analytics workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Analytics queue",
        "Update Analytics records",
        "Publish Analytics report"
      ]
    },
    {
      "id": "portfolio",
      "label": "Portfolio",
      "description": "FoundCrypto portfolio workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Portfolio queue",
        "Update Portfolio records",
        "Publish Portfolio report"
      ]
    },
    {
      "id": "exchange",
      "label": "Exchange",
      "description": "FoundCrypto exchange workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Exchange queue",
        "Update Exchange records",
        "Publish Exchange report"
      ]
    },
    {
      "id": "signals",
      "label": "Signals",
      "description": "FoundCrypto signals workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Signals queue",
        "Update Signals records",
        "Publish Signals report"
      ]
    },
    {
      "id": "risk",
      "label": "Risk",
      "description": "FoundCrypto risk workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Risk queue",
        "Update Risk records",
        "Publish Risk report"
      ]
    },
    {
      "id": "automation",
      "label": "Automation",
      "description": "FoundCrypto automation workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Portfolio",
          "value": "£284k",
          "trend": "+4.8%",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Wallets",
          "value": "18",
          "trend": "Connected",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Signals",
          "value": "26",
          "trend": "Open",
          "icon": "▦",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Wallet",
        "Create Signal",
        "Open Chart",
        "Run Risk Check"
      ],
      "workflow": [
        "Review Automation queue",
        "Update Automation records",
        "Publish Automation report"
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
    "title": "FoundCrypto CRM",
    "summary": "FoundCrypto CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "BTC",
        "type": "Wallets",
        "stage": "Breakout",
        "value": "34%",
        "nextAction": "Add Wallet"
      },
      {
        "name": "ETH",
        "type": "Wallets",
        "stage": "Accumulation",
        "value": "22%",
        "nextAction": "Create Signal"
      },
      {
        "name": "SOL",
        "type": "Wallets",
        "stage": "Volatile",
        "value": "8%",
        "nextAction": "Open Chart"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Add Wallet",
      "Create Signal",
      "Open Chart",
      "Run Risk Check"
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
      "label": "Wallets",
      "href": "/modules/wallets",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Charts",
      "href": "/modules/charts",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Transactions",
      "href": "/modules/transactions",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Analytics",
      "href": "/modules/analytics",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Portfolio",
      "href": "/modules/portfolio",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Exchange",
      "href": "/modules/exchange",
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
    "Add Wallet",
    "Create Signal",
    "Open Chart",
    "Run Risk Check"
  ],
  "settings": [
    "Wallet Security",
    "Exchange Connections",
    "Risk Limits",
    "Alert Preferences",
    "Portfolio Visibility",
    "CRM Configuration"
  ]
}
