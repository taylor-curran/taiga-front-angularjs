import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsService } from '../../services/notifications.service';
import UserSettingsNav from './UserSettingsNav';
import './UserSettings.css';

const NOTIFY_LEVELS = {
  ALL: 2,
  INVOLVED: 1,
  NONE: 3,
};

const MailNotifications = () => {
  const { user } = useAuth();
  const [notifyPolicies, setNotifyPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    notificationsService
      .getNotifyPolicies()
      .then((data) => setNotifyPolicies(data))
      .catch(() => setMessage({ type: 'error', text: 'Failed to load notification settings.' }))
      .finally(() => setLoading(false));
  }, []);

  const handlePolicyChange = async (policyIndex, newLevel) => {
    const policy = notifyPolicies[policyIndex];
    const prevLevel = policy.notify_level;

    const updatedPolicies = [...notifyPolicies];
    updatedPolicies[policyIndex] = { ...policy, notify_level: newLevel };
    setNotifyPolicies(updatedPolicies);

    try {
      await notificationsService.updateNotifyPolicy(policy.id, {
        notify_level: newLevel,
      });
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch {
      updatedPolicies[policyIndex] = { ...policy, notify_level: prevLevel };
      setNotifyPolicies([...updatedPolicies]);
      setMessage({ type: 'error', text: 'Failed to save settings.' });
    }
  };

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
          <h1>Mail notifications</h1>
        </header>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <p className="total">Configure email notifications per project</p>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="policy-table">
            <div className="policy-table-header">
              <div className="policy-table-project">Project</div>
              <div className="policy-table-all">All</div>
              <div className="policy-table-involved">Only involved</div>
              <div className="policy-table-none">None</div>
            </div>
            {notifyPolicies.map((policy, index) => (
              <div key={policy.id} className="policy-table-row">
                <div className="policy-table-project">
                  <span>{policy.project_name}</span>
                </div>
                <div className="policy-table-all">
                  <div className="button-check">
                    <input
                      type="radio"
                      name={`policy-${policy.id}`}
                      id={`policy-all-${policy.id}`}
                      value={NOTIFY_LEVELS.ALL}
                      checked={policy.notify_level === NOTIFY_LEVELS.ALL}
                      onChange={() => handlePolicyChange(index, NOTIFY_LEVELS.ALL)}
                    />
                    <label htmlFor={`policy-all-${policy.id}`}>All</label>
                  </div>
                </div>
                <div className="policy-table-involved">
                  <div className="button-check">
                    <input
                      type="radio"
                      name={`policy-${policy.id}`}
                      id={`policy-involved-${policy.id}`}
                      value={NOTIFY_LEVELS.INVOLVED}
                      checked={policy.notify_level === NOTIFY_LEVELS.INVOLVED}
                      onChange={() => handlePolicyChange(index, NOTIFY_LEVELS.INVOLVED)}
                    />
                    <label htmlFor={`policy-involved-${policy.id}`}>Only involved</label>
                  </div>
                </div>
                <div className="policy-table-none">
                  <div className="button-check">
                    <input
                      type="radio"
                      name={`policy-${policy.id}`}
                      id={`policy-none-${policy.id}`}
                      value={NOTIFY_LEVELS.NONE}
                      checked={policy.notify_level === NOTIFY_LEVELS.NONE}
                      onChange={() => handlePolicyChange(index, NOTIFY_LEVELS.NONE)}
                    />
                    <label htmlFor={`policy-none-${policy.id}`}>None</label>
                  </div>
                </div>
              </div>
            ))}
            {notifyPolicies.length === 0 && (
              <div className="no-results">No notification policies found.</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MailNotifications;
