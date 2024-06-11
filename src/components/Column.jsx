import { useState } from 'react';
import PropTypes from 'prop-types';
import { Droppable } from '@hello-pangea/dnd';
import CardList from './CardList';
import TaskModal from './TaskModal';
import './Column.css';

const Column = ({ column, searchTerm, onUpdateColumnTitle, onAddCard, onEditCard, onDeleteCard }) => {
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardContent, setNewCardContent] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCard = () => {
    if (newCardTitle && newCardContent) {
      onAddCard(column.id, { title: newCardTitle, content: newCardContent });
      setNewCardTitle('');
      setNewCardContent('');
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

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
          <CardList
            cards={column.cards}
            searchTerm={searchTerm}
            onEditCard={onEditCard}
            onDeleteCard={onDeleteCard}
            openEditModal={handleEditTask}
          />
          {provided.placeholder}
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
          {isModalOpen && (
            <TaskModal
              isOpen={isModalOpen}
              onRequestClose={handleCloseModal}
              task={selectedTask}
              onSave={(updatedTask) => {
                onEditCard(column.id, selectedTask.id, updatedTask);
                handleCloseModal();
              }}
              onAddMember={() => {}}
              onAddLabel={() => {}}
              onAddChecklist={() => {}}
              onAddDueDate={() => {}}
              onAddAttachment={() => {}}
              onAddCover={() => {}}
            />
          )}
        </div>
      )}
    </Droppable>
  );
};

Column.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onUpdateColumnTitle: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onEditCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
};

export default Column;
