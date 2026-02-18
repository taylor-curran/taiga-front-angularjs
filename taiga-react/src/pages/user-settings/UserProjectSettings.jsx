import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UserSettingsNav from './UserSettingsNav';
import './UserSettings.css';

const SECTIONS = [
  { id: 'backlog', name: 'Backlog' },
  { id: 'kanban', name: 'Kanban' },
  { id: 'issues', name: 'Issues' },
  { id: 'wiki', name: 'Wiki' },
];

const UserProjectSettings = () => {
  const { user } = useAuth();
  const [projects] = useState([]);
  const [loading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setMessage(null);
  }, []);

  if (!user) {
    return <div className="error-message">You must be logged in to access settings.</div>;
  }

  return (
    <div className="wrapper user-settings-page">
      <aside className="menu-secondary sidebar settings-nav-sidebar">
        <UserSettingsNav />
      </aside>

      <section className="main admin-common">
        <header>
          <h1>Project settings</h1>
        </header>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <p className="total">Configure default homepage for each project</p>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="project-settings-list">
            {projects.map((projectSettings) => (
              <div key={projectSettings.id} className="project-settings-item">
                <div className="project-name">{projectSettings.project_name}</div>
                <div className="project-homepage">
                  <select
                    value={projectSettings.homepage || ''}
                    onChange={() => {}}
                  >
                    <option value="">Default</option>
                    {SECTIONS.filter((s) =>
                      projectSettings.allowed_sections?.includes(s.id)
                    ).map((section) => (
                      <option key={section.id} value={section.id}>
                        {section.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="no-results">No project settings available.</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProjectSettings;
