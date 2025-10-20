import { API_BASE_URL } from '../config';
import { getAuthToken } from '../utils/auth';

export const getScoreboard = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/scoreboard`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include token if authentication is required
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching scoreboard:', error);
    throw error;
  }
};