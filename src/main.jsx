import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store, { moveCard } from './store';
import App from './App';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './index.css';
import './components/Home.css';
import './components/Navbar.css';
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Router>
          <App />
        </Router>
      </DragDropContext>
    </Provider>
  </StrictMode>
);
