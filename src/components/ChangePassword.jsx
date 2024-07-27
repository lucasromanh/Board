import { useState } from 'react';
import api from '../api';
import useAuth from '../context/useAuth';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (newPassword !== confirmPassword) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await api.put(`/usuarios/${user.UsuarioID}/password`, {
        oldPassword: oldPassword,
        newPassword: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        navigate(`/profile/${user.UsuarioID}`);
      } else {
        setError('Error al actualizar la contraseña.');
      }
    } catch (error) {
      setError('Error al actualizar la contraseña.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="box">
        <h1 className="title">Cambiar Contraseña</h1>
        {error && <div className="notification is-danger">{error}</div>}
        <div className="field">
          <label className="label">Contraseña Antigua</label>
          <div className="control">
            <input className="input" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="label">Nueva Contraseña</label>
          <div className="control">
            <input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label className="label">Confirmar Nueva Contraseña</label>
          <div className="control">
            <input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
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

export default ChangePassword;
