import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { addCard, updateCard, removeCard, setSearchText, addColumn, updateColumnTitle, setColumns, moveCard } from '../store';
import Column from './Column';
import './Board.css';
import useAuth from '../context/useAuth';
import api from '../api';
import Logout from './Logout';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { DragDropContext } from '@hello-pangea/dnd';

const Board = () => {
  const { boardId } = useParams();
  const columns = useSelector(state => state.board.columns);
  const searchTerm = useSelector(state => state.search);
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const { user, refreshToken } = useAuth();
  const [boardTitle, setBoardTitle] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      try {
        const response = await api.get(`/tareas?boardId=${boardId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const tasks = response.data;
          console.log("Tareas obtenidas:", tasks);

          const initialColumns = {
            'column-1': {
              id: 'column-1',
              title: 'Para Hacer',
              cards: [],
            },
            'column-2': {
              id: 'column-2',
              title: 'En Proceso',
              cards: [],
            },
            'column-3': {
              id: 'column-3',
              title: 'Finalizada',
              cards: [],
            },
          };

          tasks.forEach(task => {
            if (validateTask(task)) {
              const columnId = task.status === 'pendiente' ? 'column-1' : task.status === 'en_proceso' ? 'column-2' : 'column-3';
              initialColumns[columnId].cards.push({
                id: task.id.toString(),
                TareaID: task.id.toString(),
                title: task.title,
                content: task.description,
                estado: task.status,
                proyectoID: task.board_id,
                labels: task.labels || [],
                members: task.members || [],
                checklists: task.checklists || []
              });
            } else {
              console.error('Tarea inválida:', task);
            }
          });

          console.log("Columnas iniciales después de asignar tareas:", initialColumns);
          dispatch(setColumns(initialColumns));
        } else {
          console.error('Error al cargar tareas:', response.statusText);
        }
      } catch (error) {
        console.error('Error al cargar tareas:', error);
      }
    };

    const loadBoardTitle = async () => {
      try {
        const response = await api.get(`/boards/${boardId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.status === 200) {
          setBoardTitle(response.data.Titulo);
        } else {
          console.error('Error al cargar el título del tablero:', response.statusText);
        }
      } catch (error) {
        console.error('Error al cargar el título del tablero:', error);
      }
    };

    loadTasks();
    loadBoardTitle();
  }, [boardId, dispatch]);

  const validateTask = (task) => {
    const valid = task.id && task.title && task.description && task.status !== undefined && task.board_id;
    if (!valid) {
      console.error('Tarea inválida:', task);
    }
    return valid;
  };

  const handleSearch = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  const handleAddColumn = async () => {
    if (newColumnTitle) {
      try {
        const response = await api.post('/columnas', { ProyectoID: boardId, ColumnaNombre: newColumnTitle }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const newColumnId = response.data.id;
        const newColumn = {
          id: `column-${newColumnId}`,
          title: newColumnTitle,
          cards: [],
        };
        dispatch(addColumn({ columnId: newColumn.id, title: newColumnTitle }));
        setNewColumnTitle('');
      } catch (error) {
        console.error('Error al agregar columna:', error);
      }
    }
  };

  const handleUpdateColumnTitle = async (columnId, newTitle) => {
    try {
      const response = await api.put(`/columnas/${columnId.replace('column-', '')}`, { ColumnaNombre: newTitle }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        dispatch(updateColumnTitle({ columnId, newTitle }));
      }
    } catch (error) {
      console.error('Error al actualizar el título de la columna:', error);
    }
  };

  const handleAddCard = async (columnId, { title, content }) => {
    try {
      const estado = columnId === 'column-1' ? 'pendiente' : columnId === 'column-2' ? 'en_proceso' : 'completada';
      const response = await api.post('/tareas', {
        ProyectoID: boardId,
        Titulo: title,
        Descripcion: content,
        Estado: estado,
      });
      const newCard = {
        id: response.data.task.id.toString(),
        TareaID: response.data.task.id.toString(),
        title,
        content,
        estado,
        labels: [],
        members: [],
        checklists: []
      };
      dispatch(addCard({ columnId, card: newCard }));
    } catch (error) {
      console.error('Error al agregar tarjeta:', error);
    }
  };

  const handleEditCard = async (columnId, cardId, updatedCard) => {
    try {
      await api.put(`/tareas/${cardId}`, { columnId, ...updatedCard });
      dispatch(updateCard({ columnId, cardId, updatedCard }));
    } catch (error) {
      console.error('Error al editar tarjeta:', error);
    }
  };

  const handleDeleteCard = async (columnId, cardId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.delete(`/tareas/${parseInt(cardId, 10)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 204) {
        dispatch(removeCard({ columnId, cardId }));
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
            dispatch(removeCard({ columnId, cardId }));
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

  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destinationColumn = columns[destination.droppableId];
    const movedCard = sourceColumn.cards[source.index];

    if (sourceColumn.id !== destinationColumn.id) {
      try {
        await api.put(`/tareas/${movedCard.TareaID}`, {
          Estado: destinationColumn.id === 'column-1' ? 'pendiente' : destinationColumn.id === 'column-2' ? 'en_proceso' : 'completada'
        });
        dispatch(moveCard({ source, destination }));
      } catch (error) {
        console.error('Error al mover la tarjeta:', error);
      }
    } else {
      dispatch(moveCard({ source, destination }));
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board-container">
        <SidePanel user={user} />
        <div className="main-content">
          <SearchBar searchTerm={searchTerm} handleSearch={handleSearch} />
          <h2 className="board-title">{boardTitle}</h2>
          <div className="columns">
            {Object.values(columns).map((column) => (
              <Column
                key={column.id}
                column={column}
                boardId={parseInt(boardId, 10)}  // Pass the boardId as prop
                searchTerm={searchTerm}
                onUpdateColumnTitle={handleUpdateColumnTitle}
                onAddCard={handleAddCard}
                onEditCard={handleEditCard}
                onDeleteCard={handleDeleteCard}
              />
            ))}
            <NewColumnForm
              newColumnTitle={newColumnTitle}
              setNewColumnTitle={setNewColumnTitle}
              handleAddColumn={handleAddColumn}
            />
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

const SidePanel = ({ user }) => (
  <aside className="side-panel">
    <div className="side-panel-content">
      <Link to="/add-board" title="Agregar TABLERO"><i className="fas fa-plus"></i></Link>
      <Link to="/add-user-to-board" title="Agregar USUARIO a tablero"><i className="fas fa-user-plus"></i></Link>
      <Link to="/connected-users" title="Ver USUARIOS CONECTADOS"><i className="fas fa-users"></i></Link>
      <Link to="/invitations" title="Enviar invitaciones"><i className="fas fa-envelope"></i></Link>
      <Logout />
      {user && <Link to={`/profile/${user.id}`} title="Mi Perfil"><i className="fas fa-user"></i></Link>}
    </div>
  </aside>
);

SidePanel.propTypes = {
  user: PropTypes.object,
};

const SearchBar = ({ searchTerm, handleSearch }) => (
  <div className="search-container">
    <input
      type="text"
      placeholder="Buscar..."
      value={searchTerm}
      onChange={handleSearch}
      className="search-input"
    />
  </div>
);

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
};

const NewColumnForm = ({ newColumnTitle, setNewColumnTitle, handleAddColumn }) => (
  <div className="new-column-form">
    <input
      type="text"
      placeholder="Nuevo título de columna"
      value={newColumnTitle}
      onChange={(e) => setNewColumnTitle(e.target.value)}
      className="new-column-title"
    />
    <button onClick={handleAddColumn} className="add-column-button">Agregar Columna</button>
  </div>
);

NewColumnForm.propTypes = {
  newColumnTitle: PropTypes.string.isRequired,
  setNewColumnTitle: PropTypes.func.isRequired,
  handleAddColumn: PropTypes.func.isRequired,
};

export default Board;
