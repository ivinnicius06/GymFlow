import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Exercise } from '../../types/exercise';
import { colors } from './colors';

export function ExercisePhoto({
  uri,
  resizeMode = 'cover',
}: {
  uri: string | null;
  resizeMode?: 'cover' | 'contain';
}) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  if (uri && uri !== failedUri) {
    return (
      <Image
        source={{ uri }}
        resizeMode={resizeMode}
        style={styles.photo}
        onError={() => setFailedUri(uri)}
      />
    );
  }
  return (
    <MaterialCommunityIcons name="dumbbell" size={28} color={colors.green} />
  );
}

export function ExerciseCard({
  exercise,
  favorite,
  favoritesReady,
  onOpen,
  onFavorite,
}: {
  exercise: Exercise;
  favorite: boolean;
  favoritesReady: boolean;
  onOpen: () => void;
  onFavorite: () => void;
}) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Ver detalhes de ${exercise.name}`}
        onPress={onOpen}
        style={styles.main}
      >
        <View style={styles.thumbnail}>
          <ExercisePhoto uri={exercise.photoUrl} />
        </View>
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2}>
            {exercise.name}
          </Text>
          <Text style={styles.group} numberOfLines={1}>
            {exercise.muscleGroup}
          </Text>
          <Text style={styles.equipment} numberOfLines={1}>
            {exercise.equipment}
          </Text>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          favorite
            ? `Remover ${exercise.name} dos favoritos`
            : `Favoritar ${exercise.name}`
        }
        accessibilityState={{ selected: favorite }}
        disabled={!favoritesReady}
        onPress={onFavorite}
        style={[styles.star, favorite && styles.starOn]}
      >
        <MaterialCommunityIcons
          name={favorite ? 'star' : 'star-outline'}
          size={21}
          color={favorite ? colors.green : colors.muted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 94,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: 10,
  },
  main: {
    flex: 1,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
  },
  thumbnail: {
    width: 76,
    height: 74,
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.pale,
  },
  photo: { width: '100%', height: '100%' },
  details: { flex: 1, gap: 3 },
  name: { color: colors.text, fontSize: 16, fontWeight: '700', lineHeight: 20 },
  group: { color: colors.green, fontSize: 13, fontWeight: '700' },
  equipment: { color: colors.muted, fontSize: 12 },
  star: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starOn: { backgroundColor: colors.pale },
});
