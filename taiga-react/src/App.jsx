import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/common/Layout';
import PrivateRoute from './components/common/PrivateRoute';
import ProfilePage from './pages/profile/ProfilePage';
import TeamPage from './pages/team/TeamPage';
import UserProfileSettings from './pages/user-settings/UserProfileSettings';
import ChangePassword from './pages/user-settings/ChangePassword';
import MailNotifications from './pages/user-settings/MailNotifications';
import LiveNotifications from './pages/user-settings/LiveNotifications';
import WebNotifications from './pages/user-settings/WebNotifications';
import UserProjectSettings from './pages/user-settings/UserProjectSettings';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/profile" replace />} />

            <Route path="/project/:pslug/team" element={<TeamPage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            <Route path="/profile/:slug" element={<ProfilePage />} />

            <Route element={<PrivateRoute />}>
              <Route path="/user-settings/user-profile" element={<UserProfileSettings />} />
              <Route path="/user-settings/user-change-password" element={<ChangePassword />} />
              <Route path="/user-settings/mail-notifications" element={<MailNotifications />} />
              <Route path="/user-settings/live-notifications" element={<LiveNotifications />} />
              <Route path="/user-settings/web-notifications" element={<WebNotifications />} />
              <Route path="/user-settings/user-project-settings" element={<UserProjectSettings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
