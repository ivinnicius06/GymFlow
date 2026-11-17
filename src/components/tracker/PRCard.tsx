import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  muscleGroup: string;
  weight: number;
  reps: number;
  date: string;
  gainKg: number;
}

interface PRCardProps {
  pr: PersonalRecord;
}

export const PRCard: React.FC<PRCardProps> = ({ pr }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name="trophy" size={24} color="#FBBF24" />
      </View>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.exerciseName}>{pr.exerciseName}</Text>
          <View style={styles.gainBadge}>
            <Feather name="trending-up" size={12} color="#16A34A" />
            <Text style={styles.gainText}>+{pr.gainKg}kg</Text>
          </View>
        </View>

        <Text style={styles.muscleGroup}>{pr.muscleGroup}</Text>

        <View style={styles.statsRow}>
          <Text style={styles.recordStats}>
            <Text style={styles.weightNumber}>{pr.weight}</Text> kg × {pr.reps} reps
          </Text>
          <Text style={styles.dateText}>{pr.date}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#161F1B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#23322B',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  gainBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  gainText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
  },
  muscleGroup: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordStats: {
    fontSize: 13,
    color: '#D1D5DB',
  },
  weightNumber: {
    color: '#16A34A',
    fontWeight: '800',
    fontSize: 15,
  },
  dateText: {
    fontSize: 11,
    color: '#6B7280',
  },
});
