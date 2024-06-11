import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCard, updateCard, removeCard, setSearchText, addColumn, updateColumnTitle } from '../store';
import Column from './Column';
import './Board.css';

const Board = () => {
  const columns = useSelector(state => state.board.columns);
  const searchTerm = useSelector(state => state.search);
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleSearch = (e) => {
    dispatch(setSearchText(e.target.value));
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

  const handleAddCard = (columnId, { title, content }) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title,
      content,
    };
    dispatch(addCard({ columnId, card: newCard }));
  };

  const handleEditCard = (columnId, cardId, updatedCard) => {
    dispatch(updateCard({ columnId, cardId, updatedCard }));
  };

  const handleDeleteCard = (columnId, cardId) => {
    dispatch(removeCard({ columnId, cardId }));
  };

  return (
    <div className="board-container">
      <aside className="side-panel">
        <div className="side-panel-content">
          <h2>Opciones</h2>
          <button>Agregar TABLERO</button>
          <button>Agregar USUARIO a tablero</button>
          <button>Ver USUARIOS CONECTADOS</button>
        </div>
      </aside>
      <div className="main-content">
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
            <Column
              key={column.id}
              column={column}
              searchTerm={searchTerm}
              onUpdateColumnTitle={handleUpdateColumnTitle}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
          ))}
          <div className="desk new-column-form">
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
    </div>
  );
};

export default Board;
