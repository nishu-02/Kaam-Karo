import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useAppSelector } from '@/hooks/useAppSelector';  // ✅ Redux Selector
import { themes } from '@/hooks/themeSlice';  // ✅ Import themes

export default function TabLayout() {
  // ✅ Get the current theme from Redux
  const currentTheme = useAppSelector((state) => state.theme.currentTheme);
  const themeColors = themes[currentTheme] || themes.default; // Fallback if undefined
  const navigationTheme = currentTheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    // ✅ Wrap the entire tab layout in ThemeProvider
    <ThemeProvider value={navigationTheme}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: themeColors.primary,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: {
            backgroundColor: themeColors.background,
            borderTopColor: themeColors.borderColor,
            ...Platform.select({
              ios: {
                position: 'absolute',
              },
              default: {},
            }),
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="Profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={color} />,
          }}
        />
      </Tabs>
    </ThemeProvider>
  );
}
