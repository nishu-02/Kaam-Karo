import { View, Text, Button } from 'react-native';
import React from 'react';
import ThemeSelector from './ThemeSelector';
import { useNavigation } from '@react-navigation/native';

export default function ThemeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Select Theme</Text>
      <ThemeSelector />
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
}
