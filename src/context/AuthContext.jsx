import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const register = async (formData) => {
    const response = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data.user); 
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  };

  const login = async (formData) => {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    console.log('Response data:', data); 
    if (response.ok) {
      if (!data.user?.defaultBoardId) {
        throw new Error('defaultBoardId is missing in user data');
      }
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data.user;  
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const refreshToken = useCallback(async () => {
    const response = await fetch('http://localhost:5000/api/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data.token;
    } else {
      throw new Error(data.message || 'Token refresh failed');
    }
  }, [token]);

  const logout = async () => {
    const token = localStorage.getItem('token');
    console.log(`Token to be sent: Bearer ${token}`); 
    const response = await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
    } else {
      const data = await response.json();
      throw new Error(data.message || 'Logout failed');
    }
  };

  const value = useMemo(() => ({
    user,
    token,
    register,
    login,
    logout,
    refreshToken,
  }), [user, token, refreshToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
