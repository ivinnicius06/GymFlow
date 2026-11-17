import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface RestTimerDisplayProps {
  remainingSeconds: number;
  isActive: boolean;
  onAddSeconds: (seconds: number) => void;
  onSetPreset: (seconds: number) => void;
  onTogglePause: () => void;
  onSkip: () => void;
}

export const RestTimerDisplay: React.FC<RestTimerDisplayProps> = ({
  remainingSeconds,
  isActive,
  onAddSeconds,
  onSetPreset,
  onTogglePause,
  onSkip,
}) => {
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="clock" size={16} color="#16A34A" />
          <Text style={styles.title}>Descanso entre Séries</Text>
        </View>
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.skipButton}>Pular</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.timerCenter}>
        <Text style={[styles.timerDigits, remainingSeconds <= 5 && styles.timerUrgent]}>
          {formatTime(remainingSeconds)}
        </Text>
        <TouchableOpacity
          style={[styles.pauseBtn, !isActive && styles.resumeBtn]}
          onPress={onTogglePause}
        >
          <Feather name={isActive ? 'pause' : 'play'} size={14} color="#FFFFFF" />
          <Text style={styles.pauseBtnText}>{isActive ? 'Pausar' : 'Retomar'}</Text>
        </TouchableOpacity>
      </View>

      {/* Presets rápidos */}
      <View style={styles.presetsRow}>
        <TouchableOpacity style={styles.presetChip} onPress={() => onSetPreset(60)}>
          <Text style={styles.presetText}>60s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => onSetPreset(90)}>
          <Text style={styles.presetText}>90s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.presetChip} onPress={() => onSetPreset(120)}>
          <Text style={styles.presetText}>120s</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addTimeChip} onPress={() => onAddSeconds(30)}>
          <Text style={styles.addTimeText}>+30s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161F1B',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#23322B',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  skipButton: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  timerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  timerDigits: {
    fontSize: 34,
    fontWeight: '800',
    color: '#16A34A',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  timerUrgent: {
    color: '#F59E0B',
  },
  pauseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#273830',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  resumeBtn: {
    backgroundColor: '#16A34A',
  },
  pauseBtnText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#0E1311',
    borderWidth: 1,
    borderColor: '#23322B',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  presetText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  addTimeChip: {
    flex: 1,
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    borderWidth: 1,
    borderColor: '#16A34A',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  addTimeText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '700',
  },
});
