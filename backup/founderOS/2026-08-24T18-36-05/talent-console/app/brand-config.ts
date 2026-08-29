import type { BrandConsoleConfig } from '@foundingos/ui/console'

export const brandConfig: BrandConsoleConfig = {
  "name": "FoundTalent",
  "logo": "⬢",
  "accent": "#E2A84A",
  "typography": {
    "heading": "Inter",
    "body": "Inter"
  },
  "colors": {
    "primary": "#E2A84A",
    "secondary": "#3D2B12",
    "accent": "#E2A84A",
    "background": "#0B0C10",
    "panel": "#141820",
    "text": "#FFFFFF",
    "muted": "#A8B3C3"
  },
  "dashboard": {
    "title": "Candidates, jobs, pipelines",
    "subtitle": "Coordinate candidates, roles, recruiter activity, interviews, offers, and onboarding progress.",
    "metrics": [
      {
        "label": "Applicants",
        "value": "1,284",
        "trend": "Active",
        "icon": "◍",
        "tone": "good"
      },
      {
        "label": "Jobs Active",
        "value": "38",
        "trend": "Hiring now",
        "icon": "▦",
        "tone": "good"
      },
      {
        "label": "Recruiter Pipeline",
        "value": "72%",
        "trend": "Moving",
        "icon": "◌",
        "tone": "good"
      }
    ],
    "tableTitle": "Operational snapshot",
    "tableHeaders": [
      "Role",
      "Pipeline",
      "Interviews",
      "Owner"
    ],
    "tableRows": [
      [
        "Store Manager",
        "42 candidates",
        "8",
        "Ava"
      ],
      [
        "Data Analyst",
        "31 candidates",
        "5",
        "Noah"
      ],
      [
        "Recruiter",
        "22 candidates",
        "4",
        "Mia"
      ]
    ],
    "workflows": [
      "Add Candidate workflow active",
      "Create Job workflow active",
      "Schedule Interview workflow active",
      "Start Onboarding workflow active"
    ]
  },
  "modules": [
    {
      "id": "ats",
      "label": "Ats",
      "description": "FoundTalent ats workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Ats queue",
        "Update Ats records",
        "Publish Ats report"
      ]
    },
    {
      "id": "crm",
      "label": "CRM",
      "description": "FoundTalent crm workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review CRM queue",
        "Update CRM records",
        "Publish CRM report"
      ]
    },
    {
      "id": "onboarding",
      "label": "Onboarding",
      "description": "FoundTalent onboarding workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Onboarding queue",
        "Update Onboarding records",
        "Publish Onboarding report"
      ]
    },
    {
      "id": "candidates",
      "label": "Candidates",
      "description": "FoundTalent candidates workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Candidates queue",
        "Update Candidates records",
        "Publish Candidates report"
      ]
    },
    {
      "id": "jobs",
      "label": "Jobs",
      "description": "FoundTalent jobs workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Jobs queue",
        "Update Jobs records",
        "Publish Jobs report"
      ]
    },
    {
      "id": "pipelines",
      "label": "Pipelines",
      "description": "FoundTalent pipelines workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Pipelines queue",
        "Update Pipelines records",
        "Publish Pipelines report"
      ]
    },
    {
      "id": "interviews",
      "label": "Interviews",
      "description": "FoundTalent interviews workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Interviews queue",
        "Update Interviews records",
        "Publish Interviews report"
      ]
    },
    {
      "id": "offers",
      "label": "Offers",
      "description": "FoundTalent offers workspace for daily operations, reporting, approvals, and team execution.",
      "metrics": [
        {
          "label": "Candidates",
          "value": "1,284",
          "trend": "Active",
          "icon": "◍",
          "tone": "good"
        },
        {
          "label": "Open Jobs",
          "value": "38",
          "trend": "Hiring now",
          "icon": "▦",
          "tone": "good"
        },
        {
          "label": "Interviews",
          "value": "72",
          "trend": "This week",
          "icon": "◌",
          "tone": "watch"
        }
      ],
      "actions": [
        "Add Candidate",
        "Create Job",
        "Schedule Interview",
        "Start Onboarding"
      ],
      "workflow": [
        "Review Offers queue",
        "Update Offers records",
        "Publish Offers report"
      ]
    }
  ],
  "crm": {
    "title": "FoundTalent CRM",
    "summary": "FoundTalent CRM connects contacts, companies, deals, notes, tasks, and activity for the brand workflow.",
    "records": [
      {
        "name": "Store Manager",
        "type": "Candidates",
        "stage": "42 candidates",
        "value": "8",
        "nextAction": "Add Candidate"
      },
      {
        "name": "Data Analyst",
        "type": "Candidates",
        "stage": "31 candidates",
        "value": "5",
        "nextAction": "Create Job"
      },
      {
        "name": "Recruiter",
        "type": "Candidates",
        "stage": "22 candidates",
        "value": "4",
        "nextAction": "Schedule Interview"
      }
    ],
    "pipeline": [
      "New",
      "Qualified",
      "Active",
      "Won"
    ],
    "tasks": [
      "Add Candidate",
      "Create Job",
      "Schedule Interview",
      "Start Onboarding"
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
      "label": "Ats",
      "href": "/modules/ats",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "CRM",
      "href": "/modules/crm",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Onboarding",
      "href": "/modules/onboarding",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Candidates",
      "href": "/modules/candidates",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Jobs",
      "href": "/modules/jobs",
      "icon": "▣",
      "section": "Modules"
    },
    {
      "label": "Pipelines",
      "href": "/modules/pipelines",
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
    "Add Candidate",
    "Create Job",
    "Schedule Interview",
    "Start Onboarding"
  ],
  "settings": [
    "Hiring Workflow",
    "Pipeline Stages",
    "Recruiter Permissions",
    "Candidate Messaging",
    "Offer Templates",
    "CRM Configuration"
  ]
}
