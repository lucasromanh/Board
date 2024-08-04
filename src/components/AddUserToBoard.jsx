import  { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; 
import { Link } from 'react-router-dom';
import api from '../api';
import 'bulma/css/bulma.min.css';

const AddUserToBoard = ({ boardId }) => {
  const [invitations, setInvitations] = useState([]);
  const [acceptedInvitations, setAcceptedInvitations] = useState([]);

  useEffect(() => {
    fetchInvitations();
    fetchAcceptedInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await api.get('/invitaciones/recibidas');
      setInvitations(response.data.invitacionesRecibidas);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const fetchAcceptedInvitations = async () => {
    try {
      const response = await api.get('/invitaciones/aceptadas');
      setAcceptedInvitations(response.data.invitacionesAceptadas);
    } catch (error) {
      console.error('Error fetching accepted invitations:', error);
    }
  };

  const handleAddUserToBoard = async (invitationId) => {
    try {
      await api.post('/usuarios/agregar', { boardId, invitationId });
      alert('Usuario agregado exitosamente');
      fetchInvitations();
      fetchAcceptedInvitations();
    } catch (error) {
      console.error('Error al agregar usuario al tablero:', error);
      alert('Error al agregar usuario al tablero');
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Agregar Usuario al Tablero</h2>
      <Link to="/board" className="button is-link">Volver al Tablero</Link>
      <div className="box">
        <h3 className="title is-3">Invitaciones Recibidas</h3>
        {invitations.length === 0 ? (
          <p>No hay invitaciones recibidas.</p>
        ) : (
          <ul>
            {invitations.map((invitation) => (
              <li key={invitation.InvitacionID} className="columns is-vcentered">
                <div className="column is-four-fifths">
                  {invitation.email}
                </div>
                <div className="column">
                  <button
                    className="button is-primary is-small"
                    onClick={() => handleAddUserToBoard(invitation.InvitacionID)}
                  >
                    Agregar al Tablero
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="box">
        <h3 className="title is-3">Invitaciones Aceptadas</h3>
        {acceptedInvitations.length === 0 ? (
          <p>No hay invitaciones aceptadas.</p>
        ) : (
          <ul>
            {acceptedInvitations.map((invitation) => (
              <li key={invitation.InvitacionID} className="columns is-vcentered">
                <div className="column is-four-fifths">
                  {invitation.email} 
                </div>
                <div className="column">
                  <button
                    className="button is-primary is-small"
                    onClick={() => handleAddUserToBoard(invitation.InvitacionID)}
                  >
                    Agregar al Tablero
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

AddUserToBoard.propTypes = {
  boardId: PropTypes.number.isRequired,
};

export default AddUserToBoard;
