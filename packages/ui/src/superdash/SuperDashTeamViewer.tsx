/* 
  © 2024–2026 FoundingOS. All rights reserved.
  Unauthorized copying, distribution, or modification is strictly prohibited.
*/
export type TeamMember = {
  name: string
  role: string
  brand: string
  status: 'active' | 'inactive'
  lastActive: string
  permission: 'Owner' | 'Admin' | 'Member' | 'Viewer'
}

const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Amara Okafor', role: 'Founder', brand: 'FoundingOS', status: 'active', lastActive: '2 min ago', permission: 'Owner' },
  { name: 'Leo Marchetti', role: 'Retail Ops Lead', brand: 'FoundRetail', status: 'active', lastActive: '14 min ago', permission: 'Admin' },
  { name: 'Priya Chandran', role: 'Supply Chain Manager', brand: 'FoundMeat', status: 'active', lastActive: '38 min ago', permission: 'Admin' },
  { name: 'Tomasz Nowak', role: 'Data Analyst', brand: 'FoundThat', status: 'inactive', lastActive: '3 days ago', permission: 'Member' },
  { name: 'Ella Sørensen', role: 'Recruiter', brand: 'FoundTalent', status: 'active', lastActive: '1 hour ago', permission: 'Member' },
  { name: 'Marcus Webb', role: 'Trading Analyst', brand: 'FoundCrypto', status: 'inactive', lastActive: '2 days ago', permission: 'Viewer' },
  { name: 'Chidi Umeh', role: 'Finance Controller', brand: 'FoundFinance', status: 'active', lastActive: '5 min ago', permission: 'Admin' },
  { name: 'Sofia Reyes', role: 'Compliance Lead', brand: 'FoundHealth', status: 'active', lastActive: '22 min ago', permission: 'Member' },
  { name: 'Daniel Kessler', role: 'Fleet Coordinator', brand: 'FoundLogistics', status: 'inactive', lastActive: '5 days ago', permission: 'Viewer' },
]

export function getTeamMembers(): TeamMember[] {
  return TEAM_MEMBERS
}

export function SuperDashTeamViewer({ members = TEAM_MEMBERS }: { members?: TeamMember[] }) {
  return (
    <section className="panel panel-premium quantum-ambient-grid quantum-card">
      <div className="quantum-particle-drift"><span className="quantum-particle" /><span className="quantum-particle" /><span className="quantum-particle" /></div>
      <span className="quantum-corner-marker">⌂</span>
      <h3 className="header-premium">Enterprise Team Viewer</h3>
      <div className="team-viewer-grid">
        {members.map((member) => (
          <div key={member.name} className="team-viewer-row">
            <div>
              <strong>{member.name}</strong>
              <div><small>{member.role} · {member.brand}</small></div>
            </div>
            <span className={`team-viewer-status ${member.status}`}>{member.status}</span>
            <small>{member.lastActive}</small>
            <small>{member.permission}</small>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SuperDashTeamViewer
