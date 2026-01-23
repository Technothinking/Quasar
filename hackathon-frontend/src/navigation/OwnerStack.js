import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OwnerLoginScreen from '../screens/owner/OwnerLoginScreen';
import OwnerHomeScreen from '../screens/owner/OwnerHomeScreen';
import ProjectDashboardScreen from '../screens/owner/ProjectDashboardScreen';
import InformationScreen from '../screens/owner/InformationScreen';
import TaskScreen from '../screens/owner/TaskScreen';
import StockOverviewScreen from '../screens/owner/StockOverviewScreen';
import GSTIncoices from '../screens/owner/GSTInvoices';


const Stack = createNativeStackNavigator();

export default function OwnerStack() {
  return (
    <Stack.Navigator>
      {/* Owner Login */}
      <Stack.Screen
        name="OwnerLogin"
        component={OwnerLoginScreen}
        options={{ title: 'Owner Login' }}
      />
      {/* Owner Home */}
      <Stack.Screen
        name="OwnerHome"
        component={OwnerHomeScreen}
        options={{ title: 'Projects' }}
      />

      {/* Project Dashboard */}
      <Stack.Screen
        name="OwnerProjectDashboard"
        component={ProjectDashboardScreen}
        options={{ title: 'Project Dashboard' }}
      />

      {/* Information Screen */}
      <Stack.Screen
        name="Information"
        component={InformationScreen}
        options={{ title: 'Project Information' }}
      />

      {/* Task Assignment Screen */}
      <Stack.Screen
        name="TaskAssignment"
        component={TaskScreen}
        options={{ title: 'Task Assignment' }}
      />

      {/* Stock Overview Screen */}
      <Stack.Screen
        name="StockOverview"
        component={StockOverviewScreen}
        options={{ title: 'Stock Overview' }}
      />

      {/* GST Invoices Screen */}
      <Stack.Screen
        name="GSTInvoices"
        component={GSTIncoices}
        options={{ title: 'GST Invoices' }}
      />
    </Stack.Navigator>
  );
}
