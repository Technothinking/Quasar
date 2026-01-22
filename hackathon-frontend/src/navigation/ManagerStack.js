import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ManagerHomeScreen from '../screens/manager/ManagerHomeScreen';
import ProjectDashboardScreen from '../screens/manager/ProjectDashboardScreen';
import MaterialApprovalScreen from '../screens/manager/MaterialApprovalScreen';
import TaskAssignmentScreen from '../screens/manager/TaskAssignmentScreen';
import StockTrackingScreen from '../screens/manager/StockTrackingScreen';
import GSTInvoices from '../screens/manager/GSTInvoices';

const Stack = createNativeStackNavigator();

export default function ManagerStack() {
  return (
    <Stack.Navigator>
      {/* Manager Home */}
      <Stack.Screen
        name="ManagerHome"
        component={ManagerHomeScreen}
        options={{ title: 'Projects' }}
      />

      {/* Project Dashboard */}
      <Stack.Screen
        name="ManagerProjectDashboard"
        component={ProjectDashboardScreen}
        options={{ title: 'Project Dashboard' }}
      />

      {/* Material Approval */}
      <Stack.Screen
        name="MaterialApproval"
        component={MaterialApprovalScreen}
        options={{ title: 'Material Approval' }}
      />

      {/* Task Assignment */}
      <Stack.Screen
        name="TaskAssignment"
        component={TaskAssignmentScreen}
        options={{ title: 'Task Assignment' }}
      />

      {/* Stock Tracking */}
      <Stack.Screen
        name="StockTracking"
        component={StockTrackingScreen}
        options={{ title: 'Stock Tracking' }}
      />

      {/* GST Invoices */}
      <Stack.Screen
        name="GSTInvoices"
        component={GSTInvoices}
        options={{ title: 'GST Invoices' }}
      />
      
    </Stack.Navigator>
  );
}
