
import PropTypes from 'prop-types';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';
import { CardListContainer, CardListWrapper } from '../styles/CardListStyles';
import CardListHeader from './CardListHeader';
import AddForm from './AddForm';

const CardList = ({ column, columnId, onChangeListName, onRemoveList, onDuplicateList, onAddCard, onRemoveCard, onDuplicateCard, onChangeCardContent }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <CardListContainer
          {...provided.droppableProps}
          ref={provided.innerRef}
          isDraggingOver={snapshot.isDraggingOver}
        >
          <CardListWrapper>
            <CardListHeader
              listName={column.title}
              onChangeListName={(newName) => onChangeListName(columnId, newName)}
              onRemoveList={() => onRemoveList(columnId)}
              onDuplicateList={() => onDuplicateList(columnId)}
            />
            {column.cards.map((card, index) => (
              <Card
                key={card.id}
                card={card}
                index={index}
                columnId={columnId}
                onRemoveCard={() => onRemoveCard(columnId, card.id)}
                onDuplicateCard={() => onDuplicateCard(columnId, card.id)}
                onChangeCardContent={(updatedCard) => onChangeCardContent(columnId, card.id, updatedCard)}
              />
            ))}
            {provided.placeholder}
            <AddForm placeholder="Agregar a Tarjeta" onConfirm={(content) => onAddCard(columnId, { id: `card-${Date.now()}`, title: content, content })} />
          </CardListWrapper>
        </CardListContainer>
      )}
    </Droppable>
  );
};

CardList.propTypes = {
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

export default CardList;
