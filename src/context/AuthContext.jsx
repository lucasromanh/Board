import { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const register = async (formData) => {
    try {
      const response = await api.post('/register', formData);
      const data = response.data;
      if (response.status === 200) {
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Registro fallido');
      }
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw new Error(error.response?.data?.message || 'Registro fallido');
    }
  };

  const login = async (formData) => {
    console.log('Enviando solicitud de inicio de sesión con datos del formulario:', formData);
    return api.post('/login', formData)
      .then((response) => {
        console.log('Respuesta recibida de la solicitud de inicio de sesión:', response);
        const data = response.data;
        console.log('Datos de la respuesta:', data);
        
        if (response.status === 200) {
          if (!data.user?.defaultBoardId) {
            throw new Error('defaultBoardId falta en los datos del usuario');
          }
          console.log('Datos del usuario válidos, estableciendo el estado del usuario y guardando el token');
          setUser(data.user);
          localStorage.setItem('token', data.token);
          return data.user;
        } else {
          throw new Error(data.message || 'Inicio de sesión fallido');
        }
      })
      .catch((error) => {
        console.error('Error durante el inicio de sesión:', error);
        throw new Error(error.response?.data?.message || 'Inicio de sesión fallido');
      });
  };

  const refreshToken = async () => {
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
      throw error;
    }
  };

  const logout = async () => {
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
      } else {
        const data = response.data;
        throw new Error(data.message || 'Cierre de sesión fallido');
      }
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      throw new Error(error.response?.data?.message || 'Cierre de sesión fallido');
    }
  };

  const value = useMemo(() => ({
    user,
    register,
    login,
    logout,
    refreshToken,
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

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
