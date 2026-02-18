import api from './api';

export const localesService = {
  async getLocales() {
    const response = await api.get('/locales');
    return response.data;
  },
};
