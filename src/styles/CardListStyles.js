import styled from 'styled-components';

export const CardListContainer = styled.div`
  margin: 0 8px;
  background-color: ${(props) => props.theme.cardListBackground};
  border-radius: 3px;
  min-width: 300px;
`;

export const CardListWrapper = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  width: 300px;
`;

export const CardListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: ${(props) => props.theme.cardListHeaderBackground};
  border-bottom: 1px solid ${(props) => props.theme.cardListHeaderBorder};
`;

export const ButtonContainer = styled.div`
position: absolute;
top: ${(props) => props.$top || '2px'};
right: ${(props) => props.$right || '3px'};
`;
