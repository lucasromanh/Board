import PropTypes from 'prop-types';
import Modal from 'react-modal';
import { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import DatePicker from 'react-datepicker';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';
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
  columnId,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [memberEmail, setMemberEmail] = useState('');
  const [labelName, setLabelName] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');
  const [file, setFile] = useState(null);
  const [coverId, setCoverId] = useState('');
  const [showInput, setShowInput] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.Titulo || task.title || '');
      setContent(task.Descripcion || task.content || '');
      setDueDate(task.FechaVencimiento ? new Date(task.FechaVencimiento) : null);
    }
  }, [task]);

  const handleSave = () => {
    const editor = quillRef.current.getEditor();
    const htmlContent = editor.root.innerHTML;
    const updatedTask = {
      ...task,
      Titulo: title,
      Descripcion: htmlContent,
      id: task.id,
      ProyectoID: task.ProyectoID || columnId,
      FechaVencimiento: dueDate ? dueDate.toISOString().split('T')[0] : null,
    };
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
              modules={{
                toolbar: [
                  [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                  [{size: []}],
                  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                  [{'list': 'ordered'}, {'list': 'bullet'}, 
                   {'indent': '-1'}, {'indent': '+1'}],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
                clipboard: {
                  matchVisual: false,
                }
              }}
              formats={[
                'header', 'font', 'size',
                'bold', 'italic', 'underline', 'strike', 'blockquote',
                'list', 'bullet', 'indent',
                'link', 'image', 'video'
              ]}
              style={{ color: '#000' }}
            />
          </div>
          <div className="task-modal-sidepanel">
            {showInput === 'member' && (
              <input
                type="text"
                placeholder="Email del miembro"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                className="task-modal-input"
              />
            )}
            <button onClick={() => {setShowInput(showInput === 'member' ? '' : 'member'); if (showInput === 'member') onAddMember(task.id, memberEmail);}}>Añadir Miembro</button>
            
            {showInput === 'label' && (
              <input
                type="text"
                placeholder="Nombre de la etiqueta"
                value={labelName}
                onChange={(e) => setLabelName(e.target.value)}
                className="task-modal-input"
              />
            )}
            <button onClick={() => {setShowInput(showInput === 'label' ? '' : 'label'); if (showInput === 'label') onAddLabel(task.id, labelName);}}>Añadir Etiqueta</button>
            
            {showInput === 'checklist' && (
              <input
                type="text"
                placeholder="Título del checklist"
                value={checklistTitle}
                onChange={(e) => setChecklistTitle(e.target.value)}
                className="task-modal-input"
              />
            )}
            <button onClick={() => {setShowInput(showInput === 'checklist' ? '' : 'checklist'); if (showInput === 'checklist') onAddChecklist(task.id, checklistTitle);}}>Añadir Checklist</button>
            
            {showInput === 'dueDate' && (
              <DatePicker
                selected={dueDate}
                onChange={(date) => setDueDate(date)}
                placeholderText="Fecha de vencimiento"
                className="task-modal-datepicker"
              />
            )}
            <button onClick={() => {setShowInput(showInput === 'dueDate' ? '' : 'dueDate'); if (showInput === 'dueDate') onAddDueDate(task.id, dueDate?.toISOString().split('T')[0]);}}>Añadir Fecha</button>
            
            {showInput === 'file' && (
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="task-modal-input"
              />
            )}
            <button onClick={() => {setShowInput(showInput === 'file' ? '' : 'file'); if (showInput === 'file') onAddAttachment(task.id, file);}}>Añadir Adjunto</button>
            
            {showInput === 'cover' && (
              <input
                type="text"
                placeholder="Nombre de Portada"
                value={coverId}
                onChange={(e) => setCoverId(e.target.value)}
                className="task-modal-input"
              />
            )}
            <button onClick={() => {setShowInput(showInput === 'cover' ? '' : 'cover'); if (showInput === 'cover') onAddCover(task.id, coverId);}}>Añadir Portada</button>
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    Titulo: PropTypes.string,
    Descripcion: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    ProyectoID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    FechaVencimiento: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onAddMember: PropTypes.func.isRequired,
  onAddLabel: PropTypes.func.isRequired,
  onAddChecklist: PropTypes.func.isRequired,
  onAddDueDate: PropTypes.func.isRequired,
  onAddAttachment: PropTypes.func.isRequired,
  onAddCover: PropTypes.func.isRequired,
  columnId: PropTypes.string.isRequired,
};

export default TaskModal;
