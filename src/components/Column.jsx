import { useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskModal from './TaskModal';
import './Column.css';

const Column = ({ column, searchTerm, onUpdateColumnTitle, onAddCard, onEditCard, onDeleteCard }) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleAddCard = () => {
    if (newCardTitle && newCardContent) {
      onAddCard(column.id, { title: newCardTitle, content: newCardContent });
      setNewCardTitle('');
      setNewCardContent('');
    }
  };

  const handleEditCard = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveCard = (updatedTask) => {
    onEditCard(column.id, selectedTask.id, updatedTask);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const filteredCards = column.cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    JSON.parse(card.content).blocks.some(block => block.text.toLowerCase().includes(searchTerm.toLowerCase()))
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
                    <div className="task-card-content">{JSON.parse(card.content).blocks[0].text}</div>
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
            onAddMember={() => {}} // Función vacía por ahora
            onAddLabel={() => {}} // Función vacía por ahora
            onAddChecklist={() => {}} // Función vacía por ahora
            onAddDueDate={() => {}} // Función vacía por ahora
            onAddAttachment={() => {}} // Función vacía por ahora
            onAddCover={() => {}} // Función vacía por ahora
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
