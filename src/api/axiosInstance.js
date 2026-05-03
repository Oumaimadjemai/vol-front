// api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080',  // Your gateway URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Track if refresh is already in progress
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur pour ajouter le token aux requêtes
axiosInstance.interceptors.request.use(
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    console.log('Making request to:', config.url);
    console.log('Token exists:', !!token);
    
    console.log('Making request to:', config.url);
    console.log('Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set');
    } else {
      console.warn('No access token found in localStorage');
      console.log('Authorization header set');
    } else {
      console.warn('No access token found in localStorage');
    }
    
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour rafraîchir le token en cas d'expiration
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    console.log('Response error:', error.response?.status, error.config?.url);
    
    // Check if it's a 401 error and we haven't retried yet
    // Skip refresh for auth endpoints to avoid loops
    const isAuthEndpoint = originalRequest.url?.includes('/auth/') || 
                          originalRequest.url?.includes('/login') ||
                          originalRequest.url?.includes('/register') ||
                          originalRequest.url?.includes('/refresh');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        console.log('No refresh token available - user is not authenticated');
        isRefreshing = false;
        // Clear storage and redirect
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        console.log('Attempting to refresh token...');
        
        const response = await axios.post('http://localhost:8080/auth-service/auth/refresh/', {
          refresh: refreshToken
        });
        
        console.log('Token refreshed successfully');
        
        if (response.data.access) {
          const newToken = response.data.access;
          localStorage.setItem('access_token', newToken);
          
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          // Process queued requests
          processQueue(null, newToken);
          
          // Retry the original request
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        processQueue(refreshError, null);
        // Clear storage and redirect to login
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return !!token;
};

// Helper function to logout
export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  window.location.href = '/login';
};

export default axiosInstance;