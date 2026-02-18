const TeamMemberStats = ({ stats, userId, issuesEnabled, tasksEnabled, wikiEnabled }) => {
  if (!stats) {
    return null;
  }

  const getOpacity = (statGroup, uid) => {
    return statGroup?.[uid] || 0.1;
  };

  const isTop = (statGroup, uid) => {
    return statGroup?.[uid] === 1;
  };

  return (
    <div className="member-stats">
      {issuesEnabled && (
        <div className="attribute">
          <span
            className={`stat-icon icon-briefcase${isTop(stats.closed_bugs, userId) ? ' top' : ''}`}
            style={{ opacity: getOpacity(stats.closed_bugs, userId) }}
            title="Closed bugs"
          />
        </div>
      )}
      {tasksEnabled && (
        <div className="attribute">
          <span
            className={`stat-icon icon-iocaine${isTop(stats.iocaine_tasks, userId) ? ' top' : ''}`}
            style={{ opacity: getOpacity(stats.iocaine_tasks, userId) }}
            title="Iocaine tasks"
          />
        </div>
      )}
      {wikiEnabled && (
        <div className="attribute">
          <span
            className={`stat-icon icon-edit${isTop(stats.wiki_changes, userId) ? ' top' : ''}`}
            style={{ opacity: getOpacity(stats.wiki_changes, userId) }}
            title="Wiki changes"
          />
        </div>
      )}
      {issuesEnabled && (
        <div className="attribute">
          <span
            className={`stat-icon icon-bug${isTop(stats.created_bugs, userId) ? ' top' : ''}`}
            style={{ opacity: getOpacity(stats.created_bugs, userId) }}
            title="Created bugs"
          />
        </div>
      )}
      {tasksEnabled && (
        <div className="attribute">
          <span
            className={`stat-icon icon-task${isTop(stats.closed_tasks, userId) ? ' top' : ''}`}
            style={{ opacity: getOpacity(stats.closed_tasks, userId) }}
            title="Closed tasks"
          />
        </div>
      )}
      <div className="attribute">
        <span className="points">{stats.totals?.[userId] || 0}</span>
      </div>
    </div>
  );
};

export default TeamMemberStats;
