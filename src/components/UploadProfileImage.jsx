import { useState } from 'react';
import PropTypes from 'prop-types';
import api from '../api';
import useAuth from '../context/useAuth';

const UploadProfileImage = ({ onClose }) => {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Por favor seleccione un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      const token = localStorage.getItem('token');
      const response = await api.post(`/usuarios/${user.UsuarioID}/imagen`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        onClose();
      } else {
        setError('Error al subir la imagen.');
      }
    } catch (error) {
      setError('Error al subir la imagen.');
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h1 className="title">Subir Imagen de Perfil</h1>
          {error && <div className="notification is-danger">{error}</div>}
          <div className="field">
            <label className="label">Seleccione una imagen</label>
            <div className="control">
              <input className="input" type="file" onChange={handleFileChange} />
            </div>
          </div>
          <div className="buttons">
            <button className="button is-primary" onClick={handleUpload}>Subir</button>
            <button className="button" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

UploadProfileImage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default UploadProfileImage;
