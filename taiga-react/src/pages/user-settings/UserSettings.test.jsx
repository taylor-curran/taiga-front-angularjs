import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UserProfileSettings from './UserProfileSettings';
import ChangePassword from './ChangePassword';
import MailNotifications from './MailNotifications';
import LiveNotifications from './LiveNotifications';
import WebNotifications from './WebNotifications';
import UserProjectSettings from './UserProjectSettings';

const mockUser = {
  id: 1,
  username: 'testuser',
  full_name: 'Test User',
  email: 'test@example.com',
  bio: 'Test bio',
  photo: null,
  big_photo: null,
  lang: 'en',
  theme: 'taiga',
  verified_email: true,
};

const mockUpdateUser = vi.fn();

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
    updateUser: mockUpdateUser,
  }),
}));

vi.mock('../../services/users.service', () => ({
  usersService: {
    updateUser: vi.fn(),
    changeAvatar: vi.fn(),
    removeAvatar: vi.fn(),
    changePassword: vi.fn(),
    deleteAccount: vi.fn(),
    exportProfile: vi.fn(),
    sendVerificationEmail: vi.fn(),
  },
}));

vi.mock('../../services/locales.service', () => ({
  localesService: {
    getLocales: vi.fn().mockResolvedValue([
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
    ]),
  },
}));

vi.mock('../../services/notifications.service', () => ({
  notificationsService: {
    getNotifyPolicies: vi.fn(),
    updateNotifyPolicy: vi.fn(),
  },
}));

import { usersService } from '../../services/users.service';
import { notificationsService } from '../../services/notifications.service';

const renderInRouter = (component, path = '/', entries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={entries}>
      <Routes>
        <Route path={path} element={component} />
      </Routes>
    </MemoryRouter>
  );
};

describe('UserProfileSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the edit profile form', async () => {
    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit profile' })).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Full name')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
    expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
  });

  it('populates form with user data', async () => {
    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('submits form and calls updateUser', async () => {
    usersService.updateUser.mockResolvedValue({ ...mockUser, full_name: 'Updated User' });

    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    });

    const fullNameInput = screen.getByLabelText('Full name');
    fireEvent.change(fullNameInput, { target: { value: 'Updated User' } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(usersService.updateUser).toHaveBeenCalledWith(1, expect.objectContaining({
        full_name: 'Updated User',
      }));
    });
  });

  it('shows error on failed save', async () => {
    usersService.updateUser.mockRejectedValue({
      response: { data: { _error_message: 'Username already taken.' } },
    });

    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Username already taken.')).toBeInTheDocument();
    });
  });

  it('loads locale options', async () => {
    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  it('renders navigation links', async () => {
    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Edit profile' })).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: 'Change password' })).toBeInTheDocument();
    expect(screen.getByText('Mail notifications')).toBeInTheDocument();
    expect(screen.getByText('Live notifications')).toBeInTheDocument();
    expect(screen.getByText('Web notifications')).toBeInTheDocument();
    expect(screen.getByText('Project settings')).toBeInTheDocument();
  });

  it('renders delete account and download links', async () => {
    renderInRouter(<UserProfileSettings />, '/user-settings/user-profile', ['/user-settings/user-profile']);

    await waitFor(() => {
      expect(screen.getByText('Download profile data')).toBeInTheDocument();
    });

    expect(screen.getByText('Delete account')).toBeInTheDocument();
  });
});

describe('ChangePassword', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the change password form', () => {
    renderInRouter(<ChangePassword />, '/user-settings/user-change-password', ['/user-settings/user-change-password']);

    expect(screen.getByRole('heading', { name: 'Change password' })).toBeInTheDocument();
    expect(screen.getByLabelText('Current password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Retype new password')).toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    renderInRouter(<ChangePassword />, '/user-settings/user-change-password', ['/user-settings/user-change-password']);

    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'oldpass' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'newpass1' } });
    fireEvent.change(screen.getByLabelText('Retype new password'), { target: { value: 'newpass2' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('New passwords do not match.')).toBeInTheDocument();
    });
  });

  it('calls changePassword on valid submission', async () => {
    usersService.changePassword.mockResolvedValue({});

    renderInRouter(<ChangePassword />, '/user-settings/user-change-password', ['/user-settings/user-change-password']);

    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'oldpass' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'newpass' } });
    fireEvent.change(screen.getByLabelText('Retype new password'), { target: { value: 'newpass' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(usersService.changePassword).toHaveBeenCalledWith('oldpass', 'newpass');
    });

    expect(screen.getByText('Password changed successfully.')).toBeInTheDocument();
  });

  it('shows API error on failed password change', async () => {
    usersService.changePassword.mockRejectedValue({
      response: { data: { _error_message: 'Incorrect current password.' } },
    });

    renderInRouter(<ChangePassword />, '/user-settings/user-change-password', ['/user-settings/user-change-password']);

    fireEvent.change(screen.getByLabelText('Current password'), { target: { value: 'wrongpass' } });
    fireEvent.change(screen.getByLabelText('New password'), { target: { value: 'newpass' } });
    fireEvent.change(screen.getByLabelText('Retype new password'), { target: { value: 'newpass' } });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(screen.getByText('Incorrect current password.')).toBeInTheDocument();
    });
  });
});

