import { NavLink } from 'react-router-dom';

const UserSettingsNav = () => {
  const navItems = [
    { path: '/user-settings/user-profile', label: 'Edit profile', id: 'user-profile' },
    { path: '/user-settings/user-change-password', label: 'Change password', id: 'change-password' },
    { path: '/user-settings/mail-notifications', label: 'Mail notifications', id: 'mail-notifications' },
    { path: '/user-settings/live-notifications', label: 'Live notifications', id: 'live-notifications' },
    { path: '/user-settings/web-notifications', label: 'Web notifications', id: 'web-notifications' },
    { path: '/user-settings/user-project-settings', label: 'Project settings', id: 'project-settings' },
  ];

  return (
    <nav className="settings-nav">
      <ul>
        {navItems.map((item) => (
          <li key={item.id} id={`usersettingsmenu-${item.id}`}>
            <NavLink
              to={item.path}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UserSettingsNav;
