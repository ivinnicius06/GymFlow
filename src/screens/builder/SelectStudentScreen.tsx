import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const SelectStudentScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Alunos</Text>
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
