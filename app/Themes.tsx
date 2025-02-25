import { View, Text, Button } from 'react-native';
import React from 'react';
import ThemeSelector from './ThemeSelector';
import { useNavigation } from '@react-navigation/native';


import { useAppSelector } from "@/hooks/useAppSelector";
import { themes } from "@/hooks/themeSlice";

export default function ThemeScreen() {
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const themeColors = themes[currentTheme] || themes.default;

  const navigation = useNavigation();

  return (
    <View style={[{ flex: 1, justifyContent: 'center', alignItems: 'center' }, {backgroundColor: themeColors.background}]}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Theme</Text>
      <ThemeSelector />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
