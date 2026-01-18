import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';

import OwnerHomeScreen from '../screens/OwnerHomeScreen';
import ManagerHomeScreen from '../screens/ManagerHomeScreen';
import WorkerHomeScreen from '../screens/WorkerHomeScreen';

import SupervisorStack from './SupervisorStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />

      <Stack.Screen name="OwnerHome" component={OwnerHomeScreen} />
      <Stack.Screen name="ManagerHome" component={ManagerHomeScreen} />

      {/* ✅ SUPERVISOR STACK */}
      <Stack.Screen name="SupervisorStack" component={SupervisorStack} />

      <Stack.Screen name="WorkerHome" component={WorkerHomeScreen} />
    </Stack.Navigator>
  );
}
