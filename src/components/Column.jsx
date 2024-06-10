
import PropTypes from 'prop-types';
import CardList from './CardList';

const Column = ({ column, columnId, onChangeListName, onRemoveList, onDuplicateList, onAddCard, onRemoveCard, onDuplicateCard, onChangeCardContent }) => {
  return (
    <div>
      <CardList
        column={column}
        columnId={columnId}
        onChangeListName={onChangeListName}
        onRemoveList={onRemoveList}
        onDuplicateList={onDuplicateList}
        onAddCard={onAddCard}
        onRemoveCard={onRemoveCard}
        onDuplicateCard={onDuplicateCard}
        onChangeCardContent={onChangeCardContent}
      />
    </div>
  );
};

Column.propTypes = {
  column: PropTypes.object.isRequired,
  columnId: PropTypes.string.isRequired,
  onChangeListName: PropTypes.func.isRequired,
  onRemoveList: PropTypes.func.isRequired,
  onDuplicateList: PropTypes.func.isRequired,
  onAddCard: PropTypes.func.isRequired,
  onRemoveCard: PropTypes.func.isRequired,
  onDuplicateCard: PropTypes.func.isRequired,
  onChangeCardContent: PropTypes.func.isRequired,
};

export default Column;
