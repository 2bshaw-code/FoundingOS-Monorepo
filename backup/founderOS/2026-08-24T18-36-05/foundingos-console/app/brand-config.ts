import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FounderOS",
  "logo": "FO",
  "accent": "#4A90E2",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#4A90E2",
    "secondary": "#0F2742",
    "accent": "#4A90E2",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Ecosystem overview",
    "subtitle": "Monitor brand health, revenue, subscriptions, access, and activity across the full FounderOS group.",
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
        "FoundIT",
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
      "description": "FounderOS brand registry workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FounderOS subscriptions workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FounderOS activity log workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FounderOS access control workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FounderOS billing workspace for daily operations, reporting, approvals, and team execution.",
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
      "description": "FounderOS system health workspace for daily operations, reporting, approvals, and team execution.",
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
  ],
  "crm": {
    "title": "FounderOS CRM",
    "summary": "FounderOS CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
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
        "name": "FoundIT",
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