describe('MailNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders mail notifications with policies', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([
      { id: 1, project_name: 'Project A', notify_level: 2 },
      { id: 2, project_name: 'Project B', notify_level: 1 },
    ]);

    renderInRouter(<MailNotifications />, '/user-settings/mail-notifications', ['/user-settings/mail-notifications']);

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });

    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  it('updates policy when radio button is changed', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([
      { id: 1, project_name: 'Project A', notify_level: 2 },
    ]);
    notificationsService.updateNotifyPolicy.mockResolvedValue({});

    renderInRouter(<MailNotifications />, '/user-settings/mail-notifications', ['/user-settings/mail-notifications']);

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });

    const noneRadio = screen.getByLabelText('None');
    fireEvent.click(noneRadio);

    await waitFor(() => {
      expect(notificationsService.updateNotifyPolicy).toHaveBeenCalledWith(1, { notify_level: 3 });
    });
  });

  it('shows empty state when no policies', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([]);

    renderInRouter(<MailNotifications />, '/user-settings/mail-notifications', ['/user-settings/mail-notifications']);

    await waitFor(() => {
      expect(screen.getByText('No notification policies found.')).toBeInTheDocument();
    });
  });
});

describe('LiveNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders live notifications with policies', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([
      { id: 1, project_name: 'Project A', live_notify_level: 2 },
    ]);

    renderInRouter(<LiveNotifications />, '/user-settings/live-notifications', ['/user-settings/live-notifications']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Live notifications' })).toBeInTheDocument();
    });

    expect(screen.getByText('Project A')).toBeInTheDocument();
  });

  it('updates live notify policy', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([
      { id: 1, project_name: 'Project A', live_notify_level: 2 },
    ]);
    notificationsService.updateNotifyPolicy.mockResolvedValue({});

    renderInRouter(<LiveNotifications />, '/user-settings/live-notifications', ['/user-settings/live-notifications']);

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });

    const noneRadio = screen.getByLabelText('None');
    fireEvent.click(noneRadio);

    await waitFor(() => {
      expect(notificationsService.updateNotifyPolicy).toHaveBeenCalledWith(1, { live_notify_level: 3 });
    });
  });
});

describe('WebNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders web notifications with toggle', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([
      { id: 1, project_name: 'Project A', web_notify_level: true },
    ]);

    renderInRouter(<WebNotifications />, '/user-settings/web-notifications', ['/user-settings/web-notifications']);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Web notifications' })).toBeInTheDocument();
    });

    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
  });

  it('toggles web notification', async () => {
    notificationsService.getNotifyPolicies.mockResolvedValue([
      { id: 1, project_name: 'Project A', web_notify_level: true },
    ]);
    notificationsService.updateNotifyPolicy.mockResolvedValue({});

    renderInRouter(<WebNotifications />, '/user-settings/web-notifications', ['/user-settings/web-notifications']);

    await waitFor(() => {
      expect(screen.getByText('Project A')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(notificationsService.updateNotifyPolicy).toHaveBeenCalledWith(1, { web_notify_level: false });
    });
  });
});

describe('UserProjectSettings', () => {
  it('renders project settings page', () => {
    renderInRouter(<UserProjectSettings />, '/user-settings/user-project-settings', ['/user-settings/user-project-settings']);

    expect(screen.getByRole('heading', { name: 'Project settings' })).toBeInTheDocument();
    expect(screen.getByText('Configure default homepage for each project')).toBeInTheDocument();
  });

  it('shows empty state', () => {
    renderInRouter(<UserProjectSettings />, '/user-settings/user-project-settings', ['/user-settings/user-project-settings']);

    expect(screen.getByText('No project settings available.')).toBeInTheDocument();
  });
});
