// api/amadeusInstance.js
import axios from 'axios';

const amadeusInstance = axios.create({
  baseURL: 'https://test.api.amadeus.com/v1',
  timeout: 30000,
});

// Function to get Amadeus token
let amadeusToken = null;
let tokenExpiry = null;

const getAmadeusToken = async () => {
  // Check if token is still valid (with 5 minute buffer)
  if (amadeusToken && tokenExpiry && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return amadeusToken;
  }
  
  try {
    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.REACT_APP_AMADEUS_CLIENT_ID,
        client_secret: process.env.REACT_APP_AMADEUS_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    amadeusToken = response.data.access_token;
    // Token expires in 1799 seconds (about 30 minutes)
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    
    console.log('Amadeus token obtained successfully');
    return amadeusToken;
  } catch (error) {
    console.error('Error getting Amadeus token:', error.response?.data || error.message);
    throw error;
  }
};

// Interceptor to add Amadeus token
amadeusInstance.interceptors.request.use(
  async (config) => {
    const token = await getAmadeusToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default amadeusInstance;