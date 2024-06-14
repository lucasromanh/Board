import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTags, faCheckSquare, faCalendarAlt, faFileUpload, faImage } from '@fortawesome/free-solid-svg-icons';
import './TaskModal.css';
import { useState, useEffect } from 'react';
import api from '../api'; 

const TaskModal = ({ isOpen, onRequestClose, task, onSave, onAddMember, onAddLabel, onAddChecklist, onAddDueDate, onAddAttachment, onAddCover }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setContent(task.content);
    }
  }, [task]);

  const handleSave = async () => {
    try {
      const response = await api.put(`/api/tareas/${task.id}`, { title, content });
      onSave(response.data);
      onRequestClose();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
    }
  };

  const handleAddMember = async () => {
    try {
      await api.post(`/api/tareas/${task.id}/miembros`, { /* datos del miembro */ });
      onAddMember();
    } catch (error) {
      console.error('Error al añadir miembro:', error);
    }
  };

  const handleAddLabel = async () => {
    try {
      await api.post(`/api/tareas/${task.id}/etiquetas`, { /* datos de la etiqueta */ });
      onAddLabel();
    } catch (error) {
      console.error('Error al añadir etiqueta:', error);
    }
  };

  const handleAddChecklist = async () => {
    try {
      await api.post(`/api/tareas/${task.id}/checklist`, { /* datos del checklist */ });
      onAddChecklist();
    } catch (error) {
      console.error('Error al añadir checklist:', error);
    }
  };

  const handleAddDueDate = async () => {
    try {
      await api.post(`/api/tareas/${task.id}/fechas`, { /* datos de la fecha */ });
      onAddDueDate();
    } catch (error) {
      console.error('Error al añadir fecha:', error);
    }
  };

  const handleAddAttachment = async () => {
    try {
      await api.post(`/api/tareas/${task.id}/adjuntos`, { /* datos del adjunto */ });
      onAddAttachment();
    } catch (error) {
      console.error('Error al añadir adjunto:', error);
    }
  };

  const handleAddCover = async () => {
    try {
      await api.post(`/api/tareas/${task.id}/portada`, { /* datos de la portada */ });
      onAddCover();
    } catch (error) {
      console.error('Error al añadir portada:', error);
    }
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
          <button onClick={handleAddMember}><FontAwesomeIcon icon={faUserPlus} /> Miembros</button>
          <button onClick={handleAddLabel}><FontAwesomeIcon icon={faTags} /> Etiquetas</button>
          <button onClick={handleAddChecklist}><FontAwesomeIcon icon={faCheckSquare} /> Checklist</button>
          <button onClick={handleAddDueDate}><FontAwesomeIcon icon={faCalendarAlt} /> Fechas</button>
          <button onClick={handleAddAttachment}><FontAwesomeIcon icon={faFileUpload} /> Adjuntar</button>
          <button onClick={handleAddCover}><FontAwesomeIcon icon={faImage} /> Portada</button>
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
    id: PropTypes.string.isRequired,
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
