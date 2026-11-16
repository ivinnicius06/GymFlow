import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 13,
    minHeight: 102,
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginBottom: 4,
  },
  value: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 30,
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
