import { useState, useEffect } from 'react';
import api from '../api';
import useAuth from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get(`/usuarios/${user.UsuarioID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data.usuario);
      } catch (error) {
        setError('Error al obtener los datos del perfil.');
      }
    };
    fetchUser();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const profileData = { ...profile };
      delete profileData.CorreoElectronico;  // Asegurarse de eliminar el campo de correo electrónico si existe
      const response = await api.put(`/usuarios/${user.UsuarioID}`, profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        navigate(`/profile/${user.UsuarioID}`);
      } else {
        setError('Error al actualizar el perfil.');
      }
    } catch (error) {
      setError('Error al actualizar el perfil.');
    }
  };

  if (!profile) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="box">
        <h1 className="title">Editar Perfil</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <div className="field">
          <label className="label">Nombre</label>
          <div className="control">
            <input className="input" type="text" name="Nombre" value={profile.Nombre} onChange={handleInputChange} />
          </div>
        </div>
        <div className="field">
          <label className="label">Apellido</label>
          <div className="control">
            <input className="input" type="text" name="Apellido" value={profile.Apellido} onChange={handleInputChange} />
          </div>
        </div>
        <div className="field">
          <label className="label">Teléfono</label>
          <div className="control">
            <input className="input" type="text" name="Telefono" value={profile.Telefono || ''} onChange={handleInputChange} />
          </div>
        </div>
        <div className="buttons">
          <button className="button is-primary" onClick={handleSave}>Guardar</button>
          <button className="button" onClick={() => navigate(`/profile/${user.UsuarioID}`)}>Cancelar</button>
          <button className="button is-link" onClick={() => navigate('/board')}>Volver al Tablero</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
