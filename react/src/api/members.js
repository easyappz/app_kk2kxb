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
 * Get list of members
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getMembers = async (params = {}) => {
  const response = await instance.get('/api/members/', {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get member by ID
 * @param {number} id - Member ID
 * @returns {Promise} Member data
 */
export const getMember = async (id) => {
  const response = await instance.get(`/api/members/${id}/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get current user profile
 * @returns {Promise} Current member data
 */
export const getCurrentMember = async () => {
  const response = await instance.get('/api/members/me/', {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Update member profile
 * @param {number} id - Member ID
 * @param {Object} data - Update data
 * @param {string} [data.first_name] - First name
 * @param {string} [data.last_name] - Last name
 * @param {string} [data.bio] - Bio
 * @param {string} [data.avatar] - Avatar URL
 * @param {string} [data.cover_image] - Cover image URL
 * @returns {Promise} Updated member data
 */
export const updateMember = async (id, data) => {
  const response = await instance.put(`/api/members/${id}/`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Search members
 * @param {string} query - Search query
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const searchMembers = async (query, params = {}) => {
  const response = await instance.get('/api/members/search/', {
    params: { q: query, ...params },
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get member online status
 * @param {number} id - Member ID
 * @returns {Promise} Online status data
 */
export const getOnlineStatus = async (id) => {
  const response = await instance.get(`/api/members/${id}/online-status/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get user settings
 * @returns {Promise} Settings data
 */
export const getSettings = async () => {
  const response = await instance.get('/api/members/me/settings/', {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Update user settings
 * @param {Object} data - Settings data
 * @param {string} [data.email] - Email
 * @param {boolean} [data.notifications_enabled] - Notifications enabled
 * @param {string} [data.privacy_level] - Privacy level (public, friends, private)
 * @param {string} [data.password] - New password
 * @returns {Promise} Update response
 */
export const updateSettings = async (data) => {
  const response = await instance.put('/api/members/me/settings/', data, {
    headers: getAuthHeaders()
  });
  return response.data;
};
