import { useState, useEffect } from 'react';
import api from '../api';
import './CommentManagement.css';

const CommentManagement = () => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState({ content: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await api.get('/api/comentarios');
        setComments(response.data);
        console.log('Comentarios obtenidos:', response.data);
      } catch (error) {
        setMessage('Error al obtener comentarios');
        console.error('Error al obtener comentarios:', error);
      }
    };

    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/comentarios', comment);
      setComments([...comments, response.data]);
      setMessage('Comentario creado exitosamente');
    } catch (error) {
      setMessage('Error al crear comentario');
      console.error('Error al crear comentario:', error);
    }
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/api/comentarios/${id}`, comment);
      setMessage('Comentario actualizado exitosamente');
    } catch (error) {
      setMessage('Error al actualizar comentario');
      console.error('Error al actualizar comentario:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/api/comentarios/${id}`);
      setComments(comments.filter(comment => comment.id !== id));
      setMessage('Comentario eliminado exitosamente');
    } catch (error) {
      setMessage('Error al eliminar comentario');
      console.error('Error al eliminar comentario:', error);
    }
  };

  return (
    <div className="comment-management-container">
      <h2>Gestión de Comentarios</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="content">Contenido</label>
          <textarea
            id="content"
            value={comment.content}
            onChange={(e) => setComment({ ...comment, content: e.target.value })}
          />
        </div>
        <button type="submit">Crear Comentario</button>
      </form>
      {message && <p>{message}</p>}
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <p>{comment.content}</p>
            <button onClick={() => handleUpdate(comment.id)}>Actualizar</button>
            <button onClick={() => handleDelete(comment.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommentManagement;
