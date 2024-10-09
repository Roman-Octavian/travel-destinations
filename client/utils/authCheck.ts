import { axiosInstance } from './axiosConfig.ts';

export const checkAuth = async () => {
  try {
    const response = await axiosInstance.get('/auth/status');

    if (!response.data.authenticated) {
      // Redirect to login page if not authenticated
      window.location.href = '/login.html';
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
    // Redirect to login on error as a fallback
    window.location.href = '/index.html';
  }
};
