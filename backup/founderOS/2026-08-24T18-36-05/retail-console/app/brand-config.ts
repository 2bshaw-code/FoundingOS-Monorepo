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
