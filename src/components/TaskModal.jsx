import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './TaskModal.css';

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
  const quillRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.Titulo || task.title || '');
      setContent(task.Descripcion || task.content || '');
    }
  }, [task]);

  const handleSave = () => {
    const editor = quillRef.current.getEditor();
    const htmlContent = editor.root.innerHTML;
    const updatedTask = { ...task, Titulo: title, Descripcion: htmlContent };
    console.log('Updated Task in Modal:', updatedTask);
    onSave(updatedTask);
    onRequestClose();
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
              ref={quillRef}
              value={content}
              onChange={setContent}
              placeholder="Contenido"
            />
          </div>
          <div className="task-modal-sidepanel">
            <button onClick={() => onAddMember(task.TareaID)}>Miembros</button>
            <button onClick={() => onAddLabel(task.TareaID)}>Etiquetas</button>
            <button onClick={() => onAddChecklist(task.TareaID)}>Checklist</button>
            <button onClick={() => onAddDueDate(task.TareaID)}>Fechas</button>
            <button onClick={() => onAddAttachment(task.TareaID)}>Adjuntar</button>
            <button onClick={() => onAddCover(task.TareaID)}>Portada</button>
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
    TareaID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    Titulo: PropTypes.string,
    Descripcion: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string, // Add this line
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
