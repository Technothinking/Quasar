import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { LanguageProvider } from './src/context/LanguageContext';

import { initDB, getDB } from './src/db/sqlite';
import { startSyncEngine } from './src/db/syncEngine';

export default function App() {
  useEffect(() => {
    const boot = async () => {
      await initDB();
      console.log('📦 SQLite tables ready');

      // 🔍 TEMP: verify SQLite contents
      const db = await getDB();

      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table';"
      );

      const attendances = await db.getAllAsync(
        "SELECT * FROM attendances;"
      );

      const dprs = await db.getAllAsync(
        "SELECT * FROM dprs;"
      );

      const outbox = await db.getAllAsync(
        "SELECT * FROM outbox;"
      );

      console.log('🧪 TABLES:', tables);
      console.log('🧪 ATTENDANCES:', attendances);

      startSyncEngine();
      console.log('🚀 Sync engine started');
    };

    boot();
  }, []);

  return (
    <LanguageProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </LanguageProvider>
  );
}
