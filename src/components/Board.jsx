import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addCard, updateCard, removeCard, setSearchText, addColumn, updateColumnTitle, setColumns, moveCard } from '../store';
import Column from './Column';
import './Board.css';
import { Link } from 'react-router-dom';
import useAuth from '../context/useAuth';
import api from '../api';
import Logout from './Logout';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { DragDropContext } from '@hello-pangea/dnd';

const Board = () => {
  const columns = useSelector(state => state.board.columns);
  const searchTerm = useSelector(state => state.search);
  const dispatch = useDispatch();
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const loadTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No se encontró el token en localStorage');
        return;
      }

      try {
        const response = await api.get('/tareas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const tasks = response.data;
          console.log("Tareas obtenidas:", tasks);

          // Columnas predeterminadas
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

          // Asignar tareas a las columnas correspondientes
          tasks.forEach(task => {
            if (validateTask(task)) {
              const columnId = task.status === 'pendiente' ? 'column-1' : task.status === 'en_proceso' ? 'column-2' : 'column-3';
              initialColumns[columnId].cards.push({
                id: task.id.toString(),
                TareaID: task.id.toString(),
                title: task.title,
                content: task.description,
                estado: task.status,
                proyectoID: task.board_id
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

    loadTasks();
  }, [dispatch]);

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
        const response = await api.post('/columnas', { ProyectoID: user.defaultBoardId, ColumnaNombre: newColumnTitle }, {
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
        ProyectoID: user.defaultBoardId,
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
      const response = await api.delete(`/tareas/${parseInt(cardId, 10)}`);
      if (response.status === 204) {
        dispatch(removeCard({ columnId, cardId }));
      } else {
        console.error('Error al eliminar la tarea:', response.statusText, response.data);
      }
    } catch (error) {
      console.error('Error al eliminar tarjeta:', error);
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
        <aside className="side-panel">
          <div className="side-panel-content">
            <button title="Agregar TABLERO"><i className="fas fa-plus"></i></button>
            <button title="Agregar USUARIO a tablero"><i className="fas fa-user-plus"></i></button>
            <button title="Ver USUARIOS CONECTADOS"><i className="fas fa-users"></i></button>
            <Logout />
            {user && <Link to={`/profile/${user.id}`} title="Mi Perfil"><i className="fas fa-user"></i></Link>}
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
            {Object.values(columns).map(column => (
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
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Board;
