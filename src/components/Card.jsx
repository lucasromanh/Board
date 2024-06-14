import { useState } from 'react'; 
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import api from '../api'; 

const Card = ({ card, onEdit, onDelete, openEditModal }) => {
  const [editableTitle, setEditableTitle] = useState(card.title);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = async () => {
    setIsEditing(false);
    try {
      await api.put(`/api/tareas/${card.id}`, { title: editableTitle });
      onEdit({ title: editableTitle });
    } catch (error) {
      console.error('Error al editar tarjeta:', error);
    }
  };

  return (
    <div className="card">
      {isEditing ? (
        <input
          type="text"
          value={editableTitle}
          onChange={(e) => setEditableTitle(e.target.value)}
          onBlur={handleBlur}
          className="editable-title-input"
        />
      ) : (
        <button 
          type="button" 
          className="editable-title-button"
          onClick={() => setIsEditing(true)}
        >
          {card.title}
        </button>
      )}
      <p>{card.content}</p>
      <button type="button" onClick={() => openEditModal(card)} className="edit-button">
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button type="button" onClick={async () => {
        try {
          await api.delete(`/api/tareas/${card.id}`);
          onDelete(card.id);
        } catch (error) {
          console.error('Error al eliminar tarjeta:', error);
        }
      }} className="delete-button">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
};

export default Card;
