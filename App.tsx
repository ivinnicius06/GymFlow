import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { WelcomeScreen } from './src/screens/auth/LoginScreen';
import { AppNavigator } from './src/navigation/AppNavigator';

function MainNavigator() {
  const { session, isGuest, initialLoading } = useAuth();

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (session || isGuest) {
    return <AppNavigator />;
  }

  return <WelcomeScreen />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <MainNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0E1311',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
