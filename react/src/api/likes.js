import instance from './axios';

/**
 * Get authorization headers
 * @returns {Object} Headers with authorization token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Add like to post
 * @param {number} postId - Post ID
 * @returns {Promise} Response with likes count
 */
export const addLike = async (postId) => {
  const response = await instance.post(`/api/posts/${postId}/like`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Remove like from post
 * @param {number} postId - Post ID
 * @returns {Promise} Response with likes count
 */
export const removeLike = async (postId) => {
  const response = await instance.post(`/api/posts/${postId}/unlike`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get likes for post
 * @param {number} postId - Post ID
 * @returns {Promise} Post data with likes information
 */
export const getLikes = async (postId) => {
  const response = await instance.get(`/api/posts/${postId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
