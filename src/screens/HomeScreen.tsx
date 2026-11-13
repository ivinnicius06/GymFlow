import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';

interface HomeScreenProps {
  userEmail?: string;
  isGuest: boolean;
  onLogout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userEmail, isGuest, onLogout }) => {
  return (
    <View style={styles.container}>
      <Text>
        {isGuest ? 'Bem-vindo, Convidado!' : `Bem-vindo, ${userEmail}!`}
      </Text>
      <Button onPress={onLogout} title='Sair'/>
      <StatusBar style="dark" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
