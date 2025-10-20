const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:5000";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: 'login', email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Login failed with status: ${response.status}`);
    }
    
    return data; // Expecting { access_token: string, success: boolean }
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
};


export const register = async (email: string, password: string, username: string, fullName: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action: 'register', email, password, username, fullName }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Registration failed with status: ${response.status}`);
    }
    
    return data; // Expecting { success: boolean, message: string }
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Registration failed");
  }
};