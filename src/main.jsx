import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store, { moveCard } from './store';
import App from './App';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './index.css';
import { DragDropContext } from '@hello-pangea/dnd';

const onDragEnd = (result) => {
  const { source, destination } = result;

  // Si no hay destino, no hacer nada
  if (!destination) {
    return;
  }

  // Despachar la acción para mover la tarjeta
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
        <App />
      </DragDropContext>
    </Provider>
  </StrictMode>
);
