import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link de react-router-dom
import api from '../api';
import 'bulma/css/bulma.min.css';
import './Invitations.css'; 

const Invitations = () => {
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchInvitations();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post('/validate-token', { token });
      if (response.status === 200) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Error validating token:', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await api.get('/invitaciones');
      setInvitations(response.data.invitaciones);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleSendInvitation = async () => {
    try {
      const response = await api.post('/usuarios/id', { email });
      const UsuarioDestinoID = response.data.UsuarioID;
      
      await api.post('/invitaciones', { 
        UsuarioOrigenID: user.UsuarioID,  
        UsuarioDestinoID,
        Estado: 'pendiente'  
      });
      alert('Invitation sent successfully');
      fetchInvitations();
      setEmail('');
    } catch (error) {
      console.error('Error sending invitation:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteInvitation = async (id) => {
    try {
      await api.delete(`/invitaciones/${id}`);
      alert('Invitation deleted successfully');
      fetchInvitations();
    } catch (error) {
      console.error('Error deleting invitation:', error);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Gestionar invitaciones</h2>
      <div className="field has-addons">
        <div className="control is-expanded">
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enviar invitacion al mail de..."
          />
        </div>
        <div className="control">
          <button className="button is-primary" onClick={handleSendInvitation}>
            Enviar invitacion
          </button>
        </div>
      </div>
      <div className="box">
        <h3 className="title is-3">Invitaciones enviadas</h3>
        {invitations.length === 0 ? (
          <p>No hay invitaciones enviadas.</p>
        ) : (
          <ul>
            {invitations.map((invitation) => (
              <li key={invitation.InvitacionID} className="columns is-vcentered">
                <div className="column is-four-fifths">
                  {invitation.email} {/* Mostrar el correo electrónico en lugar del ID */}
                </div>
                <div className="column">
                  <button
                    className="button is-danger is-small"
                    onClick={() => handleDeleteInvitation(invitation.InvitacionID)}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link to="/board" className="button is-link mt-4">Volver al tablero</Link> 
    </div>
  );
};

export default Invitations;
