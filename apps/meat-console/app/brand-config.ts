/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'
import { brands } from '@foundingos/config'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundMeat",
  "logo": "◆",
  "accent": "#FF0033",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#A83F3F",
    "secondary": "#351A1A",
    "accent": "#FF0033",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Traceability, batches, compliance",
    "subtitle": "Control supplier batches, QA checkpoints, cold-chain alerts, cuts, and trade orders.",
    "metrics": [
      {
        "label": "Batch Quality",
        "value": "97%",
        "trend": "Audit ready",
        "icon": "✓",
        "tone": "good"
      },
      {
        "label": "Logistics Status",
        "value": "9 live",
        "trend": "In transit",
        "icon": "▦",
        "tone": "watch"
      },
      {
        "label": "Compliance %",
        "value": "96%",
        "trend": "Within limits",
        "icon": "◌",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "Batch",
      "Cut",
      "Supplier",
      "QA"
    ],
    "tableRows": [
      [
        "B-1042",
        "Ribeye",
        "North Farm",
        "Passed"
      ],
      [
        "B-1043",
        "Brisket",
        "Hill Butchers",
        "Review"
      ],
      [
        "B-1044",
        "Sirloin",
        "Prime Supply",
        "Passed"
      ]
    ],
    "workflows": [
      "Create Batch workflow active",
      "Record QA workflow active",
      "Add Delivery workflow active",
      "Issue Report workflow active"
    ]
  },
  "modules": [
    {
      "id": "traceability",
      "label": "Traceability",
      "description": "FoundMeat traceability workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Traceability queue",
        "Update Traceability records",
        "Publish Traceability report"
      ]
    },
    {
      "id": "qa",
      "label": "QA",
      "description": "FoundMeat qa workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review QA queue",
        "Update QA records",
        "Publish QA report"
      ]
    },
    {
      "id": "batches",
      "label": "Batches",
      "description": "FoundMeat batches workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Batches queue",
        "Update Batches records",
        "Publish Batches report"
      ]
    },
    {
      "id": "cuts",
      "label": "Cuts",
      "description": "FoundMeat cuts workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Cuts queue",
        "Update Cuts records",
        "Publish Cuts report"
      ]
    },
    {
      "id": "suppliers",
      "label": "Suppliers",
      "description": "FoundMeat suppliers workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Suppliers queue",
        "Update Suppliers records",
        "Publish Suppliers report"
      ]
    },
    {
      "id": "orders",
      "label": "Orders",
      "description": "FoundMeat orders workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Orders queue",
        "Update Orders records",
        "Publish Orders report"
      ]
    },
    {
      "id": "cold-chain",
      "label": "Cold Chain",
      "description": "FoundMeat cold chain workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Cold Chain queue",
        "Update Cold Chain records",
        "Publish Cold Chain report"
      ]
    },
    {
      "id": "compliance",
      "label": "Compliance",
      "description": "FoundMeat compliance workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Batches",
          "value": "64",
          "trend": "12 in transit",
          "icon": "▣",
          "tone": "good"
        },
        {
          "label": "QA Due",
          "value": "9",
          "trend": "Today",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Compliance",
          "value": "97%",
          "trend": "Audit ready",
          "icon": "✓",
          "tone": "good"
        }
      ],
      "actions": [
        "Create Batch",
        "Record QA",
        "Add Delivery",
        "Issue Report"
      ],
      "workflow": [
        "Review Compliance queue",
        "Update Compliance records",
        "Publish Compliance report"
      ]
    },
    {
      "id": "products",
      "label": "Products",
      "description": "FoundMeat products workspace for product creation, stock control, pricing, suppliers, and pictures.",
      "metrics": [
        {
          "label": "Products",
          "value": "28",
          "trend": "Live",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Low stock",
          "value": "4",
          "trend": "Needs review",
          "icon": "!",
          "tone": "watch"
        },
        {
          "label": "Suppliers",
          "value": "12",
          "trend": "Active",
          "icon": "▣",
          "tone": "good"
        }
      ],
      "actions": [
        "Add Product",
        "Adjust Stock",
        "Update Pricing",
        "Review Suppliers"
      ],
      "workflow": [
        "Review Products queue",
        "Update Products records",
        "Publish Products report"
      ]
    }
  ,
        {
          "id": "order-cuts-manager",
          "label": "Order Cuts Manager",
          "description": "Manage cut orders, fulfilment, and butcher floor workflow in one place.",
          "metrics": [
                {
                      "label": "Cuts Ordered Today",
                      "value": "58",
                      "trend": "+6",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Pending Orders",
                      "value": "9",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Fulfilled",
                      "value": "94%",
                      "trend": "+2%",
                      "icon": "✓",
                      "tone": "good"
                }
          ],
          "actions": [
                "Add Cut Order",
                "Update Order",
                "Mark Fulfilled",
                "Export Order List"
          ],
          "workflow": [
                "Review Order Cuts Manager queue",
                "Update Order Cuts Manager records",
                "Publish Order Cuts Manager report"
          ]
    },
    {
          "id": "supplier-sync",
          "label": "Supplier Sync",
          "description": "Keep supplier stock levels and pricing in sync automatically.",
          "metrics": [
                {
                      "label": "Suppliers Synced",
                      "value": "12",
                      "trend": "Live",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Sync Errors",
                      "value": "1",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Last Sync",
                      "value": "4 min ago",
                      "trend": "Automatic",
                      "icon": "✓",
                      "tone": "good"
                }
          ],
          "actions": [
                "Run Sync",
                "Resolve Conflict",
                "Add Supplier",
                "Export Sync Log"
          ],
          "workflow": [
                "Review Supplier Sync queue",
                "Update Supplier Sync records",
                "Publish Supplier Sync report"
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
    "title": "FoundMeat CRM",
    "summary": "FoundMeat CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "B-1042",
        "type": "Farms",
        "stage": "Ribeye",
        "value": "North Farm",
        "nextAction": "Create Batch"
      },
      {
        "name": "B-1043",
        "type": "Farms",
        "stage": "Brisket",
        "value": "Hill Butchers",
        "nextAction": "Record QA"
      },
      {
        "name": "B-1044",
        "type": "Farms",
        "stage": "Sirloin",
        "value": "Prime Supply",
        "nextAction": "Add Delivery"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Create Batch",
      "Record QA",
      "Add Delivery",
      "Issue Report"
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
      "href": `${brands.foundingos.consoleUrl}/tester/dashboard?fromBrand=meat`,
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
      "label": "Traceability",
      "href": "/modules/traceability",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "QA",
      "href": "/modules/qa",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Batches",
      "href": "/modules/batches",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Cuts",
      "href": "/modules/cuts",
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
      "label": "Orders",
      "href": "/modules/orders",
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
      "label": "Order Cuts Manager",
      "href": "/modules/order-cuts-manager",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Supplier Sync",
      "href": "/modules/supplier-sync",
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
    "Create Batch",
    "Record QA",
    "Add Delivery",
    "Issue Report"
  ],
  "settings": [
    "Compliance Profile",
    "QA Thresholds",
    "Batch Numbering",
    "Traceability Rules",
    "Supplier Approvals",
    "CRM Configuration"
  ]
}
