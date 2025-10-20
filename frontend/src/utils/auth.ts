const AUTH_TOKEN_KEY = import.meta.env.REACT_APP_LOCAL_STORAGE_KEY || 'authToken';

export function storeAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Could not store auth token", error);
  }
}

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Could not retrieve auth token", error);
    return null;
  }
}

export function removeAuthToken(): void {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Could not remove auth token", error);
  }
}