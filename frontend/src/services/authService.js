import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  async login(email, password) {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await axios.get(`${API_URL}/me`);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  },

  getToken() {
    return localStorage.getItem('token');
  },

  setAuthHeader(token) {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }
};

export default authService;
