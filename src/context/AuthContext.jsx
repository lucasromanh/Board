import { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
      setUser(data.user); // Actualiza el estado del usuario si es necesario
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
    if (response.ok) {
      setUser(data.user);
      localStorage.setItem('token', data.token);
    } else {
      throw new Error(data.message || 'Login failed');
    }
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    console.log(`Token to be sent: Bearer ${token}`); // Agregar log para verificar el token
    const response = await fetch('http://localhost:5000/api/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      setUser(null);
      localStorage.removeItem('token');
    } else {
      const data = await response.json();
      throw new Error(data.message || 'Logout failed');
    }
  };

  const value = useMemo(() => ({
    user,
    register,
    login,
    logout,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
