import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SupervisorHomeScreen from '../screens/supervisor/SupervisorHomeScreen';
import ProjectDashboardScreen from '../screens/supervisor/ProjectDashboardScreen';

import DPRScreen from '../screens/supervisor/DPRScreen';
import AttendanceScreen from '../screens/supervisor/AttendanceScreen';
import MaterialScreen from '../screens/supervisor/MaterialScreen';
import IssueScreen from '../screens/supervisor/IssueScreen';

const Stack = createNativeStackNavigator();

export default function SupervisorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SupervisorHome"
        component={SupervisorHomeScreen}
        options={{ title: 'Projects' }}
      />

      <Stack.Screen
        name="ProjectDashboard"
        component={ProjectDashboardScreen}
        options={{ title: 'Project Dashboard' }}
      />

      <Stack.Screen name="DPR" component={DPRScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Material" component={MaterialScreen} />
      <Stack.Screen name="Issue" component={IssueScreen} />
    </Stack.Navigator>
  );
}
