import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';

import ManagerStack from './ManagerStack';
import OwnerStack from './OwnerStack';
import SupervisorStack from './SupervisorStack';
import WorkerStack from './WorkerStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* App entry */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

      {/* Role-based stacks */}
      <Stack.Screen name="ManagerStack" component={ManagerStack} />
      <Stack.Screen name="OwnerStack" component={OwnerStack} />
      <Stack.Screen name="SupervisorStack" component={SupervisorStack} />
      <Stack.Screen name="WorkerStack" component={WorkerStack} />
    </Stack.Navigator>
  );
}
