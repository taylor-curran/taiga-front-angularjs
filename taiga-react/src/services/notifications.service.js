import api from './api';

export const notificationsService = {
  async getNotifyPolicies() {
    const response = await api.get('/notify-policies');
    return response.data;
  },

  async updateNotifyPolicy(policyId, data) {
    const response = await api.patch(`/notify-policies/${policyId}`, data);
    return response.data;
  },
};
