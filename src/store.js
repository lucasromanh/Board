import { configureStore, createSlice } from '@reduxjs/toolkit';

// Estado inicial para el tablero
const initialBoardState = {
  columns: {
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
  },
};

const boardSlice = createSlice({
  name: 'board',
  initialState: initialBoardState,
  reducers: {
    moveCard: (state, action) => {
      const { source, destination } = action.payload;
      if (!destination) return;

      const sourceColumn = state.columns[source.droppableId];
      const destinationColumn = state.columns[destination.droppableId];
      const [movedCard] = sourceColumn.cards.splice(source.index, 1);

      destinationColumn.cards.splice(destination.index, 0, movedCard);
    },
    addCard: (state, action) => {
      const { columnId, card } = action.payload;
      const column = state.columns[columnId];
      if (column) {
        column.cards.push(card);
      }
    },
    removeCard: (state, action) => {
      const { columnId, cardId } = action.payload;
      const column = state.columns[columnId];
      column.cards = column.cards.filter(card => card.id !== cardId);
    },
    updateCard: (state, action) => {
      const { columnId, cardId, updatedCard } = action.payload;
      const column = state.columns[columnId];
      const cardIndex = column.cards.findIndex(card => card.id === cardId);
      if (cardIndex !== -1) {
        column.cards[cardIndex] = {
          ...column.cards[cardIndex],
          ...updatedCard,
          id: cardId,
        };
      }
    },
    addColumn: (state, action) => {
      const { columnId, title } = action.payload;
      const newColumn = {
        id: columnId,
        title,
        cards: [],
      };
      state.columns[newColumn.id] = newColumn;
    },
    updateColumnTitle: (state, action) => {
      const { columnId, newTitle } = action.payload;
      const column = state.columns[columnId];
      column.title = newTitle;
    },
    setColumns: (state, action) => {
      state.columns = action.payload;
    },
  },
});

const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
    setSearchText: (state, action) => action.payload,
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { isAuthenticated: false, user: null },
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    search: searchSlice.reducer,
    auth: authSlice.reducer,
  },
});

export const {
  moveCard,
  addCard,
  removeCard,
  updateCard,
  addColumn,
  updateColumnTitle,
  setColumns,
} = boardSlice.actions;

export const { setSearchText } = searchSlice.actions;
export const { logout } = authSlice.actions;

export default store;
