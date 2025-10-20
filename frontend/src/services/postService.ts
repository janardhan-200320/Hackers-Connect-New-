import { API_BASE_URL } from '../config'; // Assuming you have a config file
import { getAuthToken } from '../utils/auth'; // Assuming you have a utility function to get the token

export const getPosts = async () => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const createPost = async (content: string) => {
  const token = getAuthToken();
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};