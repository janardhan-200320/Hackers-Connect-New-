const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || "http://localhost:8000"; // Fallback to localhost if not defined

export async function login(email: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse error message from the server
      throw new Error(errorData.message || `Login failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Expecting { access_token: string }
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
}

export async function register(email: string, password: string, username: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // Try to parse error message from the server
      throw new Error(errorData.message || `Registration failed with status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Expecting { success: boolean, message: string }
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.message || "Registration failed");
  }
}