import { useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from './TaskModal';
import './Column.css';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Column = ({ column, searchTerm, onUpdateColumnTitle, onAddCard, onEditCard, onDeleteCard }) => {
  const { user, refreshToken } = useAuth();
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  if (!user) {
    console.error('Usuario es null');
    return <div>Cargando...</div>;
  }

  const handleAddCard = async () => {
    if (newCardTitle && newCardContent) {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      let estado;
      if (column.id === 'column-1') {
        estado = 'pendiente';
      } else if (column.id === 'column-2') {
        estado = 'en_proceso';
      } else {
        estado = 'completada';
      }
      
      const cardData = {
        Titulo: newCardTitle,
        Descripcion: newCardContent,
        ProyectoID: user.defaultBoardId,
        Estado: estado
      };

      console.log('Datos de la tarjeta que se envían:', cardData);

      try {
        const response = await api.post('/tareas', cardData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (response.status === 201) {
          console.log('Nueva tarjeta añadida:', data);
          onAddCard(column.id, {
            id: data.task.id.toString(),
            TareaID: data.task.id.toString(),
            title: newCardTitle,
            content: newCardContent,
            estado: column.id === 'column-1' ? 'pendiente' : column.id === 'column-2' ? 'en_proceso' : 'completada',
            proyectoID: user.defaultBoardId
          });
          setNewCardTitle('');
          setNewCardContent('');
        } else {
          console.error('Error al añadir tarjeta:', response.statusText, data);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log('Token expirado, intentando refrescar el token...');
          try {
            const newToken = await refreshToken();
            const response = await api.post('/tareas', cardData, {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            });
            const data = response.data;
            if (response.status === 201) {
              console.log('Nueva tarjeta añadida después de refrescar el token:', data);
              onAddCard(column.id, {
                id: data.task.id.toString(),
                TareaID: data.task.id.toString(),
                title: newCardTitle,
                content: newCardContent,
                estado: column.id === 'column-1' ? 'pendiente' : column.id === 'column-2' ? 'en_proceso' : 'completada',
                proyectoID: user.defaultBoardId
              });
              setNewCardTitle('');
              setNewCardContent('');
            } else {
              console.error('Error al añadir tarjeta después de refrescar el token:', response.statusText, data);
            }
          } catch (refreshError) {
            console.error('Error al refrescar el token:', refreshError);
          }
        } else {
          console.error('Error en la solicitud:', error);
        }
      }
    }
  };

  const handleEditCard = (task) => {
    console.log('Tarea seleccionada para editar:', task);
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveCard = async (updatedTask) => {
    console.log('Tarea a guardar:', updatedTask);
    if (!updatedTask.id) {
      console.error('id es undefined');
      return;
    }
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token en localStorage');
      return;
    }
  
    if (!user) {
      console.error('Usuario es null');
      return;
    }
  
    const taskToUpdate = {
      ProyectoID: user.defaultBoardId,
      Titulo: updatedTask.Titulo || updatedTask.title,
      Descripcion: updatedTask.Descripcion || updatedTask.content,
      Importancia: updatedTask.Importancia || 1,
      Estado: updatedTask.Estado || 'pendiente',
      FechaVencimiento: updatedTask.FechaVencimiento || null,
      labels: updatedTask.labels || [],
      members: updatedTask.members || [],
      checklists: updatedTask.checklists || []
    };
  
    try {
      const response = await updateTask(updatedTask.id, taskToUpdate, token);
  
      if (response.status === 200) {
        onEditCard(column.id, updatedTask.id, taskToUpdate);
        setIsModalOpen(false);
      } else if (response.status === 404) {
        await handleCreateTask(taskToUpdate, token);
      } else {
        console.error('Error al guardar la tarea:', response.statusText);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Token expirado, intentando refrescar el token...');
        await handleRefreshToken(updatedTask.id, taskToUpdate);
      } else {
        console.error('Error en la solicitud:', error);
      }
    }
  };
  
  
  const handleCreateTask = async (taskToUpdate, token) => {
    try {
      const createResponse = await createTask(taskToUpdate, token);
  
      if (createResponse.status === 201) {
        const newTask = createResponse.data;
        onAddCard(column.id, { ...taskToUpdate, id: newTask.id });
        setIsModalOpen(false);
      } else {
        console.error('Error al crear la nueva tarea:', createResponse.statusText);
      }
    } catch (error) {
      console.error('Error al crear la nueva tarea:', error);
    }
  };
  
  const handleRefreshToken = async (taskId, taskToUpdate) => {
    try {
      const newToken = await refreshToken();
      const response = await updateTask(taskId, taskToUpdate, newToken);
      if (response.status === 200) {
        onEditCard(column.id, taskId, taskToUpdate);
        setIsModalOpen(false);
      } else {
        console.error('Error al guardar la tarea después de refrescar el token:', response.statusText);
      }
    } catch (refreshError) {
      console.error('Error al refrescar el token:', refreshError);
    }
  };
  
  const updateTask = async (taskId, taskData, token) => {
    return await api.put(`/tareas/${taskId}`, taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  const createTask = async (taskData, token) => {
    return await api.post('/tareas', taskData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  
  const handleDeleteCard = async (cardId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token en localStorage');
      return;
    }

    try {
      const response = await api.delete(`/tareas/${parseInt(cardId, 10)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        onDeleteCard(column.id, cardId);
      } else {
        console.error('Error al eliminar la tarea:', response.statusText, response.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Token expirado, intentando refrescar el token...');
        try {
          const newToken = await refreshToken();
          const response = await api.delete(`/tareas/${parseInt(cardId, 10)}`, {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });

          if (response.status === 204) {
            onDeleteCard(column.id, cardId);
          } else {
            console.error('Error al eliminar la tarea después de refrescar el token:', response.statusText, response.data);
          }
        } catch (refreshError) {
          console.error('Error al refrescar el token:', refreshError);
        }
      } else {
        console.error('Error en la solicitud:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
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
              <Draggable key={card.id} draggableId={card.id.toString()} index={index}>
                {(provided) => (
                  <div
                    className="task-card"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <div className="task-card-title">{card.title}</div>
                    <div className="task-card-content" dangerouslySetInnerHTML={{ __html: card.content }} />
                    <div className="task-card-labels">
                      {card.labels.map((label, index) => (
                        <span key={index} className="task-card-label">{label}</span>
                      ))}
                    </div>
                    <div className="task-card-members">
                      {card.members.map((member, index) => (
                        <span key={index} className="task-card-member">{member}</span>
                      ))}
                    </div>
                    <div className="task-card-actions">
                      <button onClick={() => handleEditCard(card)}>✏️</button>
                      <button onClick={() => handleDeleteCard(card.id)}>🗑️</button>
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
            onAddMember={(taskId, member) => {
              const updatedTask = { ...selectedTask, members: [...selectedTask.members, member] };
              setSelectedTask(updatedTask);
              handleSaveCard(updatedTask);
            }}
            onAddLabel={(taskId, label) => {
              const updatedTask = { ...selectedTask, labels: [...selectedTask.labels, label] };
              setSelectedTask(updatedTask);
              handleSaveCard(updatedTask);
            }}
            onAddChecklist={(taskId, checklist) => {
              const updatedTask = { ...selectedTask, checklists: [...selectedTask.checklists, checklist] };
              setSelectedTask(updatedTask);
              handleSaveCard(updatedTask);
            }}
            onAddDueDate={(taskId, dueDate) => {
              const updatedTask = { ...selectedTask, FechaVencimiento: dueDate };
              setSelectedTask(updatedTask);
              handleSaveCard(updatedTask);
            }}
            onAddAttachment={() => {}}
            onAddCover={() => {}}
            columnId={column.id}
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
      labels: PropTypes.arrayOf(PropTypes.string),
      members: PropTypes.arrayOf(PropTypes.string),
    })).isRequired,
  }).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onUpdateColumnTitle: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onEditCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
};

export default Column;
