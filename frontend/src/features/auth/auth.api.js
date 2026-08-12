import apiClient from '../../services/apiClient';

export const authApi = {
  register: async (data) => {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },
  checkUsername: async (username) => {
    const response = await apiClient.get(`/api/auth/check-username?username=${username}`);
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await apiClient.put('/api/auth/profile', data);
    return response.data;
  }
};
