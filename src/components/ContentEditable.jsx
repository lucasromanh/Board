import styled from 'styled-components';
import ContentEditable from 'react-contenteditable';
import PropTypes from 'prop-types';

const StyledContentEditable = styled(ContentEditable)`
  border: none;
  outline: none;
  overflow: hidden;
  padding: 6px;
  &:focus {
    background-color: ${(props) => props.theme.focusGray};
  }
`;

StyledContentEditable.propTypes = {
  innerRef: PropTypes.object,
  html: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default StyledContentEditable;
