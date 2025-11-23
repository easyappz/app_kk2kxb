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
 * Create repost of a post
 * @param {number} postId - Post ID to repost
 * @param {Object} data - Repost data
 * @param {string} [data.content] - Additional content for repost
 * @returns {Promise} Created repost data
 */
export const createRepost = async (postId, data = {}) => {
  const response = await instance.post(`/api/posts/${postId}/repost/`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};
