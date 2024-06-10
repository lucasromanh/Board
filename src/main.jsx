import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import App from './App.jsx';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './index.css';
import { DragDropContext } from '@hello-pangea/dnd';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <DragDropContext>
        <App />
      </DragDropContext>
    </Provider>
  </StrictMode>
);
