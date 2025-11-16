import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  HomeScreen,
  CreateTaskScreen,
  TaskDetailScreen,
  DebugScreen,
} from './src/screens';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FFFFFF',
            },
            headerTintColor: '#007AFF',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'Task Manager',
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="CreateTask"
            component={CreateTaskScreen}
            options={{
              title: 'Create Task',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{
              title: 'Task Details',
            }}
          />
          <Stack.Screen
            name="Debug"
            component={DebugScreen}
            options={{
              title: '🔧 Network Debug',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
