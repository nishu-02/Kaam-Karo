import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { themes } from '../hooks/themeSlice';

interface ThemeSelectorProps {
  visible: boolean;
  onClose: () => void;
}

export const ThemeSelector = ({ visible, onClose }: ThemeSelectorProps) => {
  const { changeTheme, currentTheme, colors } = useTheme();

  const handleThemeSelect = (themeName: string) => {
    changeTheme(themeName);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.content, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Select Theme
          </Text>
          <ScrollView style={styles.themeList}>
            {Object.entries(themes).map(([themeName, themeColors]) => (
              <TouchableOpacity
                key={themeName}
                style={[
                  styles.themeItem,
                  {
                    backgroundColor: themeColors.primary,
                    borderColor: themeName === currentTheme ? colors.text : 'transparent'
                  }
                ]}
                onPress={() => handleThemeSelect(themeName)}
              >
                <Text style={styles.themeText}>
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </Text>
                <View style={styles.colorPreview}>
                  {Object.values(themeColors).slice(0, 3).map((color, index) => (
                    <View
                      key={index}
                      style={[styles.colorSwatch, { backgroundColor: color }]}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.buttonBackground }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: colors.buttonText }]}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  content: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  themeList: {
    marginBottom: 20
  },
  themeItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  themeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500'
  },
  colorPreview: {
    flexDirection: 'row',
    gap: 5
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10
  },
  closeButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center'
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500'
  }
});