import { useDispatch } from 'react-redux';
import { AppDispatch } from './store';

// Typed dispatch hook for Redux actions
export const useAppDispatch = () => useDispatch<AppDispatch>();
