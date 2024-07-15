import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Board from './components/Board';
import PerfilUsuario from './components/PerfilUsuario';
import CommentManagement from './components/CommentManagement';
import EditProfile from './components/EditProfile'; 
import ChangePassword from './components/ChangePassword'; 
import Logout from './components/Logout';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
      <Route path="/profile/:userId" element={<ProtectedRoute><PerfilUsuario /></ProtectedRoute>} />
      <Route path="/edit-profile/:userId" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/change-password/:userId" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="/comments" element={<ProtectedRoute><CommentManagement /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
