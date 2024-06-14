import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const PerfilUsuario = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/usuarios/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    };

    fetchUser();
  }, [userId]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>Nombre: {user.name}</p>
      <p>Email: {user.email}</p>
      {/* Más campos del perfil */}
    </div>
  );
};

export default PerfilUsuario;
