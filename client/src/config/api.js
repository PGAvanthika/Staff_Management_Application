// API Configuration
// Use relative URLs so nginx can proxy requests in production
// In development, this will work with the proxy or you can set REACT_APP_API_URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API_URL = API_BASE_URL;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  // Remove leading slash from endpoint if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default API_URL;


