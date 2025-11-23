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
 * Get comments for post
 * @param {number} postId - Post ID
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getComments = async (postId, params = {}) => {
  const response = await instance.get(`/api/posts/${postId}/comments/`, {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Add comment to post
 * @param {number} postId - Post ID
 * @param {Object} data - Comment data
 * @param {string} data.content - Comment content
 * @returns {Promise} Created comment data
 */
export const addComment = async (postId, data) => {
  const response = await instance.post(`/api/posts/${postId}/comments/`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Delete comment
 * Note: The API spec doesn't have a specific delete comment endpoint,
 * so this is a placeholder that may need adjustment based on actual API
 * @param {number} postId - Post ID
 * @param {number} commentId - Comment ID
 * @returns {Promise} Delete response
 */
export const deleteComment = async (postId, commentId) => {
  // This endpoint might need to be adjusted based on actual API implementation
  const response = await instance.delete(`/api/posts/${postId}/comments/${commentId}/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
