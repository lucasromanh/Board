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

      const cardData = { 
        Titulo: newCardTitle, 
        Descripcion: newCardContent, 
        ProyectoID: user.defaultBoardId 
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
          onAddCard(column.id, data);
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
              onAddCard(column.id, data);
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
      ...updatedTask,
      ProyectoID: user.defaultBoardId,
      FechaVencimiento: updatedTask.FechaVencimiento || null
    };

    try {
      let response = await api.put(`/tareas/${taskToUpdate.id}`, taskToUpdate, {  
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;
      if (response.status === 200) {
        onEditCard(column.id, taskToUpdate.id, data);  
        setIsModalOpen(false);
      } else {
        console.error('Error al guardar la tarea:', response.statusText, data);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log('Token expirado, intentando refrescar el token...');
        try {
          const newToken = await refreshToken();
          const response = await api.put(`/tareas/${taskToUpdate.id}`, taskToUpdate, {  
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
          const data = response.data;
          if (response.status === 200) {
            onEditCard(column.id, taskToUpdate.id, data);  
            setIsModalOpen(false);
          } else {
            console.error('Error al guardar la tarea después de refrescar el token:', response.statusText, data);
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
    })).isRequired,
  }).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onUpdateColumnTitle: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onEditCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
};

export default Column;
