import api from './axiosInstance';

export const getLiveMatchesApi = () => api.get('/matches/live');
export const getMatchApi = (id) => api.get(`/matches/${id}`);
export const getDiscussionApi = (id) => api.get(`/matches/${id}/discussion`);
export const postDiscussionApi = (id, message) =>
  api.post(`/matches/${id}/discussion`, { message });