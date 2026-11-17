import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total }) => {
  const [animatedWidth] = useState(() => new Animated.Value(0));
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progressPercent,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [progressPercent, animatedWidth]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Progresso do Treino</Text>
        <Text style={styles.counter}>
          <Text style={styles.bold}>{completed}</Text> / {total} séries ({progressPercent}%)
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width: widthInterpolation }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161F1B',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#23322B',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  counter: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  bold: {
    color: '#16A34A',
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: '#0E1311',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#16A34A',
    borderRadius: 4,
  },
});
