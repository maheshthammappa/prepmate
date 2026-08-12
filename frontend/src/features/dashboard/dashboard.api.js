import apiClient from '../../services/apiClient';

export const dashboardApi = {
  getInterviewHistory: async () => {
    const response = await apiClient.get('/api/interview/history');
    return response.data;
  }
};
