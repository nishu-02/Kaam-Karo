import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeColors {
  primary: string;
  secondary: string;
  secondaryText: string;
  background: string;
  text: string;
  cardBackground: string;
  card: string;
  buttonBackground: string;
  buttonText: string;
  headerBackground: string;
  headerText: string;
  borderColor: string;
  calendarBackground: string;
  statusBarColor: string;
  success: string;
  accent: string;
  warning: string;
}


export const themes: Record<string, ThemeColors> = {
  default: {
    primary: '#2196F3',
    secondary: '#4CAF50',
    background: '#F5F5F5',
    text: '#333333',
    secondaryText: '#555555',
    cardBackground: '#FFFFFF',
    card: '#EEEEEE',
    buttonBackground: '#2196F3',
    buttonText: '#FFFFFF',
    headerBackground: '#2196F3',
    headerText: '#FFFFFF',
    borderColor: '#DDDDDD',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#2196F3',
    accent: '#FFC107',
    warning: '#FF9800',
    success: '#bcfc1e'
  },
  dark: {
    primary: '#BB86FC',
    secondary: '#03DAC6',
    background: '#121212',
    text: '#FFFFFF',
    secondaryText: '#CCCCCC',
    cardBackground: '#1E1E1E',
    card: '#2A2A2A',
    buttonBackground: '#BB86FC',
    buttonText: '#000000',
    headerBackground: '#1E1E1E',
    headerText: '#FFFFFF',
    borderColor: '#333333',
    calendarBackground: '#1E1E1E',
    statusBarColor: '#000000',
    accent: '#FF4081',
    warning: '#FF5722'
  },
  nature: {
    primary: '#4CAF50',
    secondary: '#8BC34A',
    background: '#E8F5E9',
    text: '#1B5E20',
    secondaryText: '#388E3C',
    cardBackground: '#FFFFFF',
    card: '#C8E6C9',
    buttonBackground: '#4CAF50',
    buttonText: '#FFFFFF',
    headerBackground: '#2E7D32',
    headerText: '#FFFFFF',
    borderColor: '#A5D6A7',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#2E7D32',
    accent: '#FFD700',
    warning: '#F57C00'
  },
  ocean: {
    primary: '#0288D1',
    secondary: '#03A9F4',
    background: '#E1F5FE',
    text: '#01579B',
    secondaryText: '#0277BD',
    cardBackground: '#FFFFFF',
    card: '#B3E5FC',
    buttonBackground: '#0288D1',
    buttonText: '#FFFFFF',
    headerBackground: '#0277BD',
    headerText: '#FFFFFF',
    borderColor: '#81D4FA',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#0277BD',
    accent: '#00E5FF',
    warning: '#FFA726'
  },
  sunset: {
    primary: '#FF5722',
    secondary: '#FF9800',
    background: '#FBE9E7',
    text: '#BF360C',
    secondaryText: '#D84315',
    cardBackground: '#FFFFFF',
    card: '#FFCCBC',
    buttonBackground: '#FF5722',
    buttonText: '#FFFFFF',
    headerBackground: '#E64A19',
    headerText: '#FFFFFF',
    borderColor: '#FFAB91',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#E64A19',
    accent: '#FFD54F',
    warning: '#FF7043'
  },
  lavender: {
    primary: '#9C27B0',
    secondary: '#BA68C8',
    background: '#F3E5F5',
    text: '#4A148C',
    secondaryText: '#6A1B9A',
    cardBackground: '#FFFFFF',
    card: '#E1BEE7',
    buttonBackground: '#9C27B0',
    buttonText: '#FFFFFF',
    headerBackground: '#7B1FA2',
    headerText: '#FFFFFF',
    borderColor: '#D1C4E9',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#7B1FA2',
    accent: '#FF4081',
    warning: '#FFAB40'
  },
  mint: {
    primary: '#009688',
    secondary: '#4DB6AC',
    background: '#E0F2F1',
    text: '#004D40',
    secondaryText: '#00796B',
    cardBackground: '#FFFFFF',
    card: '#B2DFDB',
    buttonBackground: '#009688',
    buttonText: '#FFFFFF',
    headerBackground: '#00796B',
    headerText: '#FFFFFF',
    borderColor: '#B2DFDB',
    calendarBackground: '#FFFFFF',
    statusBarColor: '#00796B',
    accent: '#FFC107',
    warning: '#FF7043'
  },
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