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
 * Get subscriptions
 * @param {Object} params - Query parameters
 * @param {string} [params.type] - Filter by type (my_subscriptions, my_subscribers)
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getSubscriptions = async (params = {}) => {
  const response = await instance.get('/api/friends/subscriptions', {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Subscribe to member
 * @param {number} memberId - Member ID to subscribe to
 * @returns {Promise} Created subscription data
 */
export const subscribeToMember = async (memberId) => {
  const response = await instance.post(`/api/friends/subscriptions/${memberId}`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Unsubscribe from member
 * @param {number} memberId - Member ID to unsubscribe from
 * @returns {Promise} Delete response
 */
export const unsubscribeFromMember = async (memberId) => {
  const response = await instance.delete(`/api/friends/subscriptions/${memberId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
