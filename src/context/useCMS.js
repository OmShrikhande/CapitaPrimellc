import { useContext } from 'react';
import { CMSContext } from './CMSContextCore';

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};
