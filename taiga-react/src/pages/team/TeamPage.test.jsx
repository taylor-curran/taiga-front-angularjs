import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TeamPage from './TeamPage';

const mockProject = {
  id: 1,
  name: 'Test Project',
  slug: 'test-project',
  is_issues_activated: true,
  is_kanban_activated: true,
  is_backlog_activated: false,
  is_wiki_activated: true,
  owner: { id: 10 },
  members: [
    { id: 10, username: 'owner', full_name_display: 'Project Owner', role: 1, role_name: 'Admin', is_active: true, photo: null },
    { id: 20, username: 'member1', full_name_display: 'Team Member 1', role: 2, role_name: 'Developer', is_active: true, photo: null },
    { id: 30, username: 'member2', full_name_display: 'Team Member 2', role: 2, role_name: 'Developer', is_active: true, photo: null },
    { id: 40, username: 'inactive', full_name_display: 'Inactive User', role: 2, role_name: 'Developer', is_active: false, photo: null },
  ],
  roles: [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'Developer' },
    { id: 3, name: 'Designer' },
  ],
};

const mockMemberStats = {
  closed_bugs: { 10: 5, 20: 3, 30: 1 },
  iocaine_tasks: { 10: 2, 20: 4, 30: 0 },
  wiki_changes: { 10: 10, 20: 1, 30: 5 },
  created_bugs: { 10: 3, 20: 2, 30: 7 },
  closed_tasks: { 10: 8, 20: 6, 30: 4 },
};

vi.mock('../../services/projects.service', () => ({
  projectsService: {
    getProjectBySlug: vi.fn(),
    getMemberStats: vi.fn(),
    leaveProject: vi.fn(),
  },
}));

vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 10, username: 'owner' },
    isAuthenticated: true,
    loading: false,
  }),
}));

import { projectsService } from '../../services/projects.service';

const renderTeamPage = (slug = 'test-project') => {
  return render(
    <MemoryRouter initialEntries={[`/project/${slug}/team`]}>
      <Routes>
        <Route path="/project/:pslug/team" element={<TeamPage />} />
      </Routes>
    </MemoryRouter>
  );
};

describe('TeamPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    projectsService.getProjectBySlug.mockReturnValue(new Promise(() => {}));
    renderTeamPage();
    expect(screen.getByText('Loading team...')).toBeInTheDocument();
  });

  it('renders team page with project name and members', async () => {
    projectsService.getProjectBySlug.mockResolvedValue(mockProject);
    projectsService.getMemberStats.mockResolvedValue(mockMemberStats);

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Test Project - Team')).toBeInTheDocument();
    });

    expect(screen.getByText('Project Owner')).toBeInTheDocument();
    expect(screen.getByText('Team Member 1')).toBeInTheDocument();
    expect(screen.getByText('Team Member 2')).toBeInTheDocument();
    expect(screen.queryByText('Inactive User')).not.toBeInTheDocument();
  });

  it('renders role filters from project roles', async () => {
    projectsService.getProjectBySlug.mockResolvedValue(mockProject);
    projectsService.getMemberStats.mockResolvedValue(mockMemberStats);

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
    });

    const filterItems = document.querySelectorAll('.team-filters .title');
    const filterLabels = Array.from(filterItems).map((el) => el.textContent);
    expect(filterLabels).toContain('Admin');
    expect(filterLabels).toContain('Developer');
    expect(filterLabels).not.toContain('Designer');
  });

  it('filters members by role when a role filter is clicked', async () => {
    projectsService.getProjectBySlug.mockResolvedValue(mockProject);
    projectsService.getMemberStats.mockResolvedValue(mockMemberStats);

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Team Member 1')).toBeInTheDocument();
    });

    const developerFilter = screen.getAllByText('Developer')[0];
    fireEvent.click(developerFilter);

    expect(screen.getByText('Team Member 1')).toBeInTheDocument();
    expect(screen.getByText('Team Member 2')).toBeInTheDocument();
  });

  it('filters members by search query', async () => {
    projectsService.getProjectBySlug.mockResolvedValue(mockProject);
    projectsService.getMemberStats.mockResolvedValue(mockMemberStats);

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Team Member 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search members...');
    fireEvent.change(searchInput, { target: { value: 'Member 1' } });

    expect(screen.getByText('Team Member 1')).toBeInTheDocument();
    expect(screen.queryByText('Team Member 2')).not.toBeInTheDocument();
  });

  it('renders error message on API failure', async () => {
    projectsService.getProjectBySlug.mockRejectedValue(new Error('Network error'));

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Failed to load team data. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows current user section with leave button for non-owners', async () => {
    const nonOwnerProject = {
      ...mockProject,
      owner: { id: 999 },
    };
    projectsService.getProjectBySlug.mockResolvedValue(nonOwnerProject);
    projectsService.getMemberStats.mockResolvedValue(mockMemberStats);

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Leave project')).toBeInTheDocument();
    });
  });

  it('does not show leave button for project owner', async () => {
    projectsService.getProjectBySlug.mockResolvedValue(mockProject);
    projectsService.getMemberStats.mockResolvedValue(mockMemberStats);

    renderTeamPage();

    await waitFor(() => {
      expect(screen.getByText('Project Owner')).toBeInTheDocument();
    });

    expect(screen.queryByText('Leave project')).not.toBeInTheDocument();
  });
});
