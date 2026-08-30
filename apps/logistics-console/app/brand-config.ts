/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundLogistics",
  "logo": "▲",
  "accent": "#DC143C",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#FF6F00",
    "secondary": "#4A2400",
    "accent": "#DC143C",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
      "title": "Fleet, routes, deliveries",
      "subtitle": "Track daily logistics operations across fleet, routes, warehousing, dispatch, and deliveries.",
      "metrics": [
          {
              "label": "On-time Delivery",
              "value": "94%",
              "trend": "+2%",
              "icon": "✓",
              "tone": "good"
          },
          {
              "label": "Fleet Utilisation",
              "value": "81%",
              "trend": "+4%",
              "icon": "◈",
              "tone": "good"
          },
          {
              "label": "Active Deliveries",
              "value": "63",
              "trend": "In transit",
              "icon": "▶",
              "tone": "watch"
          }
      ],
      "tableTitle": "Operational snapshot",
      "tableHeaders": [
          "Route",
          "Status",
          "ETA",
          "Action"
      ],
      "tableRows": [
          [
              "North Loop",
              "On schedule",
              "14:20",
              "Monitor"
          ],
          [
              "City Express",
              "Delayed",
              "16:05",
              "Review"
          ],
          [
              "Coastal Run",
              "On schedule",
              "18:40",
              "Monitor"
          ]
      ],
      "workflows": [
          "Review Route workflow active",
          "Dispatch Vehicle workflow active",
          "Log Maintenance workflow active",
          "Track Delivery workflow active"
      ]
    },
  "modules": [
    {
          "id": "fleet",
          "label": "Fleet",
          "description": "FoundLogistics fleet workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Vehicles Active",
                      "value": "42",
                      "trend": "+2",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Utilisation",
                      "value": "81%",
                      "trend": "+4%",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "In Maintenance",
                      "value": "3",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Assign Vehicle",
                "Schedule Maintenance",
                "Flag Issue",
                "Export Fleet Report"
          ],
          "workflow": [
                "Review Fleet queue",
                "Update Fleet records",
                "Publish Fleet report"
          ]
    },
    {
          "id": "routes",
          "label": "Routes",
          "description": "FoundLogistics routes workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Active Routes",
                      "value": "18",
                      "trend": "Today",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "On Schedule",
                      "value": "92%",
                      "trend": "+1%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Delayed",
                      "value": "2",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "Plan Route",
                "Reroute Vehicle",
                "Flag Delay",
                "Export Route Plan"
          ],
          "workflow": [
                "Review Routes queue",
                "Update Routes records",
                "Publish Routes report"
          ]
    },
    {
          "id": "warehousing",
          "label": "Warehousing",
          "description": "FoundLogistics warehousing workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Capacity Used",
                      "value": "76%",
                      "trend": "Stable",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Inbound Today",
                      "value": "24",
                      "trend": "Shipments",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Outbound Today",
                      "value": "31",
                      "trend": "Shipments",
                      "icon": "▶",
                      "tone": "good"
                }
          ],
          "actions": [
                "Receive Shipment",
                "Pick Order",
                "Flag Discrepancy",
                "Export Warehouse Report"
          ],
          "workflow": [
                "Review Warehousing queue",
                "Update Warehousing records",
                "Publish Warehousing report"
          ]
    },
    {
          "id": "deliveries",
          "label": "Deliveries",
          "description": "FoundLogistics deliveries workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Delivered Today",
                      "value": "108",
                      "trend": "+12",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "In Transit",
                      "value": "63",
                      "trend": "Live",
                      "icon": "▶",
                      "tone": "watch"
                },
                {
                      "label": "Failed",
                      "value": "2",
                      "trend": "Needs follow-up",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "Confirm Delivery",
                "Reschedule Delivery",
                "Log Exception",
                "Export Delivery Log"
          ],
          "workflow": [
                "Review Deliveries queue",
                "Update Deliveries records",
                "Publish Deliveries report"
          ]
    },
    {
          "id": "dispatch",
          "label": "Dispatch",
          "description": "FoundLogistics dispatch workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Dispatched Today",
                      "value": "76",
                      "trend": "+9",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Avg Dispatch Time",
                      "value": "8 min",
                      "trend": "-1m",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Queued",
                      "value": "5",
                      "trend": "Awaiting driver",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Dispatch Vehicle",
                "Assign Driver",
                "Flag Delay",
                "Export Dispatch Log"
          ],
          "workflow": [
                "Review Dispatch queue",
                "Update Dispatch records",
                "Publish Dispatch report"
          ]
    },
    {
          "id": "tracking",
          "label": "Tracking",
          "description": "FoundLogistics tracking workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Tracked Shipments",
                      "value": "63",
                      "trend": "Live",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "GPS Uptime",
                      "value": "99.4%",
                      "trend": "+0.1%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Signal Gaps",
                      "value": "1",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                }
          ],
          "actions": [
                "View Live Map",
                "Flag Signal Loss",
                "Share Tracking Link",
                "Export Tracking Report"
          ],
          "workflow": [
                "Review Tracking queue",
                "Update Tracking records",
                "Publish Tracking report"
          ]
    },
    {
          "id": "maintenance",
          "label": "Maintenance",
          "description": "FoundLogistics maintenance workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Scheduled",
                      "value": "6",
                      "trend": "This week",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Overdue",
                      "value": "1",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Fleet Health",
                      "value": "96%",
                      "trend": "+1%",
                      "icon": "✓",
                      "tone": "good"
                }
          ],
          "actions": [
                "Schedule Service",
                "Log Repair",
                "Flag Overdue",
                "Export Maintenance Log"
          ],
          "workflow": [
                "Review Maintenance queue",
                "Update Maintenance records",
                "Publish Maintenance report"
          ]
    },
    {
          "id": "fuel",
          "label": "Fuel",
          "description": "FoundLogistics fuel workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Fuel Spend",
                      "value": "£8.2k",
                      "trend": "This week",
                      "icon": "£",
                      "tone": "watch"
                },
                {
                      "label": "Efficiency",
                      "value": "7.8 mpg",
                      "trend": "+0.2",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Anomalies",
                      "value": "1",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "Log Fuel Purchase",
                "Flag Anomaly",
                "Review Efficiency",
                "Export Fuel Report"
          ],
          "workflow": [
                "Review Fuel queue",
                "Update Fuel records",
                "Publish Fuel report"
          ]
    },
    {
          "id": "compliance",
          "label": "Compliance",
          "description": "FoundLogistics compliance workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Audit Readiness",
                      "value": "95%",
                      "trend": "+1%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Open Actions",
                      "value": "3",
                      "trend": "Due this month",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Inspections Passed",
                      "value": "19",
                      "trend": "This quarter",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Review Policy",
                "Log Inspection",
                "Assign Action",
                "Export Compliance Report"
          ],
          "workflow": [
                "Review Compliance queue",
                "Update Compliance records",
                "Publish Compliance report"
          ]
    },
      {
          "id": "route-planner",
          "label": "Route Planner",
          "description": "Plan and optimise delivery routes across the whole fleet.",
          "metrics": [
                {
                      "label": "Routes Planned",
                      "value": "18",
                      "trend": "Today",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Optimised Today",
                      "value": "14",
                      "trend": "+3",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Avg Distance Saved",
                      "value": "8.2%",
                      "trend": "+1.1%",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Plan Route",
                "Optimise Route",
                "Assign Driver",
                "Export Route Plan"
          ],
          "workflow": [
                "Review Route Planner queue",
                "Update Route Planner records",
                "Publish Route Planner report"
          ]
    },
    {
          "id": "fleet-status",
          "label": "Fleet Status",
          "description": "See live status for every vehicle in the fleet at a glance.",
          "metrics": [
                {
                      "label": "Vehicles Online",
                      "value": "39",
                      "trend": "Live",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "In Maintenance",
                      "value": "3",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Idle",
                      "value": "2",
                      "trend": "Needs assignment",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "View Fleet Map",
                "Flag Vehicle",
                "Schedule Service",
                "Export Fleet Status"
          ],
          "workflow": [
                "Review Fleet Status queue",
                "Update Fleet Status records",
                "Publish Fleet Status report"
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
      "title": "FoundLogistics CRM",
      "summary": "FoundLogistics CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
      "records": [
          {
              "name": "Harborview Distribution",
              "type": "Client",
              "stage": "Active",
              "value": "18 routes/wk",
              "nextAction": "Plan Route"
          },
          {
              "name": "Coastal Fuel Partners",
              "type": "Vendor",
              "stage": "Contract review",
              "value": "£8.2k/wk",
              "nextAction": "Log Fuel Purchase"
          },
          {
              "name": "Midlands Freight Co",
              "type": "Client",
              "stage": "Delayed shipment",
              "value": "£3.4k",
              "nextAction": "Confirm Delivery"
          }
      ],
      "pipeline": [
          "New",
          "Qualified",
          "Active",
          "Won"
      ],
      "tasks": [
          "Plan Route",
          "Dispatch Vehicle",
          "Confirm Delivery",
          "Schedule Maintenance"
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
      "label": "Fleet",
      "href": "/modules/fleet",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Routes",
      "href": "/modules/routes",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Warehousing",
      "href": "/modules/warehousing",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Deliveries",
      "href": "/modules/deliveries",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Dispatch",
      "href": "/modules/dispatch",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Tracking",
      "href": "/modules/tracking",
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
      "label": "FoundAI Demo",
      "href": "/modules/foundai-demo",
      "icon": "sparkles",
      "section": "Modules"
    },
    {
      "label": "Route Planner",
      "href": "/modules/route-planner",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Fleet Status",
      "href": "/modules/fleet-status",
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
    "Dispatch Vehicle",
    "Plan Route",
    "Confirm Delivery",
    "Log Maintenance"
  ],
  "settings": [
    "Fleet Access Controls",
    "Route Rules",
    "Maintenance Schedule",
    "Alert Preferences",
    "Fuel Budget",
    "CRM Configuration"
  ]
}
