import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WorkerHomeScreen from '../screens/worker/WorkerHomeScreen';
import GPSAttendance from '../screens/worker/GPSAttendance';
import VoiceUpdates from '../screens/worker/VoiceUpdates';
import TaskView from '../screens/worker/TaskView';
import PhotoUpload from '../screens/worker/PhotoUpload';

const Stack = createNativeStackNavigator();

export default function WorkerStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#0b0f14' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="WorkerHome"
        component={WorkerHomeScreen}
        options={{ title: 'Worker Dashboard' }}
      />

      <Stack.Screen name="GPSAttendance" component={GPSAttendance} />
      <Stack.Screen name="VoiceUpdates" component={VoiceUpdates} />
      <Stack.Screen name="TaskView" component={TaskView} />
      <Stack.Screen name="PhotoUpload" component={PhotoUpload} />
    </Stack.Navigator>
  );
}
