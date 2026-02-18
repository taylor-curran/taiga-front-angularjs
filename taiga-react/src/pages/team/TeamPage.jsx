import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { projectsService } from '../../services/projects.service';
import TeamFilters from './TeamFilters';
import TeamMembers from './TeamMembers';
import TeamMemberStats from './TeamMemberStats';
import './TeamPage.css';

const processStats = (stats) => {
  const processed = {};
  for (const [key, value] of Object.entries(stats)) {
    const values = Object.values(value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const singleStat = {};
    for (const [uid, val] of Object.entries(value)) {
      if (val === min) {
        singleStat[uid] = 0.1;
      } else if (val === max) {
        singleStat[uid] = 1;
      } else {
        singleStat[uid] = (val * 0.5) / max;
      }
    }
    processed[key] = singleStat;
  }
  return processed;
};

const TeamPage = () => {
  const { pslug } = useParams();
  const navigate = useNavigate();
  const { user: currentAuthUser } = useAuth();

  const [project, setProject] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stats, setStats] = useState(null);
  const [filtersRole, setFiltersRole] = useState(null);
  const [filtersQ, setFiltersQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const projectData = await projectsService.getProjectBySlug(pslug);
      setProject(projectData);

      const activeMembers = projectData.members.filter((m) => m.is_active);

      const totals = {};
      activeMembers.forEach((member) => {
        totals[member.id] = 0;
      });

      const currentMember = activeMembers.find(
        (m) => m.id === currentAuthUser?.id
      );
      setCurrentUser(currentMember || null);

      const otherMembers = activeMembers.filter(
        (m) => m.id !== currentAuthUser?.id
      );
      setMemberships(otherMembers);

      const memberRoleIds = new Set(activeMembers.map((m) => m.role));
      const filteredRoles = (projectData.roles || []).filter((role) =>
        memberRoleIds.has(role.id)
      );
      setRoles(filteredRoles);

      const memberStats = await projectsService.getMemberStats(projectData.id);
      const processedStats = processStats(memberStats);

      const computedTotals = {};
      Object.keys(totals).forEach((userId) => {
        const vals = Object.values(memberStats).map(
          (statGroup) => statGroup[userId] || 0
        );
        computedTotals[userId] = vals.reduce((sum, el) => sum + el, 0);
      });
      processedStats.totals = computedTotals;

      setStats(processedStats);
      setError(null);
    } catch (err) {
      setError('Failed to load team data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pslug, currentAuthUser?.id]);

  useEffect(() => {
    if (pslug) {
      loadData();
    }
  }, [pslug, loadData]);

  const handleLeaveProject = async () => {
    if (!project) return;
    const confirmed = window.confirm(
      'Are you sure you want to leave this project?'
    );
    if (!confirmed) return;

    try {
      await projectsService.leaveProject(project.id);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?._error_message || 'Failed to leave project.');
    }
  };

  if (loading) {
    return <div className="loading">Loading team...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!project) {
    return <div className="error-message">Project not found.</div>;
  }

  const issuesEnabled = project.is_issues_activated;
  const tasksEnabled =
    project.is_kanban_activated || project.is_backlog_activated;
  const wikiEnabled = project.is_wiki_activated;
  const ownerId = project.owner?.id;

  return (
    <div className="wrapper team-page">
      <aside className="menu-secondary sidebar">
        <TeamFilters
          roles={roles}
          activeRole={filtersRole}
          onRoleSelect={setFiltersRole}
        />
      </aside>

      <section className="main team">
        <header className="main-title">
          <h1>{project.name} - Team</h1>
        </header>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search members..."
            value={filtersQ}
            onChange={(e) => setFiltersQ(e.target.value)}
            className="search-input"
          />
        </div>

        {currentUser && (
          <div className="current-user-section">
            <div className="row">
              <div className="username">
                <div className="avatar">
                  <img
                    src={currentUser.photo || '/images/default-avatar.png'}
                    alt={currentUser.full_name_display}
                  />
                  <div className="avatar-data">
                    <div className="name">
                      <span>{currentUser.full_name_display}</span>
                      {currentUser.id === ownerId && (
                        <span className="icon-badge" title="Owner" />
                      )}
                    </div>
                    <div className="position">{currentUser.role_name}</div>
                    {currentUser.id !== ownerId && (
                      <a
                        href="#"
                        className="leave-project"
                        onClick={(e) => {
                          e.preventDefault();
                          handleLeaveProject();
                        }}
                      >
                        <span className="icon-close" />
                        <span>Leave project</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <TeamMemberStats
                stats={stats}
                userId={currentUser.id}
                issuesEnabled={issuesEnabled}
                tasksEnabled={tasksEnabled}
                wikiEnabled={wikiEnabled}
              />
            </div>
          </div>
        )}

        <TeamMembers
          memberships={memberships}
          filtersQ={filtersQ}
          filtersRole={filtersRole}
          stats={stats}
          issuesEnabled={issuesEnabled}
          tasksEnabled={tasksEnabled}
          wikiEnabled={wikiEnabled}
          ownerId={ownerId}
        />
      </section>
    </div>
  );
};

export default TeamPage;
