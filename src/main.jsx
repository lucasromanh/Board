import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store, { moveCard } from './store';
import App from './App';
import Login from './components/Login';
import Board from './components/Board';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import '@fortawesome/fontawesome-svg-core/styles.css';
import 'bulma/css/bulma.min.css';
import './index.css';
import { DragDropContext } from '@hello-pangea/dnd';

const onDragEnd = (result) => {
  const { source, destination } = result;

  if (!destination) {
    return;
  }

  store.dispatch(moveCard({
    source: {
      droppableId: source.droppableId,
      index: source.index,
    },
    destination: {
      droppableId: destination.droppableId,
      index: destination.index,
    },
  }));
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/board"
                element={
                  <ProtectedRoute>
                    <Board />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<App />} />
            </Routes>
          </AuthProvider>
        </Router>
      </DragDropContext>
    </Provider>
  </React.StrictMode>
);
