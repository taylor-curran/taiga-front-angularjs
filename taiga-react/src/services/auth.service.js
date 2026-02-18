import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth', {
      type: 'normal',
      username,
      password,
    });
    const { auth_token, ...userData } = response.data;
    localStorage.setItem('token', auth_token);
    localStorage.setItem('user', JSON.stringify(userData));
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  },
};
