import api from './axiosInstance';

export const getFeedApi = (page = 1, limit = 10) =>
  api.get(`/posts?page=${page}&limit=${limit}`);

export const createPostApi = (formData) =>
  api.post('/posts', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const updatePostApi = (id, formData) =>
  api.put(`/posts/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deletePostApi = (id) => api.delete(`/posts/${id}`);

export const likePostApi = (id) => api.put(`/posts/${id}/like`);

export const getPostApi = (id) => api.get(`/posts/${id}`);

export const searchPostsApi = (q) => api.get(`/posts/search?q=${encodeURIComponent(q)}`);

export const addCommentApi = (postId, text) =>
  api.post(`/posts/${postId}/comments`, { text });

export const getCommentsApi = (postId) => api.get(`/posts/${postId}/comments`);

export const deleteCommentApi = (commentId) => api.delete(`/comments/${commentId}`);