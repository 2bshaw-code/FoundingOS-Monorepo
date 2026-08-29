/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundRetail",
  "logo": "◉",
  "accent": "#00C853",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#00C853",
    "secondary": "#0B1F18",
    "accent": "#00C853",
    "background": "#081120",
    "panel": "#101B2C",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Inventory, sales, suppliers",
    "subtitle": "Track daily retail operations across stock, stores, orders, customers, and supplier performance.",
    "metrics": [
      {
        "label": "Sales",
        "value": "£18.6k",
        "trend": "Today",
        "icon": "£",
        "tone": "good"
      },
      {
        "label": "Orders",
        "value": "142",
        "trend": "Open",
        "icon": "▦",
        "tone": "watch"
      },
      {
        "label": "Stock Levels",
        "value": "87%",
        "trend": "Healthy",
        "icon": "◍",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "Store",
      "Sales",
      "Orders",
      "Stock"
    ],
    "tableRows": [
      [
        "Manchester",
        "£4.2k",
        "38",
        "Healthy"
      ],
      [
        "Leeds",
        "£3.1k",
        "24",
        "Low dairy"
      ],
      [
        "Bristol",
        "£2.8k",
        "19",
        "Healthy"
      ]
    ],
    "workflows": [
      "Open POS workflow active",
      "Add Product workflow active",
      "Update Stock workflow active",
      "Message Supplier workflow active"
    ]
  },
  "modules": [
    {
      "id": "pos",
      "label": "Pos",
      "description": "FoundRetail pos workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Pos queue",
        "Update Pos records",
        "Publish Pos report"
      ]
    },
    {
      "id": "inventory",
      "label": "Inventory",
      "description": "FoundRetail inventory workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Inventory queue",
        "Update Inventory records",
        "Publish Inventory report"
      ]
    },
    {
      "id": "suppliers",
      "label": "Suppliers",
      "description": "FoundRetail suppliers workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Suppliers queue",
        "Update Suppliers records",
        "Publish Suppliers report"
      ]
    },
    {
      "id": "sales",
      "label": "Sales",
      "description": "FoundRetail sales workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Sales queue",
        "Update Sales records",
        "Publish Sales report"
      ]
    },
    {
      "id": "customers",
      "label": "Customers",
      "description": "FoundRetail customers workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Customers queue",
        "Update Customers records",
        "Publish Customers report"
      ]
    },
    {
      "id": "orders",
      "label": "Orders",
      "description": "FoundRetail orders workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Orders queue",
        "Update Orders records",
        "Publish Orders report"
      ]
    },
    {
      "id": "products",
      "label": "Products",
      "description": "FoundRetail products workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Products queue",
        "Update Products records",
        "Publish Products report"
      ]
    },
    {
      "id": "stores",
      "label": "Stores",
      "description": "FoundRetail stores workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Sales",
          "value": "£18.6k",
          "trend": "Today",
          "icon": "£",
          "tone": "good"
        },
        {
          "label": "Orders",
          "value": "142",
          "trend": "32 open",
          "icon": "▦",
          "tone": "watch"
        },
        {
          "label": "Low Stock",
          "value": "18",
          "trend": "Needs action",
          "icon": "!",
          "tone": "risk"
        }
      ],
      "actions": [
        "Open POS",
        "Add Product",
        "Update Stock",
        "Message Supplier"
      ],
      "workflow": [
        "Review Stores queue",
        "Update Stores records",
        "Publish Stores report"
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
    "title": "FoundRetail CRM",
    "summary": "FoundRetail CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "Manchester",
        "type": "Suppliers",
        "stage": "£4.2k",
        "value": "38",
        "nextAction": "Open POS"
      },
      {
        "name": "Leeds",
        "type": "Suppliers",
        "stage": "£3.1k",
        "value": "24",
        "nextAction": "Add Product"
      },
      {
        "name": "Bristol",
        "type": "Suppliers",
        "stage": "£2.8k",
        "value": "19",
        "nextAction": "Update Stock"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Open POS",
      "Add Product",
      "Update Stock",
      "Message Supplier"
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
      "label": "Pos",
      "href": "/modules/pos",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Inventory",
      "href": "/modules/inventory",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Suppliers",
      "href": "/modules/suppliers",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Sales",
      "href": "/modules/sales",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Customers",
      "href": "/modules/customers",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Orders",
      "href": "/modules/orders",
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
    "Open POS",
    "Add Product",
    "Update Stock",
    "Message Supplier"
  ],
  "settings": [
    "Store Profile",
    "POS Configuration",
    "Inventory Thresholds",
    "Supplier Rules",
    "Payment Settings",
    "CRM Configuration"
  ]
}
