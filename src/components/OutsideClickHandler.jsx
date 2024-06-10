import { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { randomId } from '../helpers/utils';

const OutsideClickHandler = ({ children, onClickOutside, shouldListenClick = true }) => {
  const id = useRef(randomId());
  const handleClickOutside = useCallback((e) => {
    if (!document.getElementById(id.current).contains(e.target)) {
      onClickOutside(e);
    }
  }, [onClickOutside]);

  useEffect(() => {
    if (shouldListenClick) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside, shouldListenClick]);

  return <div id={id.current}>{children}</div>;
};

OutsideClickHandler.propTypes = {
  children: PropTypes.node.isRequired,
  onClickOutside: PropTypes.func.isRequired,
  shouldListenClick: PropTypes.bool,
};

export default OutsideClickHandler;
