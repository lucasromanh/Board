import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import 'bulma/css/bulma.min.css';

const AddBoard = ({ onBoardAdded }) => {
  const [titulo, setTitulo] = useState('');
  const [userBoards, setUserBoards] = useState([]);
  const navigate = useNavigate();

  const fetchUserBoards = async () => {
    try {
      const response = await api.get('/boards', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Respuesta de la API:', response.data);
      if (response.data.boards && Array.isArray(response.data.boards)) {
        setUserBoards(response.data.boards);
      } else {
        console.error('La respuesta de la API no es un array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user boards:', error);
      setUserBoards([]); // Set as empty array to avoid errors
    }
  };

  useEffect(() => {
    fetchUserBoards();
  }, []);

  const handleAddBoard = async () => {
    if (titulo.trim() === '') {
      alert('El título no puede estar vacío');
      return;
    }

    try {
      const response = await api.post('/boards', { Titulo: titulo }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.status === 201) {
        alert('Tablero creado exitosamente');
        setTitulo('');
        onBoardAdded();
        fetchUserBoards(); // Refresh the list of boards
      }
    } catch (error) {
      console.error('Error al agregar tablero:', error);
    }
  };

  const handleBoardSelection = (e) => {
    const boardId = e.target.value;
    if (boardId) {
      navigate(`/board/${boardId}`);
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2">Agregar Nuevo Tablero</h2>
      <Link to="/board" className="button is-link">Volver al Tablero</Link>
      <div className="field">
        <label className="label" htmlFor="board-title">Título del Tablero</label>
        <div className="control">
          <input
            className="input"
            id="board-title"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ingrese el título del tablero"
          />
        </div>
      </div>
      <div className="control">
        <button className="button is-primary" onClick={handleAddBoard}>
          Agregar Tablero
        </button>
      </div>
      <div className="field">
        <label className="label" htmlFor="select-board">Seleccionar Tablero</label>
        <div className="control">
          <div className="select">
            <select id="select-board" onChange={handleBoardSelection}>
              <option value="">Seleccione un tablero</option>
              {userBoards.map((board) => (
                <option key={board.BoardID} value={board.BoardID}>
                  {board.Titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

AddBoard.propTypes = {
  onBoardAdded: PropTypes.func.isRequired,
};

export default AddBoard;
