import { useContext } from 'react';
import { TokenDetailContext } from './provider';

export const useTokenDetail = () => {
  const context = useContext(TokenDetailContext);

  if (context === null) {
    throw new Error('TokenDetailContext not found!');
  }

  return context;
};
