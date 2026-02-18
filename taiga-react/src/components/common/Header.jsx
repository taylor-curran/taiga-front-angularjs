import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Taiga</h1>
        </Link>
        <nav className="main-nav">
          {isAuthenticated && (
            <>
              <Link to="/profile">Profile</Link>
              <Link to="/user-settings/user-profile">Settings</Link>
              <button onClick={logout} className="btn-logout">
                Logout
              </button>
              <span className="user-display">{user?.full_name || user?.username}</span>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
