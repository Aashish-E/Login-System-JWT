import { useState, useEffect } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

function useAuth() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token')); // Store accessToken
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<void> => {
    try {
      const response = await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.accessToken) { // Check for accessToken instead of token
        const accessToken = data.accessToken;
        setToken(accessToken);
        localStorage.setItem('token', accessToken); // Store accessToken
        setUser(data); // Store full user data including refreshToken
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return { token, user, login, logout };
}

export default useAuth;