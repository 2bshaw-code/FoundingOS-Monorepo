import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundMeat",
  "logo": "◆",
  "accent": "#A83F3F",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#A83F3F",
    "secondary": "#351A1A",
    "accent": "#A83F3F",
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
      "label": "CRM",
      "href": "/crm",
      "icon": "◎",
      "section": "Core"
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
