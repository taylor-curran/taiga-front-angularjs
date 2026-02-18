import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/users.service';
import { localesService } from '../../services/locales.service';
import UserSettingsNav from './UserSettingsNav';
import './UserSettings.css';

const UserProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    bio: '',
    lang: '',
    theme: '',
  });
  const [locales, setLocales] = useState([]);
  const [availableThemes] = useState(['taiga', 'material-design', 'high-contrast']);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        full_name: user.full_name || '',
        bio: user.bio || '',
        lang: user.lang || '',
        theme: user.theme || 'taiga',
      });
    }
  }, [user]);

  useEffect(() => {
    localesService
      .getLocales()
      .then((data) => setLocales(data))
      .catch(() => setLocales([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setMessage(null);

    try {
      const updatedUser = await usersService.updateUser(user.id, {
        username: formData.username,
        email: formData.email,
        full_name: formData.full_name,
        bio: formData.bio,
        lang: formData.lang,
        theme: formData.theme,
      });
      updateUser(updatedUser);

      const emailChanged = formData.email !== user.email;
      if (emailChanged) {
        setMessage({ type: 'success', text: 'Profile saved. Check your email to verify the new address.' });
      } else {
        setMessage({ type: 'success', text: 'Profile saved successfully.' });
      }
    } catch (err) {
      const errorMsg = err.response?.data?._error_message || 'Failed to save profile.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    try {
      const updatedUser = await usersService.changeAvatar(file);
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Avatar updated successfully.' });
    } catch (err) {
      const errorMsg =
        err.response?.status === 413
          ? 'File is too large.'
          : err.response?.data?._error_message || 'Failed to update avatar.';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleUseGravatar = async (e) => {
    e.preventDefault();
    setAvatarUploading(true);
    try {
      const updatedUser = await usersService.removeAvatar();
      updateUser(updatedUser);
      setMessage({ type: 'success', text: 'Using Gravatar image.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update avatar.' });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      await usersService.sendVerificationEmail();
      setMessage({ type: 'success', text: 'Verification email sent.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?._error_message || 'Failed to send verification email.' });
    }
  };

  const handleExportProfile = async () => {
    try {
      const result = await usersService.exportProfile();
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?._error_message || 'Failed to export profile.' });
    }
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    usersService
      .deleteAccount()
      .then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.response?.data?._error_message || 'Failed to delete account.' });
      });
  };

  if (!user) {
    return <div className="error-message">You must be logged in to access settings.</div>;
  }

  return (
    <div className="wrapper user-settings-page">
      <aside className="menu-secondary sidebar settings-nav-sidebar">
        <UserSettingsNav />
      </aside>

      <section className="main user-profile-settings">
        <header>
          <h1>Edit profile</h1>
        </header>

        {message && (
          <div className={`notification ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="project-details-image">
            <fieldset className="image-container">
              <img
                className="image"
                src={user.big_photo || user.photo || '/images/default-avatar.png'}
                alt="avatar"
              />
              {avatarUploading && (
                <div className="loading-overlay active">
                  <span>Uploading...</span>
                </div>
              )}
              <input
                type="file"
                id="avatar-field"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </fieldset>

            <button
              type="button"
              className="btn-small button-full"
              onClick={() => fileInputRef.current?.click()}
            >
              Change photo
            </button>

            <a href="#" className="use-default-image" onClick={handleUseGravatar}>
              Use Gravatar
            </a>
          </div>

          <div className="project-details-form-data">
            <fieldset>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                id="username"
                autoCorrect="off"
                autoCapitalize="none"
                value={formData.username}
                onChange={handleChange}
                required
                maxLength={255}
                pattern="[\w.\-]+"
                placeholder="Username"
              />
            </fieldset>

            <fieldset>
              <label htmlFor="email">Email</label>
              {user.verified_email === false && (
                <div>
                  <a
                    href="#"
                    className="verify-email"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVerifyEmail();
                    }}
                  >
                    Verify email
                  </a>
                </div>
              )}
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                maxLength={255}
                placeholder="Email"
              />
            </fieldset>

            <fieldset>
              <label htmlFor="full-name">Full name</label>
              <input
                type="text"
                name="full_name"
                id="full-name"
                value={formData.full_name}
                onChange={handleChange}
                required
                maxLength={256}
                placeholder="Full name"
              />
            </fieldset>

            <fieldset>
              <label htmlFor="lang">Language</label>
              <select
                name="lang"
                id="lang"
                value={formData.lang}
                onChange={handleChange}
              >
                <option value="">Default</option>
                {locales.map((locale) => (
                  <option key={locale.code} value={locale.code}>
                    {locale.name}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset>
              <label htmlFor="theme">Theme</label>
              <select
                name="theme"
                id="theme"
                value={formData.theme}
                onChange={handleChange}
              >
                <option value="">Default</option>
                {availableThemes.map((theme) => (
                  <option key={theme} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset>
              <label htmlFor="bio">Bio</label>
              <textarea
                name="bio"
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                maxLength={210}
              />
            </fieldset>

            <fieldset className="submit">
              <button
                type="submit"
                className="btn-small"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </fieldset>

            <div className="actions">
              <a
                href="#"
                className="download-profile"
                onClick={(e) => {
                  e.preventDefault();
                  handleExportProfile();
                }}
              >
                Download profile data
              </a>
              <a
                href="#"
                className="delete-account"
                onClick={(e) => {
                  e.preventDefault();
                  handleDeleteAccount();
                }}
              >
                Delete account
              </a>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UserProfileSettings;
