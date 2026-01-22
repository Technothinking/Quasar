import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
}
