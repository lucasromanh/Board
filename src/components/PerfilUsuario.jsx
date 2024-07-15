import { useState, useEffect } from 'react';
import api from '../api';
import useAuth from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import 'bulma/css/bulma.min.css';
import UploadProfileImage from './UploadProfileImage';

const PerfilUsuario = () => {
  const { user, refreshToken, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!user || !user.UsuarioID) {
        setError('No se proporcionó un ID de usuario válido.');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No se encontró el token en localStorage');
          return;
        }

        const response = await api.get(`/usuarios/${user.UsuarioID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setProfile(response.data.usuario);
        } else {
          setError(`Error al obtener el usuario: ${response.statusText}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          try {
            const newToken = await refreshToken();
            const response = await api.get(`/usuarios/${user.UsuarioID}`, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            if (response.status === 200) {
              setProfile(response.data.usuario);
            } else {
              setError(`Error al obtener el usuario después de refrescar el token: ${response.statusText}`);
            }
          } catch (refreshError) {
            setError(`Error al refrescar el token: ${refreshError.message}`);
          }
        } else {
          setError(`Error de red al obtener el usuario: ${error.message}`);
        }
      }
    };

    fetchUser();
  }, [user, refreshToken]);

  const handleEditProfile = () => {
    navigate(`/edit-profile/${user.UsuarioID}`);
  };

  const handleChangePassword = () => {
    navigate(`/change-password/${user.UsuarioID}`);
  };

  const handleAddProfileImage = () => {
    setUploadModalOpen(true);
  };

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No se encontró el token en localStorage');
        return;
      }

      const response = await api.delete(`/usuarios/${user.UsuarioID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        logout();
        navigate('/register');
      } else {
        setError(`Error al eliminar el perfil: ${response.statusText}`);
      }
    } catch (error) {
      setError(`Error al eliminar el perfil: ${error.message}`);
    }
  };

  if (error) {
    return <div className="notification is-danger">{error}</div>;
  }

  if (!profile) {
    return <div className="notification is-info">Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <button className="button is-info" onClick={() => navigate('/board')} style={{ position: 'absolute', top: '10px', right: '10px' }}>
        Volver al Tablero
      </button>
      <div className="box" style={{ marginTop: '50px' }}>
        <h1 className="title">Perfil de Usuario</h1>
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input className="input" type="text" value={profile.Nombre} readOnly />
          </div>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <div className="control">
            <input className="input" type="email" value={profile.CorreoElectronico} readOnly />
          </div>
        </div>
        {/* Más campos del perfil */}
        <div className="buttons mt-3">
          <button className="button is-primary" onClick={handleEditProfile}>
            Editar Perfil
          </button>
          <button className="button is-link" onClick={handleAddProfileImage}>
            Agregar Imagen de Perfil
          </button>
          <button className="button is-warning" onClick={handleChangePassword}>
            Cambiar Contraseña
          </button>
          <button className="button is-danger" onClick={handleDeleteProfile}>
            Eliminar Perfil
          </button>
        </div>
      </div>
      {isUploadModalOpen && <UploadProfileImage onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
};

export default PerfilUsuario;
