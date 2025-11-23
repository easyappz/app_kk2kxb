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
 * Send friend request
 * @param {number} memberId - Member ID to send request to
 * @returns {Promise} Created friend request data
 */
export const sendFriendRequest = async (memberId) => {
  const response = await instance.post('/api/friends/requests/', 
    { to_member: memberId },
    { headers: getAuthHeaders() }
  );
  return response.data;
};

/**
 * Get friend requests
 * @param {Object} params - Query parameters
 * @param {string} [params.type] - Filter by type (incoming, outgoing)
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getFriendRequests = async (params = {}) => {
  const response = await instance.get('/api/friends/requests/', {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Accept friend request
 * @param {number} requestId - Friend request ID
 * @returns {Promise} Updated friend request data
 */
export const acceptRequest = async (requestId) => {
  const response = await instance.post(`/api/friends/requests/${requestId}/accept/`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Reject friend request
 * @param {number} requestId - Friend request ID
 * @returns {Promise} Updated friend request data
 */
export const rejectRequest = async (requestId) => {
  const response = await instance.post(`/api/friends/requests/${requestId}/decline/`, {}, {
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Get friends list
 * @param {Object} params - Query parameters
 * @param {number} [params.member_id] - Get friends of specific member
 * @param {number} [params.limit] - Limit results
 * @param {number} [params.offset] - Offset results
 * @returns {Promise} Response with count and results
 */
export const getFriends = async (params = {}) => {
  const response = await instance.get('/api/friends/', {
    params,
    headers: getAuthHeaders()
  });
  return response.data;
};

/**
 * Remove friend
 * @param {number} friendId - Friend member ID
 * @returns {Promise} Delete response
 */
export const removeFriend = async (friendId) => {
  const response = await instance.delete(`/api/friends/${friendId}/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};
