import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { usersService } from '../../services/users.service';
import ProfileBar from './ProfileBar';
import ProfileTabs from './ProfileTabs';
import ProfileSidebar from './ProfileSidebar';
import ProfileContacts from './ProfileContacts';
import './ProfilePage.css';

const ProfilePage = () => {
  const { slug } = useParams();
  const { user: currentAuthUser } = useAuth();

  const [profileUser, setProfileUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      let userData;

      if (slug) {
        userData = await usersService.getUserByUsername(slug);
        if (!userData.is_active) {
          setError('User not found.');
          return;
        }
        setIsCurrentUser(false);
      } else if (currentAuthUser) {
        userData = currentAuthUser;
        setIsCurrentUser(true);
      } else {
        setError('Not authenticated.');
        return;
      }

      setProfileUser(userData);

      const userStats = await usersService.getUserStats(userData.id);
      setStats(userStats);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        setError('User not found.');
      } else {
        setError('Failed to load profile.');
      }
    } finally {
      setLoading(false);
    }
  }, [slug, currentAuthUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profileUser) {
    return <div className="error-message">User not found.</div>;
  }

  const tabs = [
    {
      id: 'activity',
      label: 'Activity',
      title: 'User activity timeline',
      icon: 'icon-timeline',
      content: (
        <div className="activity-placeholder">
          <p>Activity timeline will be displayed here.</p>
        </div>
      ),
    },
    {
      id: 'projects',
      label: 'Projects',
      title: 'User projects',
      icon: 'icon-project',
      content: (
        <div className="projects-placeholder">
          <p>User projects will be displayed here.</p>
        </div>
      ),
    },
    {
      id: 'likes',
      label: 'Likes',
      title: 'Liked items',
      icon: 'icon-like',
      content: (
        <div className="likes-placeholder">
          <p>Liked items will be displayed here.</p>
        </div>
      ),
    },
    {
      id: 'watched',
      label: 'Watched',
      title: 'Watched items',
      icon: 'icon-watch',
      content: (
        <div className="watched-placeholder">
          <p>Watched items will be displayed here.</p>
        </div>
      ),
    },
    {
      id: 'contacts',
      label: 'Contacts',
      title: 'User contacts',
      icon: 'icon-team',
      content: <ProfileContacts user={profileUser} />,
    },
  ];

  return (
    <div className="profile centered">
      <ProfileBar user={profileUser} stats={stats} isCurrentUser={isCurrentUser} />
      <div className="main">
        <ProfileTabs tabs={tabs} />
        <ProfileSidebar isCurrentUser={isCurrentUser} />
      </div>
    </div>
  );
};

export default ProfilePage;
