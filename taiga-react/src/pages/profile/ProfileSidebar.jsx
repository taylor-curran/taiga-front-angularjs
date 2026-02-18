import { Link } from 'react-router-dom';

const ProfileSidebar = ({ isCurrentUser }) => {
  return (
    <aside className="profile-sidebar">
      {isCurrentUser && (
        <div>
          <h4>Your profile</h4>
          <p>Complete your profile information so others can know you better.</p>
          <Link to="/user-settings/user-profile" className="btn-big edit-profile">
            <span>Edit your info</span>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default ProfileSidebar;
