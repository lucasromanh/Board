import PropTypes from 'prop-types';
import { Draggable } from '@hello-pangea/dnd';
import styled from 'styled-components';

const CardContainer = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: white;
`;

const Card = ({ card, index, onRemoveCard, onDuplicateCard }) => {
  const handleRemoveClick = () => {
    onRemoveCard(card.id); // Pasar el ID de la tarjeta
  };

  const handleDuplicateClick = () => {
    onDuplicateCard(card.id); // Pasar el ID de la tarjeta
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <CardContainer
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {card.content}
          <button onClick={handleRemoveClick}>Remove</button>
          <button onClick={handleDuplicateClick}>Duplicate</button>
        </CardContainer>
      )}
    </Draggable>
  );
};

Card.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onRemoveCard: PropTypes.func.isRequired,
  onDuplicateCard: PropTypes.func.isRequired,
};

export default Card;
