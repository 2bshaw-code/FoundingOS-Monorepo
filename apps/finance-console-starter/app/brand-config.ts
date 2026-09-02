/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundFinance",
  "logo": "£",
  "accent": "#0033AA",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#D4AF37",
    "secondary": "#4A3B0A",
    "accent": "#0033AA",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
      "title": "Cashflow, invoicing, reconciliation",
      "subtitle": "Track daily finance operations across cashflow, invoicing, payables, receivables, and compliance.",
      "metrics": [
          {
              "label": "Cash Position",
              "value": "£162.4k",
              "trend": "+£4.1k",
              "icon": "£",
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
              "icon": "✓",
              "tone": "good"
          }
      ],
      "tableTitle": "Operational snapshot",
      "tableHeaders": [
          "Account",
          "Status",
          "Balance",
          "Action"
      ],
      "tableRows": [
          [
              "Operating",
              "Healthy",
              "£142k",
              "Review"
          ],
          [
              "Payroll",
              "Due soon",
              "£38k",
              "Approve"
          ],
          [
              "Reserve",
              "Stable",
              "£210k",
              "Monitor"
          ]
      ],
      "workflows": [
          "Review Invoices workflow active",
          "Reconcile Accounts workflow active",
          "Update Forecast workflow active",
          "Run Risk Check workflow active"
      ]
    },
  "modules": [
    {
          "id": "invoicing",
          "label": "Invoicing",
          "description": "FoundFinance invoicing workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Invoices Sent",
                      "value": "48",
                      "trend": "+6 this week",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Overdue",
                      "value": "7",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Avg Days to Pay",
                      "value": "12",
                      "trend": "-2d",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Send Invoice",
                "Chase Overdue",
                "Apply Payment",
                "Export Statement"
          ],
          "workflow": [
                "Review Invoicing queue",
                "Update Invoicing records",
                "Publish Invoicing report"
          ]
    },
    {
          "id": "cashflow",
          "label": "Cashflow",
          "description": "FoundFinance cashflow workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Cash Runway",
                      "value": "11.4 months",
                      "trend": "+0.6mo",
                      "icon": "£",
                      "tone": "good"
                },
                {
                      "label": "Burn Rate",
                      "value": "£18.2k/mo",
                      "trend": "Stable",
                      "icon": "◈",
                      "tone": "watch"
                },
                {
                      "label": "Inflows",
                      "value": "£62.4k",
                      "trend": "This month",
                      "icon": "▶",
                      "tone": "good"
                }
          ],
          "actions": [
                "Log Transaction",
                "Adjust Forecast",
                "Flag Anomaly",
                "Export Report"
          ],
          "workflow": [
                "Review Cashflow queue",
                "Update Cashflow records",
                "Publish Cashflow report"
          ]
    },
    {
          "id": "reconciliation",
          "label": "Reconciliation",
          "description": "FoundFinance reconciliation workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Matched",
                      "value": "94%",
                      "trend": "+2%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Unmatched Items",
                      "value": "9",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Avg Close Time",
                      "value": "3.1 days",
                      "trend": "-0.4d",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Match Transaction",
                "Flag Discrepancy",
                "Close Period",
                "Export Ledger"
          ],
          "workflow": [
                "Review Reconciliation queue",
                "Update Reconciliation records",
                "Publish Reconciliation report"
          ]
    },
    {
          "id": "reporting",
          "label": "Reporting",
          "description": "FoundFinance reporting workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Reports Generated",
                      "value": "22",
                      "trend": "This month",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Accuracy",
                      "value": "99.1%",
                      "trend": "+0.2%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Distribution List",
                      "value": "14",
                      "trend": "Stakeholders",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Generate Report",
                "Schedule Distribution",
                "Annotate Variance",
                "Archive Report"
          ],
          "workflow": [
                "Review Reporting queue",
                "Update Reporting records",
                "Publish Reporting report"
          ]
    },
    {
          "id": "payables",
          "label": "Payables",
          "description": "FoundFinance payables workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Bills Due",
                      "value": "16",
                      "trend": "This week",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Approved",
                      "value": "£38.2k",
                      "trend": "Ready to pay",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Vendors",
                      "value": "31",
                      "trend": "Active",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Approve Bill",
                "Schedule Payment",
                "Dispute Charge",
                "Export Ledger"
          ],
          "workflow": [
                "Review Payables queue",
                "Update Payables records",
                "Publish Payables report"
          ]
    },
    {
          "id": "receivables",
          "label": "Receivables",
          "description": "FoundFinance receivables workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Outstanding",
                      "value": "£89.6k",
                      "trend": "-£4.2k",
                      "icon": "£",
                      "tone": "good"
                },
                {
                      "label": "Days Sales Outstanding",
                      "value": "28",
                      "trend": "-2d",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "At Risk",
                      "value": "3",
                      "trend": "Needs follow-up",
                      "icon": "!",
                      "tone": "risk"
                }
          ],
          "actions": [
                "Send Reminder",
                "Apply Credit",
                "Escalate Account",
                "Export Aging Report"
          ],
          "workflow": [
                "Review Receivables queue",
                "Update Receivables records",
                "Publish Receivables report"
          ]
    },
    {
          "id": "forecasting",
          "label": "Forecasting",
          "description": "FoundFinance forecasting workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Forecast Accuracy",
                      "value": "91%",
                      "trend": "+3%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Scenarios Modelled",
                      "value": "5",
                      "trend": "This quarter",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Variance",
                      "value": "4.1%",
                      "trend": "Within range",
                      "icon": "▶",
                      "tone": "watch"
                }
          ],
          "actions": [
                "Update Forecast",
                "Run Scenario",
                "Flag Variance",
                "Share Forecast"
          ],
          "workflow": [
                "Review Forecasting queue",
                "Update Forecasting records",
                "Publish Forecasting report"
          ]
    },
    {
          "id": "risk",
          "label": "Risk",
          "description": "FoundFinance risk workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Risk Score",
                      "value": "Low",
                      "trend": "Stable",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Open Flags",
                      "value": "2",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Controls Passed",
                      "value": "97%",
                      "trend": "+1%",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Run Risk Check",
                "Review Flag",
                "Update Control",
                "Escalate Issue"
          ],
          "workflow": [
                "Review Risk queue",
                "Update Risk records",
                "Publish Risk report"
          ]
    },
    {
          "id": "compliance",
          "label": "Compliance",
          "description": "FoundFinance compliance workspace for daily operations, reporting, approvals, and team execution.",
          "metrics": [
                {
                      "label": "Audit Readiness",
                      "value": "96%",
                      "trend": "+2%",
                      "icon": "✓",
                      "tone": "good"
                },
                {
                      "label": "Open Actions",
                      "value": "4",
                      "trend": "Due this month",
                      "icon": "!",
                      "tone": "watch"
                },
                {
                      "label": "Policies Reviewed",
                      "value": "18",
                      "trend": "This quarter",
                      "icon": "◈",
                      "tone": "good"
                }
          ],
          "actions": [
                "Review Policy",
                "Log Audit Note",
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
          "id": "portfolio-alerts",
          "label": "Portfolio Alerts",
          "description": "Monitor portfolio risk and get notified the moment thresholds are crossed.",
          "metrics": [
                {
                      "label": "Active Alerts",
                      "value": "6",
                      "trend": "Live",
                      "icon": "◈",
                      "tone": "good"
                },
                {
                      "label": "Triggered Today",
                      "value": "2",
                      "trend": "Needs review",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Resolved",
                      "value": "91%",
                      "trend": "+2%",
                      "icon": "✓",
                      "tone": "good"
                }
          ],
          "actions": [
                "Create Alert",
                "Acknowledge Alert",
                "Snooze Alert",
                "Export Alert Log"
          ],
          "workflow": [
                "Review Portfolio Alerts queue",
                "Update Portfolio Alerts records",
                "Publish Portfolio Alerts report"
          ]
    },
    {
          "id": "compliance-notes",
          "label": "Compliance Notes",
          "description": "Log and track compliance observations across every account.",
          "metrics": [
                {
                      "label": "Open Notes",
                      "value": "9",
                      "trend": "This week",
                      "icon": "▶",
                      "tone": "good"
                },
                {
                      "label": "Flagged Items",
                      "value": "2",
                      "trend": "Needs action",
                      "icon": "!",
                      "tone": "risk"
                },
                {
                      "label": "Reviewed This Week",
                      "value": "14",
                      "trend": "+3",
                      "icon": "✓",
                      "tone": "good"
                }
          ],
          "actions": [
                "Add Note",
                "Flag Item",
                "Mark Reviewed",
                "Export Notes"
          ],
          "workflow": [
                "Review Compliance Notes queue",
                "Update Compliance Notes records",
                "Publish Compliance Notes report"
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
      "title": "FoundFinance CRM",
      "summary": "FoundFinance CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
      "records": [
          {
              "name": "Northgate Retail Group",
              "type": "Client",
              "stage": "Active",
              "value": "£18.2k/mo",
              "nextAction": "Send Invoice"
          },
          {
              "name": "Bramwell & Co Suppliers",
              "type": "Vendor",
              "stage": "Payment due",
              "value": "£6.4k",
              "nextAction": "Schedule Payment"
          },
          {
              "name": "Vantage Logistics Ltd",
              "type": "Client",
              "stage": "Overdue",
              "value": "£2.1k",
              "nextAction": "Send Reminder"
          }
      ],
      "pipeline": [
          "New",
          "Qualified",
          "Active",
          "Won"
      ],
      "tasks": [
          "Send Invoice",
          "Chase Overdue",
          "Reconcile Account",
          "Update Forecast"
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
      "href": "/tester/dashboard",
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
      "label": "CRM",
      "href": "/crm",
      "icon": "◎",
      "section": "Core"
    },
        {
      "label": "Invoicing",
      "href": "/modules/invoicing",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Cashflow",
      "href": "/modules/cashflow",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Reconciliation",
      "href": "/modules/reconciliation",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Reporting",
      "href": "/modules/reporting",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Payables",
      "href": "/modules/payables",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Receivables",
      "href": "/modules/receivables",
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
      "label": "Portfolio Alerts",
      "href": "/modules/portfolio-alerts",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Compliance Notes",
      "href": "/modules/compliance-notes",
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
    "Send Invoice",
    "Reconcile Account",
    "Update Forecast",
    "Run Risk Check"
  ],
  "settings": [
    "Payment Methods",
    "Approval Limits",
    "Risk Thresholds",
    "Alert Preferences",
    "Reporting Schedule",
    "CRM Configuration"
  ]
}
