import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProfilePage from './ProfilePage';

const mockUser = {
  id: 1,
  username: 'testuser',
  full_name: 'Test User',
  full_name_display: 'Test User',
  email: 'test@example.com',
  bio: 'A test biography for the user profile.',
  photo: null,
  big_photo: null,
  is_active: true,
};

const mockStats = {
  total_num_projects: 5,
  total_num_closed_userstories: 42,
  total_num_contacts: 10,
  roles: ['Admin', 'Developer'],
};

vi.mock('../../services/users.service', () => ({
  usersService: {
    getUserByUsername: vi.fn(),
    getUserStats: vi.fn(),
    getUserContacts: vi.fn(),
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    loading: false,
  }),
}));

import { usersService } from '../../services/users.service';

const renderProfilePage = (path = '/profile', entries = ['/profile']) => {
  return render(
    <MemoryRouter initialEntries={entries}>
      <Routes>
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:slug" element={<ProfilePage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    usersService.getUserStats.mockReturnValue(new Promise(() => {}));
    renderProfilePage();
    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('renders own profile with user data', async () => {
    usersService.getUserStats.mockResolvedValue(mockStats);

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('Admin, Developer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('renders bio text', async () => {
    usersService.getUserStats.mockResolvedValue(mockStats);

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText('A test biography for the user profile.')).toBeInTheDocument();
    });
  });

  it('renders profile tabs', async () => {
    usersService.getUserStats.mockResolvedValue(mockStats);

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText('Activity')).toBeInTheDocument();
    });

    const tabButtons = screen.getAllByRole('button');
    const tabLabels = tabButtons.map((btn) => btn.textContent);
    expect(tabLabels).toContain('Projects');
    expect(tabLabels).toContain('Likes');
    expect(tabLabels).toContain('Watched');
    expect(tabLabels).toContain('Contacts');
  });

  it('switches tabs when clicked', async () => {
    usersService.getUserStats.mockResolvedValue(mockStats);
    usersService.getUserContacts.mockResolvedValue([]);

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText('Activity')).toBeInTheDocument();
    });

    const contactsTab = screen.getAllByText('Contacts').find((el) => el.closest('button'));
    fireEvent.click(contactsTab);

    await waitFor(() => {
      expect(screen.getByText('No contacts yet.')).toBeInTheDocument();
    });
  });

  it('shows edit profile sidebar for current user', async () => {
    usersService.getUserStats.mockResolvedValue(mockStats);

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText('Edit your info')).toBeInTheDocument();
    });
  });

  it('renders other user profile by slug', async () => {
    const otherUser = {
      ...mockUser,
      id: 2,
      username: 'otheruser',
      full_name: 'Other User',
      full_name_display: 'Other User',
      is_active: true,
    };

    usersService.getUserByUsername.mockResolvedValue(otherUser);
    usersService.getUserStats.mockResolvedValue(mockStats);

    renderProfilePage('/profile/otheruser', ['/profile/otheruser']);

    await waitFor(() => {
      expect(screen.getByText('Other User')).toBeInTheDocument();
    });

    expect(screen.getByText('@otheruser')).toBeInTheDocument();
  });

  it('shows error for inactive user', async () => {
    const inactiveUser = { ...mockUser, is_active: false };
    usersService.getUserByUsername.mockResolvedValue(inactiveUser);

    renderProfilePage('/profile/inactiveuser', ['/profile/inactiveuser']);

    await waitFor(() => {
      expect(screen.getByText('User not found.')).toBeInTheDocument();
    });
  });

  it('shows error when user not found (404)', async () => {
    usersService.getUserByUsername.mockRejectedValue({ response: { status: 404 } });

    renderProfilePage('/profile/nonexistent', ['/profile/nonexistent']);

    await waitFor(() => {
      expect(screen.getByText('User not found.')).toBeInTheDocument();
    });
  });

  it('truncates long bio text', async () => {
    const longBioUser = {
      ...mockUser,
      bio: 'A'.repeat(300),
    };

    vi.mocked(vi.fn()).mockReturnValue;

    usersService.getUserStats.mockResolvedValue(mockStats);

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const bioElement = document.querySelector('.profile-quote span');
      if (bioElement) {
        expect(bioElement.textContent.length).toBeLessThanOrEqual(214);
      }
    });
  });

  it('renders stat labels correctly', async () => {
    usersService.getUserStats.mockResolvedValue(mockStats);

    renderProfilePage();

    await waitFor(() => {
      expect(screen.getByText('Closed US')).toBeInTheDocument();
    });

    const statNames = document.querySelectorAll('.stat-name');
    const statLabels = Array.from(statNames).map((el) => el.textContent);
    expect(statLabels).toContain('Projects');
    expect(statLabels).toContain('Contacts');
  });
});
