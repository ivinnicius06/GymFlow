import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  listExercises,
  saveExercise,
  deleteExercise,
} from '../services/exercises';
import type { PhotoChange } from '../services/exercises';
import type { Exercise, ExerciseFields } from '../types/exercise';

type FavoriteUpdate = (previous: Exercise[]) => Exercise[];

export function useExercises(userId: string) {
  const key = `@GymFlow:exercise-favorites:${userId}`;
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [favorites, setFavorites] = useState<Exercise[]>([]);
  const [favoritesReady, setFavoritesReady] = useState(false);
  const [favoritesError, setFavoritesError] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'unavailable'>(
    'loading',
  );
  const [refreshing, setRefreshing] = useState(false);
  const readSequence = useRef(0);
  const cache = useRef<Exercise[]>([]);
  const writes = useRef(Promise.resolve());

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(key)
      .then((saved) => {
        if (!active) return;
        const records: unknown = saved ? JSON.parse(saved) : [];
        if (!Array.isArray(records)) throw new Error('Favoritos inválidos.');
        cache.current = records;
        setFavorites(records);
        setFavoritesReady(true);
      })
      .catch(() => {
        if (active) setFavoritesError(true);
      });
    return () => {
      active = false;
    };
  }, [key]);

  const updateFavorites = useCallback(
    (update: FavoriteUpdate) => {
      const write = writes.current.then(async () => {
        const next = update(cache.current);
        if (next === cache.current) return;
        // Cache exercise details without storing temporary signed URLs.
        await AsyncStorage.setItem(
          key,
          JSON.stringify(next.map((item) => ({ ...item, photoUrl: null }))),
        );
        cache.current = next;
        setFavorites(next);
        setFavoritesError(false);
      });
      writes.current = write.catch(() => setFavoritesError(true));
      return writes.current;
    },
    [key],
  );

  const refresh = useCallback(async () => {
    const sequence = ++readSequence.current;
    setRefreshing(true);
    try {
      const records = await listExercises(userId);
      if (sequence !== readSequence.current) return;
      setExercises(records);
      setStatus('ready');
    } catch {
      if (sequence === readSequence.current) setStatus('unavailable');
    } finally {
      if (sequence === readSequence.current) setRefreshing(false);
    }
  }, [userId]);

  const toggleFavorite = (exercise: Exercise) => {
    if (!favoritesReady) return;
    return updateFavorites((items) =>
      items.some((item) => item.id === exercise.id)
        ? items.filter((item) => item.id !== exercise.id)
        : [...items, exercise],
    );
  };

  const save = async (
    fields: ExerciseFields,
    current: Exercise | null,
    photo: PhotoChange,
  ) => {
    const saved = await saveExercise(userId, fields, current, photo);
    readSequence.current += 1;
    setRefreshing(false);
    setExercises((items) =>
      [...items.filter((item) => item.id !== saved.id), saved].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR'),
      ),
    );
    if (favoritesReady && current) {
      await updateFavorites((items) =>
        items.some((item) => item.id === saved.id)
          ? items.map((item) => (item.id === saved.id ? saved : item))
          : items,
      );
    }
  };

  const remove = async (exercise: Exercise) => {
    await deleteExercise(userId, exercise);
    readSequence.current += 1;
    setRefreshing(false);
    setExercises((items) => items.filter((item) => item.id !== exercise.id));
    if (favoritesReady) {
      await updateFavorites((items) =>
        items.some((item) => item.id === exercise.id)
          ? items.filter((item) => item.id !== exercise.id)
          : items,
      );
    }
  };

  return {
    exercises,
    favorites,
    favoritesReady,
    favoritesError,
    status,
    refreshing,
    refresh,
    toggleFavorite,
    save,
    remove,
  };
}
