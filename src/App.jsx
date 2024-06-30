import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Board from './components/Board';
import PerfilUsuario from './components/PerfilUsuario';
import CommentManagement from './components/CommentManagement';
import Logout from './components/Logout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/board" element={<Board />} />
      <Route path="/profile/:userId" element={<PerfilUsuario />} />
      <Route path="/comments" element={<CommentManagement />} />
    </Routes>
  );
};

export default App;
