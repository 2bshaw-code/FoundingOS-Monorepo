export type TalentModule = { id: string; label: string; group: string; statuses?: string[] }

export const talentModules: TalentModule[] = [
  { id: 'overview', label: 'Recruitment home', group: 'Workspace' },
  { id: 'jobs', label: 'Jobs', group: 'Hiring', statuses: ['Draft', 'Open', 'Interviewing', 'Filled'] },
  { id: 'candidates', label: 'Candidates', group: 'Hiring', statuses: ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'] },
  { id: 'interviews', label: 'Interviews', group: 'Hiring', statuses: ['Planned', 'Confirmed', 'Complete', 'Decision'] },
  { id: 'offers', label: 'Offers', group: 'Hiring', statuses: ['Draft', 'Sent', 'Accepted', 'Onboarding'] },
  { id: 'references', label: 'References & checks', group: 'Hiring', statuses: ['Requested', 'Chasing', 'Received', 'Cleared'] },
  { id: 'talent-pool', label: 'Talent pool', group: 'Pipeline', statuses: ['Available', 'Contacted', 'Shortlisted', 'Placed'] },
  { id: 'outreach', label: 'Outreach follow-ups', group: 'Pipeline', statuses: ['Planned', 'Contacted', 'Replied', 'Closed'] },
  { id: 'clients', label: 'Agency clients', group: 'Agency', statuses: ['Prospect', 'Active', 'Hiring', 'Paused'] },
  { id: 'submissions', label: 'Client submissions', group: 'Agency', statuses: ['Draft', 'Submitted', 'Feedback', 'Interview', 'Placed'] },
  { id: 'placements', label: 'Placements', group: 'Agency', statuses: ['Offered', 'Started', 'Invoiced', 'Paid'] },
  { id: 'activities', label: 'Recruiter activity', group: 'Intelligence', statuses: ['Planned', 'Completed'] },
  { id: 'reports', label: 'Recruitment reports', group: 'Intelligence' },
  { id: 'automations', label: 'Automations', group: 'Intelligence' },
  { id: 'team', label: 'Team & access', group: 'Administration' },
  { id: 'integrations', label: 'Integrations', group: 'Administration' },
  { id: 'security', label: 'Security & Access', group: 'Administration' },
  { id: 'settings', label: 'Settings', group: 'Administration' },
]

export const candidateSources = ['Job board', 'CV-Library', 'Totaljobs', 'Indeed', 'LinkedIn', 'Referral', 'Careers page', 'Agency', 'Talent pool', 'Social', 'Direct application']
export const candidateIsClosed = (status: string) => ['Hired', 'Rejected', 'Withdrawn'].includes(status)
