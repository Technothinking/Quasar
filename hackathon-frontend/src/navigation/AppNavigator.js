import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';

import ManagerStack from './ManagerStack';
import OwnerStack from './OwnerStack';
import SupervisorStack from './SupervisorStack';
import WorkerStack from './WorkerStack';

import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import SupervisorLoginScreen from '../screens/supervisor/SupervisorLoginScreen';
// Import other login screens if they exist or use placeholders

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, userToken, userRole } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0b0f14' }}>
        <ActivityIndicator size="large" color="#facc15" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken == null ? (
        // 🔐 Auth Stack
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
          <Stack.Screen name="SupervisorLogin" component={SupervisorLoginScreen} />
          {/* Add OwnerLogin, ManagerLogin, WorkerLogin here later */}
        </>
      ) : (
        // 🔓 App Stack (Role Based)
        <>
          {userRole === 1 && <Stack.Screen name="OwnerStack" component={OwnerStack} />}
          {userRole === 2 && <Stack.Screen name="ManagerStack" component={ManagerStack} />}
          {userRole === 3 && <Stack.Screen name="SupervisorStack" component={SupervisorStack} />}
          {userRole === 4 && <Stack.Screen name="WorkerStack" component={WorkerStack} />}
        </>
      )}
    </Stack.Navigator>
  );
}
