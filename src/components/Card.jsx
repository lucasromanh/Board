import { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const Card = ({ card, onEdit, onDelete }) => {
  const [editableTitle, setEditableTitle] = useState(card.title);
  const [isEditing, setIsEditing] = useState(false);

  const handleBlur = () => {
    setIsEditing(false);
    onEdit({ title: editableTitle });
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
      <button type="button" onClick={() => setIsEditing(true)} className="edit-button">
        <FontAwesomeIcon icon={faEdit} />
      </button>
      <button type="button" onClick={onDelete} className="delete-button">
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
};

export default Card;
