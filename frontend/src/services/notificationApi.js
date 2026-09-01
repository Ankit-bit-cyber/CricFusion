import api from './axiosInstance';

export const getNotificationsApi = () => api.get('/notifications');
export const getUnreadCountApi = () => api.get('/notifications/unread-count');
export const markReadApi = (id) => api.put(`/notifications/${id}/read`);
export const markAllReadApi = () => api.put('/notifications/read-all');