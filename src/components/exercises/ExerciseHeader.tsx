import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors } from './colors';

export function ExerciseHeader({
  title,
  onClose,
  disabled,
}: {
  title: string;
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar ao catálogo"
        disabled={disabled}
        onPress={onClose}
        style={styles.back}
      >
        <Feather name="chevron-left" size={25} color={colors.text} />
      </Pressable>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    minHeight: 66,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: colors.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    color: colors.text,
    fontWeight: '800',
    fontSize: 24,
    letterSpacing: -0.55,
  },
});
