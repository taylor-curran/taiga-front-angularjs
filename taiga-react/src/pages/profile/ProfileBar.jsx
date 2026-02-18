import { Link } from 'react-router-dom';

const ProfileBar = ({ user, stats, isCurrentUser }) => {
  if (!user) return null;

  return (
    <section className="profile-bar">
      <div className={`profile-image-wrapper${isCurrentUser ? ' is-current-user' : ''}`}>
        <img
          className="profile-img"
          src={user.big_photo || user.photo || '/images/default-avatar.png'}
          alt={user.full_name}
        />
        {isCurrentUser && (
          <Link to="/user-settings/user-profile" className="profile-edition">
            Edit profile
          </Link>
        )}
      </div>
      <div className="profile-data">
        <h1 className={!user.full_name ? 'not-full-name' : ''}>
          {user.full_name_display || user.full_name || user.username}
        </h1>
        <div className="username-display">@{user.username}</div>
        {stats?.roles && (
          <h2>{stats.roles.join(', ')}</h2>
        )}
      </div>
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-number">{stats?.total_num_projects || 0}</span>
          <span className="stat-name">Projects</span>
        </div>
        <div className="stat">
          <span className="stat-number">{stats?.total_num_closed_userstories || 0}</span>
          <span className="stat-name">Closed US</span>
        </div>
        <div className="stat">
          <span className="stat-number">{stats?.total_num_contacts || 0}</span>
          <span className="stat-name">Contacts</span>
        </div>
      </div>
      {user.bio && (
        <div className="profile-quote">
          <span>{user.bio.length > 210 ? `${user.bio.substring(0, 210)}...` : user.bio}</span>
        </div>
      )}
    </section>
  );
};

export default ProfileBar;
