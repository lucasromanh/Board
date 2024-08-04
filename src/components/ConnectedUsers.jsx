import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import 'bulma/css/bulma.min.css';

const ConnectedUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConnectedUsers();
  }, []);

  const fetchConnectedUsers = async () => {
    try {
      const response = await api.get('/usuarios/conectados');
      if (Array.isArray(response.data.usuarios)) {
        setUsers(response.data.usuarios);
      } else {
        setUsers([]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching connected users:', error);
      setError('Error fetching connected users');
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h2 className="title is-2">Usuarios Conectados</h2>
      <Link to="/board" className="button is-link">Volver al Tablero</Link>
      <div className="box">
        <h3 className="title is-3">Lista de Usuarios</h3>
        {users.length === 0 ? (
          <p>No hay usuarios conectados.</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li key={user.UsuarioID} className="columns is-vcentered">
                <div className="column is-four-fifths">
                  {user.Nombre} {user.Apellido} - {user.CorreoElectronico}
                </div>
                <div className="column">
                  <span className={`tag is-${user.conectado ? 'success' : 'danger'}`}>
                    {user.conectado ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConnectedUsers;
