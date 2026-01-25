import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SupervisorLoginScreen from '../screens/supervisor/SupervisorLoginScreen';
import SupervisorHomeScreen from '../screens/supervisor/SupervisorHomeScreen';
import ProjectDashboardScreen from '../screens/supervisor/ProjectDashboardScreen';

import DPRScreen from '../screens/supervisor/DPRScreen';
import AttendanceScreen from '../screens/supervisor/AttendanceScreen';
import MaterialScreen from '../screens/supervisor/MaterialScreen';
import IssueScreen from '../screens/supervisor/IssueScreen';
import SitePhotosScreen from '../screens/supervisor/SitePhotosScreen';
import TaskManagementScreen from '../screens/supervisor/TaskManagementScreen';
import StockUpdateScreen from '../screens/supervisor/StockUpdateScreen';
import GSTInvoices from '../screens/supervisor/GSTInvoices';
import CheckInOutScreen from '../screens/supervisor/CheckInOutScreen';
import TaskAssign from '../screens/supervisor/TaskAssign';
import StockVerificationScreen from '../screens/supervisor/StockVerificationScreen';

const Stack = createNativeStackNavigator();

export default function SupervisorStack() {
  return (
    <Stack.Navigator>
      {/* Supervisor Login */}
      <Stack.Screen
        name="SupervisorLogin"
        component={SupervisorLoginScreen}
        options={{ title: 'Supervisor Login' }}
      />

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
      <Stack.Screen name="SitePhotos" component={SitePhotosScreen} />
      <Stack.Screen name="TaskManagement" component={TaskManagementScreen} />
      <Stack.Screen name="StockUpdate" component={StockUpdateScreen} />
      <Stack.Screen name="GSTInvoices" component={GSTInvoices} />
      <Stack.Screen name="CheckInOut" component={CheckInOutScreen} />
      <Stack.Screen name="TaskAssign" component={TaskAssign} />
      <Stack.Screen name="StockVerification" component={StockVerificationScreen} />


    </Stack.Navigator>
  );
}
