import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setTheme } from './themeSlice';

export const useTheme = () => {
  const dispatch = useDispatch();
  const { colors, currentTheme } = useSelector((state: RootState) => state.theme);

  const changeTheme = (themeName: string) => {
    dispatch(setTheme(themeName));
  };

  return { colors, currentTheme, changeTheme };
};