import api from './api';

export const projectsService = {
  async getProject(projectId) {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
  },

  async getProjectBySlug(slug) {
    const response = await api.get(`/projects/by_slug`, { params: { slug } });
    return response.data;
  },

  async getMemberStats(projectId) {
    const response = await api.get(`/projects/${projectId}/member_stats`);
    return response.data;
  },

  async leaveProject(projectId) {
    const response = await api.post(`/projects/${projectId}/leave`);
    return response.data;
  },
};
