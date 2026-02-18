import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationsService } from '../../services/notifications.service';
import UserSettingsNav from './UserSettingsNav';
import './UserSettings.css';

const WebNotifications = () => {
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

  const handleToggle = async (policyIndex) => {
    const policy = notifyPolicies[policyIndex];
    const newValue = !policy.web_notify_level;

    const updatedPolicies = [...notifyPolicies];
    updatedPolicies[policyIndex] = { ...policy, web_notify_level: newValue };
    setNotifyPolicies(updatedPolicies);

    try {
      await notificationsService.updateNotifyPolicy(policy.id, {
        web_notify_level: newValue,
      });
      setMessage({ type: 'success', text: 'Settings saved.' });
    } catch {
      updatedPolicies[policyIndex] = { ...policy, web_notify_level: !newValue };
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
          <h1>Web notifications</h1>
        </header>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <p className="total">Configure web notifications per project</p>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="policy-table">
            <div className="policy-table-header">
              <div className="policy-table-project">Project</div>
              <div className="policy-table-all">Enabled</div>
            </div>
            {notifyPolicies.map((policy, index) => (
              <div key={policy.id} className="policy-table-row">
                <div className="policy-table-project">
                  <span>{policy.project_name}</span>
                </div>
                <div className="policy-table-all">
                  <div className="check">
                    <input
                      type="checkbox"
                      name={`web-policy-${policy.id}`}
                      id={`web-policy-${policy.id}`}
                      checked={!!policy.web_notify_level}
                      onChange={() => handleToggle(index)}
                    />
                    <label htmlFor={`web-policy-${policy.id}`}>
                      {policy.web_notify_level ? 'Yes' : 'No'}
                    </label>
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

export default WebNotifications;
