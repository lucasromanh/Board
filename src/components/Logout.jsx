import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(`Token a enviar: Bearer ${token}`);
      const response = await api.post('/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log('Cierre de sesión exitoso, limpiando el estado del usuario y eliminando el token');
        dispatch(logoutAction());
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        const data = response.data;
        throw new Error(data.message || 'Cierre de sesión fallido');
      }
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      dispatch(logoutAction());
      localStorage.removeItem('token');
      navigate('/');
      throw new Error(error.response?.data?.message || 'Cierre de sesión fallido');
    }
  };

  return (
    <button onClick={handleLogout}>Cerrar Sesión</button>
  );
};

export default Logout;
