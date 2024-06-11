import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTags, faCheckSquare, faCalendarAlt, faFileUpload, faImage } from '@fortawesome/free-solid-svg-icons';
import './TaskModal.css';
import { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onRequestClose, task, onSave, onAddMember, onAddLabel, onAddChecklist, onAddDueDate, onAddAttachment, onAddCover }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
    }
  }, [task]);

  const handleSave = () => {
    onSave({ ...task, title, content });
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} className="task-modal" overlayClassName="task-modal-overlay">
      <div className="task-modal-content">
        <div className="task-modal-header">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="task-modal-title"
            placeholder="Título"
          />
        </div>
        <div className="task-modal-body">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="task-modal-description"
            placeholder="Contenido"
          />
        </div>
        <div className="task-modal-sidepanel">
          <button onClick={onAddMember}><FontAwesomeIcon icon={faUserPlus} /> Miembros</button>
          <button onClick={onAddLabel}><FontAwesomeIcon icon={faTags} /> Etiquetas</button>
          <button onClick={onAddChecklist}><FontAwesomeIcon icon={faCheckSquare} /> Checklist</button>
          <button onClick={onAddDueDate}><FontAwesomeIcon icon={faCalendarAlt} /> Fechas</button>
          <button onClick={onAddAttachment}><FontAwesomeIcon icon={faFileUpload} /> Adjuntar</button>
          <button onClick={onAddCover}><FontAwesomeIcon icon={faImage} /> Portada</button>
        </div>
        <div className="task-modal-footer">
          <button onClick={handleSave} className="task-modal-save-button">Guardar</button>
          <button onClick={onRequestClose} className="task-modal-cancel-button">Cancelar</button>
        </div>
      </div>
    </Modal>
  );
};

TaskModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onRequestClose: PropTypes.func.isRequired,
  task: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onAddMember: PropTypes.func.isRequired,
  onAddLabel: PropTypes.func.isRequired,
  onAddChecklist: PropTypes.func.isRequired,
  onAddDueDate: PropTypes.func.isRequired,
  onAddAttachment: PropTypes.func.isRequired,
  onAddCover: PropTypes.func.isRequired,
};

export default TaskModal;
