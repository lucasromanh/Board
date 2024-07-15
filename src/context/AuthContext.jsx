import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await api.post('/validate-token', { token });
        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const register = useCallback(async (formData) => {
    try {
      const response = await api.post('/register', formData);
      const data = response.data;
      if (response.status === 200 || response.status === 201) {
        setUser({ ...data.user, id: data.user.UsuarioID });
        localStorage.setItem('token', data.token);
      } else {
        throw new Error(data.message || 'Registro fallido');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw new Error(error.response?.data?.message || 'Registro fallido');
    }
  }, []);

  const login = useCallback(async (formData) => {
    console.log('Enviando solicitud de inicio de sesión con datos del formulario:', formData);
    try {
      const response = await api.post('/login', formData);
      console.log('Respuesta recibida de la solicitud de inicio de sesión:', response);
      const data = response.data;
      console.log('Datos de la respuesta:', data);
  
      if (response.status === 200) {
        if (!data.user?.defaultBoardId) {
          throw new Error('defaultBoardId falta en los datos del usuario');
        }
        console.log('Datos del usuario válidos, estableciendo el estado del usuario y guardando el token');
        setUser({ ...data.user, id: data.user.UsuarioID });
        localStorage.setItem('token', data.token);
        navigate('/board');
        return data.user;
      } else {
        throw new Error(data.message || 'Inicio de sesión fallido');
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      throw new Error(error.response?.data?.message || 'Inicio de sesión fallido');
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Token a enviar: Bearer ${token}`);
      const response = await api.post('/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        console.log('Cierre de sesión exitoso, limpiando el estado del usuario y eliminando el token');
        setUser(null);
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const data = response.data;
        throw new Error(data.message || 'Cierre de sesión fallido');
      }
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      throw new Error(error.response?.data?.message || 'Cierre de sesión fallido');
    }
  }, [navigate]);

  const refreshToken = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/refresh-token', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('token', data.token);
        return data.token;
      } else {
        throw new Error('Fallo al refrescar el token');
      }
    } catch (error) {
      console.error('Error al refrescar el token:', error);
      logout();
      throw error;
    }
  }, [logout]);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshToken();
    }, 15 * 60 * 1000); // Refrescar cada 15 minutos
    return () => clearInterval(interval);
  }, [refreshToken]);

  const value = useMemo(() => ({
    user,
    register,
    login,
    logout,
    refreshToken,
  }), [user, register, login, logout, refreshToken]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
