import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TaskModal.css';
import { convertToRaw, convertFromRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

Modal.setAppElement('#root');

const TaskModal = ({
  isOpen,
  onRequestClose,
  task,
  onSave,
  onAddMember,
  onAddLabel,
  onAddChecklist,
  onAddDueDate,
  onAddAttachment,
  onAddCover,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');

      try {
        const contentBlock = htmlToDraft(task.content || '');
        if (contentBlock) {
          const contentState = convertFromRaw({
            entityMap: {},
            blocks: contentBlock,
          });
          setContent(EditorState.createWithContent(contentState));
        } else {
          setContent(EditorState.createEmpty());
        }
      } catch (e) {
        console.error('Error parsing task content:', e);
        setContent(EditorState.createEmpty());
      }
    }
  }, [task]);

  const handleSave = () => {
    const rawContentState = convertToRaw(content.getCurrentContent());
    const htmlContent = draftToHtml(rawContentState);
    const updatedTask = { ...task, title, content: htmlContent };
    onSave(updatedTask);
    onRequestClose();
  };

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tareas/${task.id}/miembros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        onAddMember(data);
      } else {
        console.error('Error al añadir miembro:', response.statusText);
      }
    } catch (error) {
      console.error('Error al añadir miembro:', error);
    }
  };

  const handleAddLabel = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tareas/${task.id}/etiquetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        onAddLabel(data);
      } else {
        console.error('Error al añadir etiqueta:', response.statusText);
      }
    } catch (error) {
      console.error('Error al añadir etiqueta:', error);
    }
  };

  const handleAddChecklist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tareas/${task.id}/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        onAddChecklist(data);
      } else {
        console.error('Error al añadir checklist:', response.statusText);
      }
    } catch (error) {
      console.error('Error al añadir checklist:', error);
    }
  };

  const handleAddDueDate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tareas/${task.id}/fechas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        onAddDueDate(data);
      } else {
        console.error('Error al añadir fecha:', response.statusText);
      }
    } catch (error) {
      console.error('Error al añadir fecha:', error);
    }
  };

  const handleAddAttachment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tareas/${task.id}/adjuntos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        onAddAttachment(data);
      } else {
        console.error('Error al añadir adjunto:', response.statusText);
      }
    } catch (error) {
      console.error('Error al añadir adjunto:', error);
    }
  };

  const handleAddCover = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/tareas/${task.id}/portada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        onAddCover(data);
      } else {
        console.error('Error al añadir portada:', response.statusText);
      }
    } catch (error) {
      console.error('Error al añadir portada:', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="task-modal"
      overlayClassName="task-modal-overlay"
    >
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
          <div className="task-modal-description">
            <ReactQuill
              value={content}
              onChange={setContent}
              placeholder="Contenido"
            />
          </div>
          <div className="task-modal-sidepanel">
            <button onClick={handleAddMember}>Miembros</button>
            <button onClick={handleAddLabel}>Etiquetas</button>
            <button onClick={handleAddChecklist}>Checklist</button>
            <button onClick={handleAddDueDate}>Fechas</button>
            <button onClick={handleAddAttachment}>Adjuntar</button>
            <button onClick={handleAddCover}>Portada</button>
          </div>
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
