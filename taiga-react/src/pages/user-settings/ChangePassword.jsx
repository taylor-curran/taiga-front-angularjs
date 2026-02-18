import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/users.service';
import UserSettingsNav from './UserSettingsNav';
import './UserSettings.css';

const ChangePassword = () => {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword1 !== newPassword2) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (!newPassword1) {
      setMessage({ type: 'error', text: 'New password is required.' });
      return;
    }

    setSaving(true);
    try {
      await usersService.changePassword(currentPassword, newPassword1);
      setMessage({ type: 'success', text: 'Password changed successfully.' });
      setCurrentPassword('');
      setNewPassword1('');
      setNewPassword2('');
    } catch (err) {
      const errorMsg = err.response?.data?._error_message || 'Failed to change password.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
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

      <section className="main user-change-password">
        <header>
          <h1>Change password</h1>
        </header>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="current-password">Current password</label>
            <input
              type="password"
              name="password"
              id="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />
          </fieldset>

          <fieldset>
            <label htmlFor="new-password">New password</label>
            <input
              type="password"
              name="new-password"
              id="new-password"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              required
              placeholder="New password"
            />
          </fieldset>

          <fieldset>
            <label htmlFor="retype-password">Retype new password</label>
            <input
              type="password"
              name="retype-password"
              id="retype-password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
              placeholder="Retype new password"
            />
          </fieldset>

          <fieldset>
            <button
              type="submit"
              className="btn-small"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default ChangePassword;
