import instance from './axios';

/**
 * Register new user
 * @param {Object} data - Registration data
 * @param {string} data.username - Username
 * @param {string} data.email - Email
 * @param {string} data.password - Password
 * @param {string} data.password_confirm - Password confirmation
 * @param {string} [data.first_name] - First name
 * @param {string} [data.last_name] - Last name
 * @returns {Promise} Response with member, access and refresh tokens
 */
export const register = async (data) => {
  const response = await instance.post('/api/auth/register/', data);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise} Response with member, access and refresh tokens
 */
export const login = async (credentials) => {
  const response = await instance.post('/api/auth/login/', credentials);
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
  }
  return response.data;
};

/**
 * Logout user
 * Clears tokens from localStorage
 */
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

/**
 * Refresh access token
 * @returns {Promise} Response with new access token
 */
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) {
    throw new Error('No refresh token available');
  }
  const response = await instance.post('/api/auth/refresh/', { refresh });
  if (response.data.access) {
    localStorage.setItem('access_token', response.data.access);
  }
  return response.data;
};
