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
 * Get posts feed
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @param {number} [params.author] - Filter by author ID
 * @returns {Promise} Response with count and results
 */
export const getPosts = async (params = {}) => {
  const response = await instance.get('/api/posts', {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get post by ID
 * @param {number} id - Post ID
 * @returns {Promise} Post data
 */
export const getPost = async (id) => {
  const response = await instance.get(`/api/posts/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Create new post
 * @param {Object} data - Post data
 * @param {string} [data.content] - Post content
 * @param {Array<string>} [data.images] - Image URLs
 * @param {Array<string>} [data.videos] - Video URLs
 * @returns {Promise} Created post data
 */
export const createPost = async (data) => {
  const response = await instance.post('/api/posts', data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Update post
 * @param {number} id - Post ID
 * @param {Object} data - Update data
 * @param {string} data.content - Post content
 * @returns {Promise} Updated post data
 */
export const updatePost = async (id, data) => {
  const response = await instance.put(`/api/posts/${id}`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Delete post
 * @param {number} id - Post ID
 * @returns {Promise} Delete response
 */
export const deletePost = async (id) => {
  const response = await instance.delete(`/api/posts/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
