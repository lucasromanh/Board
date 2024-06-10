
import PropTypes from 'prop-types';
import Column from './Column';

const Board = ({ columns, onChangeListName, onRemoveList, onDuplicateList, onAddCard, onRemoveCard, onDuplicateCard, onChangeCardContent }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          columnId={column.id}
          onChangeListName={onChangeListName}
          onRemoveList={onRemoveList}
          onDuplicateList={onDuplicateList}
          onAddCard={onAddCard}
          onRemoveCard={onRemoveCard}
          onDuplicateCard={onDuplicateCard}
          onChangeCardContent={onChangeCardContent}
        />
      ))}
    </div>
  );
};

Board.propTypes = {
  columns: PropTypes.array.isRequired,
  onChangeListName: PropTypes.func.isRequired,
  onRemoveList: PropTypes.func.isRequired,
  onDuplicateList: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onRemoveCard: PropTypes.func.isRequired,
  onDuplicateCard: PropTypes.func.isRequired,
  onChangeCardContent: PropTypes.func.isRequired,
};

export default Board;
