import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCard, updateCard, removeCard, setSearchText, addColumn, updateColumnTitle } from '../store';
import Column from './Column';
import './Board.css';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import api from '../api';
import Logout from './Logout';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Board = () => {
  const columns = useSelector(state => state.board.columns);
  const searchTerm = useSelector(state => state.search);
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const { user } = useAuth();

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

  const handleAddCard = async (columnId, { title, content }) => {
    const newCard = {
      id: `card-${Date.now()}`,
      title,
      content,
    };
    try {
      await api.post('/api/tareas', { columnId, title, content });
      dispatch(addCard({ columnId, card: newCard }));
    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
    }
  };

  const handleEditCard = async (columnId, cardId, updatedCard) => {
    try {
      await api.put(`/api/tareas/${cardId}`, { columnId, ...updatedCard });
      dispatch(updateCard({ columnId, cardId, updatedCard }));
    } catch (error) {
      console.error('Error al editar tarjeta:', error);
    }
  };

  const handleDeleteCard = async (columnId, cardId) => {
    try {
      await api.delete(`/api/tareas/${cardId}`);
      dispatch(removeCard({ columnId, cardId }));
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
    }
  };

  return (
    <div className="board-container">
      <aside className="side-panel">
        <div className="side-panel-content">
          <button title="Agregar TABLERO"><i className="fas fa-plus"></i></button>
          <button title="Agregar USUARIO a tablero"><i className="fas fa-user-plus"></i></button>
          <button title="Ver USUARIOS CONECTADOS"><i className="fas fa-users"></i></button>
          <Logout />
          {user && <Link to={`/profile/${user.id}`}><i className="fas fa-user"></i></Link>}
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
