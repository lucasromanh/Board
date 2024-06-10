import { DragDropContext } from '@hello-pangea/dnd';
import { useSelector, useDispatch } from 'react-redux';
import { moveCard, changeListName, removeList, duplicateList, addCard, removeCard, duplicateCard, updateCard } from './store';
import Board from './components/Board';
import './App.css';

const App = () => {
  const dispatch = useDispatch();
  const columns = useSelector(state => state.board.columns);

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    dispatch(moveCard({
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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="App">
        <Board
          columns={columns}
          onChangeListName={(columnId, newName) => dispatch(changeListName({ columnId, newName }))}
          onRemoveList={(columnId) => dispatch(removeList({ columnId }))}
          onDuplicateList={(columnId) => dispatch(duplicateList({ columnId }))}
          onAddCard={(columnId, card) => dispatch(addCard({ columnId, card }))}
          onRemoveCard={(columnId, cardId) => dispatch(removeCard({ columnId, cardId }))}
          onDuplicateCard={(columnId, cardId) => dispatch(duplicateCard({ columnId, cardId }))}
          onChangeCardContent={(columnId, cardId, updatedCard) => dispatch(updateCard({ columnId, cardId, updatedCard }))}
        />
      </div>
    </DragDropContext>
  );
};

export default App;
