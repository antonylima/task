// Configuration file for the app
import { Platform } from 'react-native';

// Get the local IP for development
const getLocalIP = () => {
  // For mobile device testing, use the computer's IP address
  // Update this IP address to match your computer's local IP
  const LOCAL_IP = '192.168.3.109'; // Your computer's IP address
  
  if (__DEV__) {
    // Use localhost for web development, IP for mobile
    return Platform.OS === 'web' 
      ? 'http://localhost:3000/api' 
      : `http://${LOCAL_IP}:3000/api`;
  }
  
  // Production API URL
  return 'https://your-production-api.com/api';
};

export const Config = {
  // Backend API URL - automatically detects platform
  API_BASE_URL: getLocalIP(),
  
  // App constants
  APP_NAME: 'Task Manager',
  VERSION: '1.0.0',
  
  // API timeouts
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Network utilities
export const getApiUrl = (endpoint: string): string => {
  return `${Config.API_BASE_URL}${endpoint}`;
};

// Debug function to check current API URL
export const debugApiUrl = () => {
  console.log('Platform:', Platform.OS);
  console.log('API Base URL:', Config.API_BASE_URL);
  console.log('__DEV__:', __DEV__);
};