import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  cardBackground: string;
  buttonBackground: string;
  buttonText: string;
  headerBackground: string;
  headerText: string;
  borderColor: string;
  calendarBackground: string;
  statusBarColor: string;
}

export const themes: Record<string, ThemeColors> = {
  default: {
    primary: '#2196F3',
    secondary: '#4CAF50',
    background: '#F5F5F5',
    text: '#333333',
    cardBackground: '#FFFFFF',
    buttonBackground: '#2196F3',
    buttonText: '#FFFFFF',
    headerBackground: '#2196F3',
    headerText: '#FFFFFF',
    borderColor: '#DDDDDD',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#2196F3'
  },
  dark: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#121212',
    text: '#FFFFFF',
    cardBackground: '#1E1E1E',
    buttonBackground: '#BB86FC',
    buttonText: '#000000',
    headerBackground: '#1E1E1E',
    headerText: '#FFFFFF',
    borderColor: '#333333',
    calendarBackground: '#1E1E1E',
    statusBarColor: '#000000'
  },
  nature: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    background: '#E8F5E9',
    text: '#1B5E20',
    cardBackground: '#FFFFFF',
    buttonBackground: '#4CAF50',
    buttonText: '#FFFFFF',
    headerBackground: '#2E7D32',
    headerText: '#FFFFFF',
    borderColor: '#A5D6A7',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#2E7D32'
  },
  ocean: {
    primary: '#0288D1',
    secondary: '#03A9F4',
    background: '#E1F5FE',
    text: '#01579B',
    cardBackground: '#FFFFFF',
    buttonBackground: '#0288D1',
    buttonText: '#FFFFFF',
    headerBackground: '#0277BD',
    headerText: '#FFFFFF',
    borderColor: '#81D4FA',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#0277BD'
  },
  sunset: {
    primary: '#FF5722',
    secondary: '#FF9800',
    background: '#FBE9E7',
    text: '#BF360C',
    cardBackground: '#FFFFFF',
    buttonBackground: '#FF5722',
    buttonText: '#FFFFFF',
    headerBackground: '#E64A19',
    headerText: '#FFFFFF',
    borderColor: '#FFCCBC',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#E64A19'
  },
  lavender: {
    primary: '#9C27B0',
    secondary: '#BA68C8',
    background: '#F3E5F5',
    text: '#4A148C',
    cardBackground: '#FFFFFF',
    buttonBackground: '#9C27B0',
    buttonText: '#FFFFFF',
    headerBackground: '#7B1FA2',
    headerText: '#FFFFFF',
    borderColor: '#E1BEE7',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#7B1FA2'
  },
  mint: {
    primary: '#009688',
    secondary: '#4DB6AC',
    background: '#E0F2F1',
    text: '#004D40',
    cardBackground: '#FFFFFF',
    buttonBackground: '#009688',
    buttonText: '#FFFFFF',
    headerBackground: '#00796B',
    headerText: '#FFFFFF',
    borderColor: '#B2DFDB',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#00796B'
  },
  rose: {
    primary: '#E91E63',
    secondary: '#F06292',
    background: '#FCE4EC',
    text: '#880E4F',
    cardBackground: '#FFFFFF',
    buttonBackground: '#E91E63',
    buttonText: '#FFFFFF',
    headerBackground: '#C2185B',
    headerText: '#FFFFFF',
    borderColor: '#F8BBD0',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#C2185B'
  },
  gold: {
    primary: '#FFC107',
    secondary: '#FFD54F',
    background: '#FFF8E1',
    text: '#FF6F00',
    cardBackground: '#FFFFFF',
    buttonBackground: '#FFC107',
    buttonText: '#000000',
    headerBackground: '#FFA000',
    headerText: '#000000',
    borderColor: '#FFE082',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#FFA000'
  },
  slate: {
    primary: '#607D8B',
    secondary: '#90A4AE',
    background: '#ECEFF1',
    text: '#263238',
    cardBackground: '#FFFFFF',
    buttonBackground: '#607D8B',
    buttonText: '#FFFFFF',
    headerBackground: '#455A64',
    headerText: '#FFFFFF',
    borderColor: '#CFD8DC',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#455A64'
  },
  cherry: {
    primary: '#D32F2F',
    secondary: '#E57373',
    background: '#FFEBEE',
    text: '#B71C1C',
    cardBackground: '#FFFFFF',
    buttonBackground: '#D32F2F',
    buttonText: '#FFFFFF',
    headerBackground: '#C62828',
    headerText: '#FFFFFF',
    borderColor: '#FFCDD2',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#C62828'
  },
  forest: {
    primary: '#388E3C',
    secondary: '#81C784',
    background: '#E8F5E9',
    text: '#1B5E20',
    cardBackground: '#FFFFFF',
    buttonBackground: '#388E3C',
    buttonText: '#FFFFFF',
    headerBackground: '#2E7D32',
    headerText: '#FFFFFF',
    borderColor: '#C8E6C9',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#2E7D32'
  },
  midnight: {
    primary: '#3F51B5',
    secondary: '#7986CB',
    background: '#E8EAF6',
    text: '#1A237E',
    cardBackground: '#FFFFFF',
    buttonBackground: '#3F51B5',
    buttonText: '#FFFFFF',
    headerBackground: '#303F9F',
    headerText: '#FFFFFF',
    borderColor: '#C5CAE9',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#303F9F'
  },
  coral: {
    primary: '#FF7043',
    secondary: '#FFB74D',
    background: '#FBE9E7',
    text: '#BF360C',
    cardBackground: '#FFFFFF',
    buttonBackground: '#FF7043',
    buttonText: '#FFFFFF',
    headerBackground: '#E64A19',
    headerText: '#FFFFFF',
    borderColor: '#FFCCBC',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#E64A19'
  },
  arctic: {
    primary: '#00BCD4',
    secondary: '#4DD0E1',
    background: '#E0F7FA',
    text: '#006064',
    cardBackground: '#FFFFFF',
    buttonBackground: '#00BCD4',
    buttonText: '#FFFFFF',
    headerBackground: '#0097A7',
    headerText: '#FFFFFF',
    borderColor: '#B2EBF2',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#0097A7'
  }
};

interface ThemeState {
  currentTheme: string;
  colors: ThemeColors;
}

const initialState: ThemeState = {
  currentTheme: 'default',
  colors: themes.default
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<string>) => {
      state.currentTheme = action.payload;
      state.colors = themes[action.payload];
    }
  }
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;