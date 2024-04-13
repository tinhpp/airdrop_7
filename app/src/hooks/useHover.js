import { useState } from 'react';
import useEventListener from './useEventListener';

export function useHover(elementRef, onHover, onNotHover) {
  const [value, setValue] = useState(false);

  const handleMouseEnter = () => {
    setValue(true);
    onHover?.();
  };
  const handleMouseLeave = () => {
    setValue(false);
    onNotHover?.();
  };

  useEventListener('mouseenter', handleMouseEnter, elementRef);
  useEventListener('mouseleave', handleMouseLeave, elementRef);

  return value;
}

export default useHover;
