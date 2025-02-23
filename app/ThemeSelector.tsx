import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setTheme } from '../hooks/themeSlice';
import { themes } from '../hooks/themeSlice';

export default function ThemeSelector() {
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);

  const changeTheme = (themeName: string) => {
    dispatch(setTheme(themeName));
  };

  return (
    <View style={[styles.container, { backgroundColor: themes[currentTheme].background }]}>
      <Text style={[styles.title, { color: themes[currentTheme].text }]}>Select a Theme</Text>

      <FlatList
        data={Object.keys(themes)}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.themeButton,
              { backgroundColor: themes[item].primary, borderColor: themes[item].borderColor }
            ]}
            onPress={() => changeTheme(item)}
          >
            <Text style={[styles.buttonText, { color: themes[item].buttonText }]}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  themeButton: {
    width: 200,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
