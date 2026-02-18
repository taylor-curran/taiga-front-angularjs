import api from './api';

export const usersService = {
  async getUserByUsername(username) {
    const response = await api.get(`/users/by_username`, { params: { username } });
    return response.data;
  },

  async getUserById(userId) {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  async getUserStats(userId) {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  },

  async getUserContacts(userId) {
    const response = await api.get(`/users/${userId}/contacts`);
    return response.data;
  },

  async updateUser(userId, data) {
    const response = await api.patch(`/users/${userId}`, data);
    return response.data;
  },

  async changeAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await api.post('/users/change_avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async removeAvatar() {
    const response = await api.post('/users/remove_avatar');
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.post('/users/change_password', {
      current_password: currentPassword,
      password: newPassword,
    });
    return response.data;
  },

  async deleteAccount() {
    const response = await api.post('/users/cancel');
    return response.data;
  },

  async exportProfile() {
    const response = await api.get('/users/me/export');
    return response.data;
  },

  async sendVerificationEmail() {
    const response = await api.post('/users/send_verification_email');
    return response.data;
  },
};
