import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${API_URL}/analytics`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
