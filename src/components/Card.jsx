import  { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faTags, faPaperclip } from '@fortawesome/free-solid-svg-icons';
import api from '../api';
import LabelModal from './LabelModal';
import EditCardModal from './EditCardModal';
import ProfilePic from './ProfilePic';
import './Card.css';

const Card = ({ card, onEdit, onDelete }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editableTitle, setEditableTitle] = useState(card.title);
  const [editableContent, setEditableContent] = useState(card.content);
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const cardElem = useRef(null);

  const handleBlur = async () => {
    setIsEditingTitle(false);
    setIsEditingContent(false);
    try {
      await api.put(`/api/tareas/${card.id}`, { title: editableTitle, content: editableContent });
      onEdit({ ...card, title: editableTitle, content: editableContent });
    } catch (error) {
      console.error('Error al editar tarjeta:', error);
    }
  };

  return (
    <>
      <div className="card" ref={cardElem}>
        {isEditingTitle ? (
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
            onClick={() => setIsEditingTitle(true)}
          >
            {card.title}
          </button>
        )}
        {isEditingContent ? (
          <textarea
            value={editableContent}
            onChange={(e) => setEditableContent(e.target.value)}
            onBlur={handleBlur}
            className="editable-content-input"
          />
        ) : (
          <button
            type="button"
            className="editable-content-button"
            onClick={() => setIsEditingContent(true)}
          >
            {card.content}
          </button>
        )}
        <div className="card-labels">
          {card.labels.map((label, index) => (
            <span key={index} className="card-label">{label}</span>
          ))}
        </div>
        <div className="card-members">
          {card.members.map((member, index) => (
            <ProfilePic key={index} user={member} />
          ))}
        </div>
        <div className="card-actions">
          <button type="button" onClick={() => setShowEditModal(true)} className="edit-button">
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
          <button type="button" onClick={() => setShowLabelModal(true)} className="label-button">
            <FontAwesomeIcon icon={faTags} />
          </button>
        </div>
        {card.attachments?.length > 0 && (
          <div className="card-attachments">
            <FontAwesomeIcon icon={faPaperclip} /> {card.attachments.length}
          </div>
        )}
      </div>
      {showLabelModal && (
        <LabelModal card={card} setShowModal={setShowLabelModal} />
      )}
      {showEditModal && (
        <EditCardModal card={card} setShowModal={setShowEditModal} onEdit={onEdit} />
      )}
    </>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string),
    members: PropTypes.arrayOf(PropTypes.object),
    attachments: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Card;
