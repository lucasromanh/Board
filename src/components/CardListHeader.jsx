import PropTypes from 'prop-types';
import { CardListHeader as StyledCardListHeader } from '../styles/CardListStyles'; 
import OutsideClickHandler from './OutsideClickHandler';
import ContentEditable from './ContentEditable';
import IconButton from './IconButton';
import { useRef, useState, useEffect } from 'react';
import UtilsHelper from '../helpers/utils';

const CardListHeader = ({ listName, onChangeListName, onRemoveList, onDuplicateList }) => {
  const ref = useRef(null);
  const [onHover, setOnHover] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(listName);

  useEffect(() => {
    setName(listName);
  }, [listName]);

  const onClickSaveEdit = () => {
    if (editMode) {
      onChangeListName(name);
    }
    setEditMode((isEditing) => !isEditing);
  };

  useEffect(() => {
    if (editMode) {
      UtilsHelper.focusCursorToEnd(ref);
    }
  }, [editMode]);

  const onClickOutside = () => {
    setEditMode(false);
    onChangeListName(name);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.stopPropagation();
      e.preventDefault();
      setEditMode(false);
      ref.current.blur();
      const newName = ref.current.innerText;
      onChangeListName(newName);
    }
  };

  return (
    <OutsideClickHandler shouldListenClick={editMode} onClickOutside={onClickOutside}>
      <StyledCardListHeader
        onMouseEnter={() => setOnHover(true)}
        onMouseLeave={() => setOnHover(false)}
      >
        <ContentEditable
          innerRef={ref}
          html={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setEditMode(true)}
          onKeyDown={handleKeyDown}
          style={{ paddingRight: 24 }}
        />
        {(onHover || editMode) && (
          <IconButton.ButtonContainer $top="11px" $right={editMode ? '11px' : '42px'}>
            <IconButton
              onClick={onClickSaveEdit}
              iconType={editMode ? 'confirm' : 'edit'}
            />
          </IconButton.ButtonContainer>
        )}
        {onHover && !editMode && (
          <>
            <IconButton.ButtonContainer $top="11px" $right="22px">
              <IconButton onClick={onDuplicateList} iconType="copy" />
            </IconButton.ButtonContainer>
            <IconButton.ButtonContainer $top="11px" $right="3px">
              <IconButton onClick={onRemoveList} iconType="delete" />
            </IconButton.ButtonContainer>
          </>
        )}
      </StyledCardListHeader>
    </OutsideClickHandler>
  );
};

CardListHeader.propTypes = {
  listName: PropTypes.string.isRequired,
  onChangeListName: PropTypes.func.isRequired,
  onRemoveList: PropTypes.func.isRequired,
  onDuplicateList: PropTypes.func.isRequired,
};

export default CardListHeader;
