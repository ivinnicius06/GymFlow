import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { HomeScreen } from '../screens/dashboard/DashboardScreen';
import { SelectStudentScreen } from '../screens/builder/SelectStudentScreen';
import { ExerciseListScreen } from '../screens/exercises/ExerciseListScreen';
import { ActiveWorkoutScreen } from '../screens/tracker/ActiveWorkoutScreen';
import { ProgressScreen } from '../screens/tracker/ProgressScreen';
import type { MainTabParamList } from './navigationTypes';

const Tab = createBottomTabNavigator<MainTabParamList>();

const ACTIVE_COLOR = '#16A34A';
const INACTIVE_COLOR = '#6B7280';

function HomeTabScreen() {
  const { session, isGuest, signOut } = useAuth();
  return (
    <HomeScreen
      userEmail={session?.user?.email}
      isGuest={isGuest}
      onLogout={signOut}
    />
  );
}

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: ACTIVE_COLOR,
          tabBarInactiveTintColor: INACTIVE_COLOR,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopColor: '#E5E7EB',
            borderTopWidth: 1,
            elevation: 0,
            shadowOpacity: 0,
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeTabScreen}
          options={{
            tabBarLabel: 'Início',
            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="StudentsTab"
          component={SelectStudentScreen}
          options={{
            tabBarLabel: 'Alunos',
            tabBarIcon: ({ color, size }) => (
              <Feather name="users" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ExercisesTab"
          component={ExerciseListScreen}
          options={{
            tabBarLabel: 'Exercícios',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="dumbbell" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="WorkoutsTab"
          component={ActiveWorkoutScreen}
          options={{
            tabBarLabel: 'Treinos',
            tabBarIcon: ({ color, size }) => (
              <Feather name="calendar" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="ProgressTab"
          component={ProgressScreen}
          options={{
            tabBarLabel: 'Mais',
            tabBarIcon: ({ color, size }) => (
              <Feather name="more-horizontal" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
