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
 * Get conversations list (dialogs)
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getDialogs = async (params = {}) => {
  const response = await instance.get('/api/messages', {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get messages in conversation
 * @param {number} memberId - Member ID
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getMessages = async (memberId, params = {}) => {
  const response = await instance.get(`/api/messages/${memberId}`, {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Send message
 * @param {Object} data - Message data
 * @param {number} data.recipient - Recipient member ID
 * @param {string} data.content - Message content
 * @returns {Promise} Created message data
 */
export const sendMessage = async (data) => {
  const response = await instance.post('/api/messages', data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Mark messages as read
 * Note: The API spec doesn't have a specific mark as read endpoint,
 * so this is a placeholder that may need adjustment based on actual API
 * @param {number} memberId - Member ID
 * @returns {Promise} Update response
 */
export const markAsRead = async (memberId) => {
  // This endpoint might need to be adjusted based on actual API implementation
  const response = await instance.post(`/api/messages/${memberId}/read`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get unread messages count
 * Note: The API spec doesn't have a specific unread count endpoint,
 * so this is a placeholder that may need adjustment based on actual API
 * @returns {Promise} Unread count data
 */
export const getUnreadCount = async () => {
  // This endpoint might need to be adjusted based on actual API implementation
  // For now, we can get it from the dialogs list
  const dialogs = await getDialogs({ limit: 100 });
  const unreadCount = dialogs.results.reduce((sum, dialog) => sum + (dialog.unread_count || 0), 0);
  return { unread_count: unreadCount };
};
