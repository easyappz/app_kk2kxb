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
 * Subscribe to member
 * @param {number} memberId - Member ID to subscribe to
 * @returns {Promise} Created subscription data
 */
export const subscribe = async (memberId) => {
  const response = await instance.post(`/api/subscriptions/${memberId}`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Unsubscribe from member
 * @param {number} memberId - Member ID to unsubscribe from
 * @returns {Promise} Delete response
 */
export const unsubscribe = async (memberId) => {
  const response = await instance.delete(`/api/subscriptions/${memberId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get following list (my subscriptions)
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getFollowing = async (params = {}) => {
  const response = await instance.get('/api/subscriptions', {
    params: { type: 'my_subscriptions', ...params },
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get followers list (my subscribers)
 * @param {Object} params - Query parameters
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getFollowers = async (params = {}) => {
  const response = await instance.get('/api/subscriptions', {
    params: { type: 'my_subscribers', ...params },
    headers: getAuthHeaders()
  });
  return response.data;
};
