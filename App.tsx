import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { WelcomeScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';

function MainNavigator() {
  const { session, isGuest, initialLoading, signOut } = useAuth();

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (session || isGuest) {
    return (
      <HomeScreen
        userEmail={session?.user?.email}
        isGuest={isGuest}
        onLogout={signOut}
      />
    );
  }

  return <WelcomeScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainNavigator />
    </AuthProvider>
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
