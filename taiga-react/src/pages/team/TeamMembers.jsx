import { Link } from 'react-router-dom';
import TeamMemberStats from './TeamMemberStats';

const TeamMembers = ({
  memberships,
  filtersQ,
  filtersRole,
  stats,
  issuesEnabled,
  tasksEnabled,
  wikiEnabled,
  ownerId,
}) => {
  const filteredMembers = memberships.filter((member) => {
    const matchesRole = !filtersRole || member.role === filtersRole.id;
    const matchesQuery =
      !filtersQ ||
      member.full_name_display?.toLowerCase().includes(filtersQ.toLowerCase());
    return matchesRole && matchesQuery;
  });

  return (
    <div className="team-members">
      {filteredMembers.map((user) => (
        <div key={user.id} className="row member">
          <div className="username">
            <div className="avatar">
              <img
                src={user.photo || '/images/default-avatar.png'}
                alt={user.full_name_display}
              />
              <div className="avatar-data">
                <Link
                  to={`/profile/${user.username}`}
                  className="name"
                  title={user.full_name_display}
                >
                  {user.full_name_display}
                  {user.id === ownerId && (
                    <span className="icon-badge" title="Owner" />
                  )}
                </Link>
                <span className="position">{user.role_name}</span>
              </div>
            </div>
          </div>
          <TeamMemberStats
            stats={stats}
            userId={user.id}
            issuesEnabled={issuesEnabled}
            tasksEnabled={tasksEnabled}
            wikiEnabled={wikiEnabled}
          />
        </div>
      ))}
      {filteredMembers.length === 0 && (
        <div className="no-results">No team members found.</div>
      )}
    </div>
  );
};

export default TeamMembers;
