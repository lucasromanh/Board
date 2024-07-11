// Column.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from './TaskModal';
import './Column.css';
import { useAuth } from '../context/AuthContext';

const Column = ({ column, searchTerm, onUpdateColumnTitle, onAddCard, onEditCard, onDeleteCard }) => {
  const { user, refreshToken } = useAuth();
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddCard = async () => {
    if (newCardTitle && newCardContent) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found in localStorage');
        return;
      }

      const cardData = { 
        Titulo: newCardTitle, 
        Descripcion: newCardContent, 
        ProyectoID: user?.defaultBoardId 
      };

      console.log('Card data being sent:', cardData);

      try {
        const response = await fetch(`http://localhost:5000/api/tareas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cardData),
        });

        const data = await response.json();
        if (response.ok) {
          console.log('New card added:', data);
          onAddCard(column.id, data);
          setNewCardTitle('');
          setNewCardContent('');
        } else {
          console.error('Error al añadir tarjeta:', response.statusText, data);
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    }
  };

  const handleEditCard = (task) => {
    console.log('Selected Task for Edit:', task);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveCard = async (updatedTask) => {
    console.log('Task to save:', updatedTask);
    if (!updatedTask.TareaID) {
      console.error('TareaID is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }

    if (!user) {
      console.error('User is null');
      return;
    }

    const taskToUpdate = {
      ...updatedTask,
      ProyectoID: user.defaultBoardId,
      FechaVencimiento: updatedTask.FechaVencimiento || null
    };

    try {
      let response = await fetch(`http://localhost:5000/api/tareas/${taskToUpdate.TareaID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskToUpdate),
      });

      if (response.status === 403) {
        const newToken = await refreshToken();
        response = await fetch(`http://localhost:5000/api/tareas/${taskToUpdate.TareaID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newToken}`,
          },
          body: JSON.stringify(taskToUpdate),
        });
      }

      const data = await response.json();
      if (response.ok) {
        onEditCard(column.id, taskToUpdate.TareaID, data);
        setIsModalOpen(false);
      } else {
        console.error('Failed to save the task:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleAddMember = async (taskId, userId) => {
    if (!taskId) {
      console.error('taskId is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tareas/${taskId}/miembros`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ UsuarioID: userId }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al añadir miembro:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleAddLabel = async (taskId, labelName) => {
    if (!taskId) {
      console.error('taskId is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tareas/${taskId}/etiquetas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Nombre: labelName }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al añadir etiqueta:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleAddChecklist = async (taskId, checklistTitle) => {
    if (!taskId) {
      console.error('taskId is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tareas/${taskId}/checklist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Titulo: checklistTitle }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al añadir checklist:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleAddDueDate = async (taskId, dueDate) => {
    if (!taskId) {
      console.error('taskId is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tareas/${taskId}/fechas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ FechaVencimiento: dueDate }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al añadir fecha de vencimiento:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleAddAttachment = async (taskId, file) => {
    if (!taskId) {
      console.error('taskId is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('Archivo', file);

      const response = await fetch(`http://localhost:5000/api/tareas/${taskId}/adjuntos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al añadir adjunto:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const handleAddCover = async (taskId, coverId) => {
    if (!taskId) {
      console.error('taskId is undefined');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found in localStorage');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/tareas/${taskId}/portada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ PortadaID: coverId }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error al añadir portada:', response.statusText, data);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const filteredCards = column.cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Droppable droppableId={column.id}>
      {(provided) => (
        <div
          className="desk"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="desk-head">
            <input
              type="text"
              value={column.title}
              onChange={(e) => onUpdateColumnTitle(column.id, e.target.value)}
              className="desk-name"
            />
          </div>
          <div className="cards">
            {filteredCards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    className="task-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="task-card-title">{card.title}</div>
                    <div className="task-card-content" dangerouslySetInnerHTML={{ __html: card.content }} />
                    <div className="task-card-actions">
                      <button onClick={() => handleEditCard(card)}>✏️</button>
                      <button onClick={() => onDeleteCard(column.id, card.id)}>🗑️</button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
          <div className="new-card-form">
            <input
              type="text"
              placeholder="Título de la tarea"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              className="new-card-title"
            />
            <textarea
              placeholder="Contenido de la tarea"
              value={newCardContent}
              onChange={(e) => setNewCardContent(e.target.value)}
              className="new-card-content"
            />
            <button onClick={handleAddCard} className="add-card-button">Agregar Tarea</button>
          </div>
          <TaskModal
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            task={selectedTask}
            onSave={handleSaveCard}
            onAddMember={handleAddMember}
            onAddLabel={handleAddLabel}
            onAddChecklist={handleAddChecklist}
            onAddDueDate={handleAddDueDate}
            onAddAttachment={handleAddAttachment}
            onAddCover={handleAddCover}
            columnId={column.id}  // No se si tendria que pasar el id aca??
          />
        </div>
      )}
    </Droppable>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onUpdateColumnTitle: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onEditCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
};

export default Column;
