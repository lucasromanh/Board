import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCard, updateCard, removeCard, setSearchText, addColumn, updateColumnTitle } from '../store';
import Card from './Card';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const Board = () => {
  const columns = useSelector(state => state.board.columns);
  const searchTerm = useSelector(state => state.search);
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [newCard, setNewCard] = useState({ title: '', content: '' });
  const [selectedColumn, setSelectedColumn] = useState('');

  const handleSearch = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  const handleAddCard = (columnId) => {
    if (newCard.title && newCard.content) {
      dispatch(addCard({ columnId, card: { id: `card-${Date.now()}`, ...newCard } }));
      setNewCard({ title: '', content: '' });
    }
  };

  const handleAddColumn = () => {
    if (newColumnTitle) {
      dispatch(addColumn(newColumnTitle));
      setNewColumnTitle('');
    }
  };

  const handleUpdateColumnTitle = (columnId, newTitle) => {
    dispatch(updateColumnTitle({ columnId, newTitle }));
  };

  return (
    <div className="board">
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>
      <div className="columns">
        {columns.map(column => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                className="column"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <input
                  type="text"
                  value={column.title}
                  onChange={(e) => handleUpdateColumnTitle(column.id, e.target.value)}
                  className="column-title"
                />
                <div className="card-list">
                  {column.cards
                    .filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Card
                              key={card.id}
                              card={card}
                              onEdit={(updatedCard) => dispatch(updateCard({ columnId: column.id, cardId: card.id, updatedCard }))}
                              onDelete={() => dispatch(removeCard({ columnId: column.id, cardId: card.id }))}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
                <div className="new-card-form">
                  <input
                    type="text"
                    placeholder="Título"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                    className="new-card-title"
                  />
                  <textarea
                    placeholder="Contenido"
                    value={newCard.content}
                    onChange={(e) => setNewCard({ ...newCard, content: e.target.value })}
                    className="new-card-content"
                  />
                  <button onClick={() => handleAddCard(column.id)} className="add-card-button">Agregar Tarea</button>
                </div>
              </div>
            )}
          </Droppable>
        ))}
        <div className="new-column-form">
          <input
            type="text"
            placeholder="Nueva Columna"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            className="new-column-title"
          />
          <button onClick={handleAddColumn} className="add-column-button">Agregar Columna</button>
        </div>
      </div>
    </div>
  );
};

export default Board;
