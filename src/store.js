import { configureStore, createSlice } from '@reduxjs/toolkit';

// Define initial state
const initialBoardState = {
  columns: [
    {
      id: 'column-1',
      title: 'Para Hacer',
      cards: [
        { id: 'card-1', title: 'Tarea 1', content: 'Contenido para Tarea 1' },
        { id: 'card-2', title: 'Tarea 2', content: 'Contenido para Tarea 2' },
      ],
    },
    {
      id: 'column-2',
      title: 'En Proceso',
      cards: [
        { id: 'card-3', title: 'Tarea 3', content: 'Contenido para Tarea 3' },
        { id: 'card-4', title: 'Tarea 4', content: 'Contenido para Tarea 4' },
      ],
    },
    {
      id: 'column-3',
      title: 'Finalizada',
      cards: [
        { id: 'card-5', title: 'Tarea 5', content: 'Contenido para Tarea 5' },
        { id: 'card-6', title: 'Tarea 6', content: 'Contenido para Tarea 6' },
      ],
    },
  ],
};

const initialSearchState = '';

const boardSlice = createSlice({
    name: 'board',
    initialState: initialBoardState,
    reducers: {
      moveCard: (state, action) => {
        const { source, destination } = action.payload;
        if (!destination) return;
  
        const sourceColumn = state.columns.find(column => column.id === source.droppableId);
        const destinationColumn = state.columns.find(column => column.id === destination.droppableId);
        const [movedCard] = sourceColumn.cards.splice(source.index, 1);
  
        if (sourceColumn.id === destinationColumn.id) {
          sourceColumn.cards.splice(destination.index, 0, movedCard);
        } else {
          destinationColumn.cards.splice(destination.index, 0, movedCard);
        }
      },
      addCard: (state, action) => {
        const { columnId, card } = action.payload;
        const column = state.columns.find(column => column.id === columnId);
        column.cards.push(card);
      },
      removeCard: (state, action) => {
        const { columnId, cardId } = action.payload;
        const column = state.columns.find(column => column.id === columnId);
        column.cards = column.cards.filter(card => card.id !== cardId);
      },
      updateCard: (state, action) => {
        const { columnId, cardId, updatedCard } = action.payload;
        const column = state.columns.find(column => column.id === columnId);
        const cardIndex = column.cards.findIndex(card => card.id === cardId);
        column.cards[cardIndex] = { ...column.cards[cardIndex], ...updatedCard };
      },
      duplicateCard: (state, action) => {
        const { columnId, cardId } = action.payload;
        const column = state.columns.find(column => column.id === columnId);
        const card = column.cards.find(card => card.id === cardId);
        const newCard = { ...card, id: `card-${Date.now()}` };
        column.cards.push(newCard);
      },
      changeListName: (state, action) => {
        const { columnId, newName } = action.payload;
        const column = state.columns.find(column => column.id === columnId);
        column.title = newName;
      },
      removeList: (state, action) => {
        const { columnId } = action.payload;
        state.columns = state.columns.filter(column => column.id !== columnId);
      },
      duplicateList: (state, action) => {
        const { columnId } = action.payload;
        const column = state.columns.find(column => column.id === columnId);
        const newColumn = {
          ...column,
          id: `column-${Date.now()}`,
          cards: column.cards.map(card => ({ ...card, id: `card-${Date.now() + Math.random()}` })),
        };
        state.columns.push(newColumn);
      },
    },
  });

const searchSlice = createSlice({
  name: 'search',
  initialState: initialSearchState,
  reducers: {
    setSearchText: (state, action) => action.payload,
  },
});

const store = configureStore({
  reducer: {
    board: boardSlice.reducer,
    search: searchSlice.reducer,
  },
});

export const {
  moveCard,
  addCard,
  removeCard,
  updateCard,
  duplicateCard,
  changeListName,
  removeList,
  duplicateList,
} = boardSlice.actions;

export const { setSearchText } = searchSlice.actions;

export default store;