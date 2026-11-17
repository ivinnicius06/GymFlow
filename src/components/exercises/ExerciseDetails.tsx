import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { isVideoUrl } from '../../types/exercise';
import type { Exercise } from '../../types/exercise';
import { ExercisePhoto } from './ExerciseCard';
import { ExerciseHeader } from './ExerciseHeader';
import { colors } from './colors';

export function ExerciseDetails({
  exercise,
  canEdit,
  saving,
  onClose,
  onEdit,
  onDelete,
}: {
  exercise: Exercise;
  canEdit: boolean;
  saving: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  const remove = async () => {
    setError('');
    try {
      await onDelete();
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : 'Não foi possível excluir o exercício.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ExerciseHeader
        title="Detalhes do exercício"
        onClose={onClose}
        disabled={saving}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photo}>
          <ExercisePhoto uri={exercise.photoUrl} resizeMode="contain" />
        </View>
        <View style={styles.identity}>
          <Text style={styles.group}>{exercise.muscleGroup}</Text>
          <Text accessibilityRole="header" style={styles.title}>
            {exercise.name}
          </Text>
          <Text style={styles.body}>{exercise.equipment}</Text>
        </View>
        <View style={styles.instructions}>
          <Text style={styles.label}>Instruções</Text>
          <Text style={styles.body}>
            {exercise.instructions || 'Nenhuma instrução cadastrada.'}
          </Text>
        </View>
        {isVideoUrl(exercise.videoUrl) && (
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Abrir vídeo explicativo"
            style={styles.action}
            onPress={() =>
              void Linking.openURL(exercise.videoUrl).catch(() =>
                setError('Não foi possível abrir o vídeo.'),
              )
            }
          >
            <Feather name="play-circle" size={19} color={colors.green} />
            <Text style={styles.actionText}>Abrir vídeo explicativo</Text>
          </Pressable>
        )}
        {canEdit && (
          <View style={styles.identity}>
            {confirmDelete && (
              <Text style={styles.label}>Excluir este exercício?</Text>
            )}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                style={styles.action}
                onPress={confirmDelete ? () => setConfirmDelete(false) : onEdit}
              >
                <Text style={styles.actionText}>
                  {confirmDelete ? 'Cancelar' : 'Editar'}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                style={[styles.action, styles.delete]}
                onPress={
                  confirmDelete
                    ? () => void remove()
                    : () => setConfirmDelete(true)
                }
              >
                <Text style={[styles.actionText, styles.error]}>
                  {saving
                    ? 'Excluindo…'
                    : confirmDelete
                      ? 'Confirmar exclusão'
                      : 'Excluir'}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        {!!error && (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            {error}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page },
  content: { padding: 18, gap: 16 },
  photo: {
    height: 208,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.pale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identity: { gap: 7 },
  title: { color: colors.text, fontSize: 27, fontWeight: '800' },
  group: { color: colors.green, fontWeight: '800' },
  label: { color: colors.text, fontWeight: '800', fontSize: 16 },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  instructions: {
    padding: 16,
    gap: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  actions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  action: {
    minHeight: 44,
    borderRadius: 11,
    paddingHorizontal: 13,
    backgroundColor: colors.pale,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  actionText: { color: colors.green, fontWeight: '700' },
  delete: { backgroundColor: colors.paleRed },
  error: { color: colors.red },
});
