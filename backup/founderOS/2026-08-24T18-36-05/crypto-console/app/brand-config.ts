import type { BrandConsoleConfig } from '@foundingos/ui/console'

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
      "href": "/dashboard",
      "icon": "▦",
      "section": "Core"
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
