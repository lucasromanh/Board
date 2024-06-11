import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCard, updateCard, removeCard, setSearchText, addColumn, updateColumnTitle } from '../store';
import Column from './Column';

const Board = () => {
  const columns = useSelector(state => state.board.columns);
  const searchTerm = useSelector(state => state.search);
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  const handleSearch = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  const handleAddColumn = () => {
    if (newColumnTitle) {
      dispatch(addColumn(newColumnTitle));
      setNewColumnTitle('');
    }
  };

  return (
    <div className="board-container">
      <aside className={`side-panel ${isAsideOpen ? 'open' : ''}`}>
        <button className="toggle-button" onClick={() => setIsAsideOpen(!isAsideOpen)}>
          {isAsideOpen ? 'Cerrar' : 'Abrir'}
        </button>
        <div className="side-panel-content">
          <h2>Opciones</h2>
          <button>Agregar TABLERO</button>
          <button>Agregar USUARIO a tablero</button>
          <button>Ver USUARIOS CONECTADOS</button>
        </div>
      </aside>
      <main>
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
              onUpdateColumnTitle={(newTitle) => dispatch(updateColumnTitle({ columnId: column.id, newTitle }))}
              onAddCard={(title, content) => dispatch(addCard({ columnId: column.id, card: { id: `card-${Date.now()}`, title, content } }))}
              onEditCard={(cardId, updatedCard) => dispatch(updateCard({ columnId: column.id, cardId, updatedCard }))}
              onDeleteCard={(cardId) => dispatch(removeCard({ columnId: column.id, cardId }))}
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
      </main>
    </div>
  );
};

export default Board;
