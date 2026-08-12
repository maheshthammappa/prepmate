import apiClient from '../../services/apiClient';

export const interviewApi = {
  generateQuestions: async (data) => {
    const response = await apiClient.post('/api/interview/generate', data);
    return response.data;
  },
  generatePracticeQuestions: async () => {
    const response = await apiClient.post('/api/interview/practice-generate');
    return response.data;
  },
  getMasteredQuestions: async (params) => {
    const response = await apiClient.get('/api/interview/mastered-questions', { params });
    return response.data;
  },
  generateFromResume: async (formData) => {
    const response = await apiClient.post('/api/interview/generate-from-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  evaluate: async (data) => {
    const response = await apiClient.post('/api/interview/evaluate', data);
    return response.data;
  },
  askDoubt: async (question) => {
    const response = await apiClient.post('/api/interview/ask-doubt', { question });
    return response.data;
  },
  getHistoryDetails: async (id) => {
    const response = await apiClient.get(`/api/interview/history/${id}`);
    return response.data;
  },
  transcribeAudio: async (formData) => {
    const response = await apiClient.post('/api/interview/transcribe', formData, {
      headers: {
        'Content-Type': undefined
      }
    });
    return response.data;
  }
};
