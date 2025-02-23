import { Text, View } from 'react-native';
import React from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';  // ✅ Redux Theme Selector
import { themes } from '@/hooks/themeSlice';
import ThemeSelector from '../ThemeSelector';

export default function Profile() {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const themeColors = themes[currentTheme] || themes.default; // Get colors from Redux theme

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.background, padding: 20 }}>
      <Text style={{ color: themeColors.text, fontSize: 18 }}>Profile</Text>
      <ThemeSelector />
    </View>
  );
}
