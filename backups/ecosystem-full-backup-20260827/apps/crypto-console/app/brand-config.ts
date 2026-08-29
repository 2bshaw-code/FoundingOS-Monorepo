/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'
import type { CustomerAccess } from '@foundingos/ui/feature-gating'

export const customerAccess: CustomerAccess = {
  package: 'pro',
  features: {
    crm: true,
    deals: true,
    pipelines: true,
    tasks: true,
    notes: true,
    automations: true,
    email: true,
    ai_tools: true,
    quantum_layer: false,
  },
}

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundCrypto",
  "logo": "∞",
  "accent": "#8A4AE2",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#8A4AE2",
    "secondary": "#2B174A",
    "accent": "#8A4AE2",
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
      "id": "kyc",
      "label": "KYC",
      "description": "FoundCrypto identity verification covering document checks, liveness, and customer risk rating.",
      "metrics": [
        {
          "label": "Verified",
          "value": "8,412",
          "trend": "96% pass rate",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Pending review",
          "value": "37",
          "trend": "Manual queue",
          "icon": "◌",
          "tone": "watch"
        },
        {
          "label": "Rejected",
          "value": "112",
          "trend": "Document mismatch",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Start Verification",
        "Review Document",
        "Approve Identity",
        "Escalate Case"
      ],
      "workflow": [
        "Review KYC queue",
        "Update KYC records",
        "Publish KYC report"
      ]
    },
    {
      "id": "aml",
      "label": "AML",
      "description": "FoundCrypto anti-money-laundering monitoring for transaction screening, sanctions lists, and suspicious activity.",
      "metrics": [
        {
          "label": "Screened txns",
          "value": "142k",
          "trend": "Last 30 days",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Open alerts",
          "value": "24",
          "trend": "6 high severity",
          "icon": "!",
          "tone": "risk"
        },
        {
          "label": "SAR filed",
          "value": "3",
          "trend": "This quarter",
          "icon": "◈",
          "tone": "watch"
        }
      ],
      "actions": [
        "Screen Transaction",
        "Review Alert",
        "File SAR",
        "Update Watchlist"
      ],
      "workflow": [
        "Review AML alert queue",
        "Update AML case records",
        "Publish AML report"
      ]
    },
    {
      "id": "compliance",
      "label": "Compliance",
      "description": "FoundCrypto regulatory compliance covering policy controls, audit evidence, and jurisdiction reporting.",
      "metrics": [
        {
          "label": "Policy coverage",
          "value": "100%",
          "trend": "Controls documented",
          "icon": "✓",
          "tone": "good"
        },
        {
          "label": "Audit readiness",
          "value": "94%",
          "trend": "2 reviews pending",
          "icon": "◌",
          "tone": "watch"
        },
        {
          "label": "Jurisdictions",
          "value": "11",
          "trend": "All reporting current",
          "icon": "▣",
          "tone": "good"
        }
      ],
      "actions": [
        "Run Control Check",
        "Export Evidence",
        "File Report",
        "Review Policy"
      ],
      "workflow": [
        "Review Compliance queue",
        "Update Compliance records",
        "Publish Compliance report"
      ]
    },
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
      "href": "/console",
      "icon": "▦",
      "section": "Core"
    },
    {
      "label": "CRM",
      "href": "/console/crm",
      "icon": "◎",
      "section": "Core"
    },
    {
      "label": "KYC",
      "href": "/console/kyc",
      "icon": "✓",
      "section": "Compliance"
    },
    {
      "label": "AML",
      "href": "/console/aml",
      "icon": "!",
      "section": "Compliance"
    },
    {
      "label": "Compliance",
      "href": "/console/compliance",
      "icon": "▣",
      "section": "Compliance"
    },
    {
      "label": "Marketing Suite",
      "href": "/marketing",
      "icon": "◈",
      "section": "Marketing"
    },
    {
      "label": "Inbox",
      "href": "/console/inbox",
      "icon": "✉",
      "section": "Messaging"
    },
    {
      "label": "Messages",
      "href": "/console/messages",
      "icon": "◎",
      "section": "Messaging"
    },
    {
      "label": "App Store",
      "href": "/console/app-store",
      "icon": "▦",
      "section": "Platform"
    },
    {
      "label": "Settings",
      "href": "/settings",
      "icon": "⚙",
      "section": "Settings"
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
