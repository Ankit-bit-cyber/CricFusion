import api from './axiosInstance';

export const getUserApi = (id) => api.get(`/users/${id}`);

export const updateUserApi = (id, formData) =>
  api.put(`/users/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const followUserApi = (id) => api.put(`/users/${id}/follow`);

export const searchUsersApi = (q) => api.get(`/users/search?q=${encodeURIComponent(q)}`);