import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundIT",
  "logo": "✦",
  "accent": "#FFD600",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#FFD600",
    "secondary": "#3D3200",
    "accent": "#FFD600",
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
      "description": "FoundIT tickets workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT monitoring workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT alerts workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT assets workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT systems workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT uptime workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT incidents workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FoundIT reports workspace for daily operations, reporting, approvals, and team execution.",
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
  ],
  "crm": {
    "title": "FoundIT CRM",
    "summary": "FoundIT CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
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
