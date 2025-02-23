import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from './store';

// Typed selector hook for better TypeScript support
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
