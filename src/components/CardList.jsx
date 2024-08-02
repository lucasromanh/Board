import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import Card from './Card';

const CardList = ({ cards, searchTerm, onEditCard, onDeleteCard, openEditModal }) => {
  return (
    <div className="desk-items">
      {cards
        .filter(card => card.title.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((card, index) => (
          <Draggable key={card.id} draggableId={card.id} index={index}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <Card
                  key={card.id}
                  card={card}
                  onEdit={(updatedCard) => onEditCard(card.id, updatedCard)}
                  onDelete={onDeleteCard}
                  openEditModal={openEditModal}
                />
              </div>
            )}
          </Draggable>
        ))}
    </div>
  );
};

CardList.propTypes = {
  cards: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      labels: PropTypes.arrayOf(PropTypes.string),
      members: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
  searchTerm: PropTypes.string.isRequired,
  onEditCard: PropTypes.func.isRequired,
  onDeleteCard: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
};

export default CardList;
