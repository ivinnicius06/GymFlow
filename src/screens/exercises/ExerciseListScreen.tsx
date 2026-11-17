import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../contexts/AuthContext';
import { useDebounce } from '../../hooks/useDebounce';
import { useExercises } from '../../hooks/useExercises';
import { ExerciseCard } from '../../components/exercises/ExerciseCard';
import { ExerciseDetails } from '../../components/exercises/ExerciseDetails';
import { colors } from '../../components/exercises/colors';
import { MUSCLE_GROUPS } from '../../types/exercise';
import type { Exercise, ExerciseFields } from '../../types/exercise';
import type { PhotoChange } from '../../services/exercises';
import type { MainTabParamList } from '../../navigation/navigationTypes';
import { NewExerciseScreen } from './NewExerciseScreen';

type Props = BottomTabScreenProps<MainTabParamList, 'ExercisesTab'>;
type Overlay =
  | { kind: 'details'; exercise: Exercise }
  | { kind: 'editor'; exercise: Exercise | null };

function normalize(value: string) {
  return value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

export function ExerciseListScreen(props: Props) {
  const { session } = useAuth();
  if (!session) return null;
  return (
    <ExerciseCatalog
      {...props}
      key={session.user.id}
      userId={session.user.id}
    />
  );
}

function ExerciseCatalog({
  route,
  navigation,
  userId,
}: Props & { userId: string }) {
  const {
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
  } = useExercises(userId);
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('Todos');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [localOverlay, setLocalOverlay] = useState<Overlay | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const mutationPending = useRef(false);
  const query = useDebounce(normalize(search), 220);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const fromDashboard = route.params?.openNewExercise;
  const overlay =
    localOverlay ??
    (fromDashboard ? { kind: 'editor' as const, exercise: null } : null);
  const close = () => {
    setLocalOverlay(null);
    if (fromDashboard) navigation.setParams({ openNewExercise: false });
  };

  const mutate = async (action: () => Promise<void>, message: string) => {
    if (mutationPending.current) return;
    mutationPending.current = true;
    setSaving(true);
    try {
      await action();
      close();
      setFeedback(message);
      void refresh();
    } finally {
      mutationPending.current = false;
      setSaving(false);
    }
  };

  const saveAndClose = (
    fields: ExerciseFields,
    existing: Exercise | null,
    photo: PhotoChange,
  ) => {
    return mutate(
      async () => {
        await save(fields, existing, photo);
        if (!existing) {
          setSearch('');
          setGroup('Todos');
          setFavoritesOnly(false);
        }
      },
      existing ? 'Exercício atualizado.' : 'Exercício cadastrado.',
    );
  };

  const offline = status === 'unavailable';
  const favoriteIds = new Set(favorites.map(({ id }) => id));
  const source = offline ? favorites : exercises;
  const groups = [
    'Todos',
    ...new Set([
      ...MUSCLE_GROUPS,
      ...source
        .map((item) => item.muscleGroup)
        .filter((item) => item && item !== 'Todos'),
    ]),
  ];
  const visible = source.filter(
    (item) =>
      (offline || !favoritesOnly || favoriteIds.has(item.id)) &&
      (group === 'Todos' || item.muscleGroup === group) &&
      normalize(item.name).includes(query),
  );

  const showFavorites = favoritesOnly || offline;
  const emptyMessage =
    search.trim() || group !== 'Todos'
      ? 'Nenhum exercício corresponde à busca.'
      : showFavorites
        ? 'Nenhum favorito salvo.'
        : 'Nenhum exercício cadastrado.';

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <View style={styles.mark}>
          <MaterialCommunityIcons name="dumbbell" size={23} color="#BCE7C9" />
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          Exercícios
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Novo exercício"
          style={styles.create}
          onPress={() => {
            setFeedback('');
            setLocalOverlay({ kind: 'editor', exercise: null });
          }}
        >
          <Feather name="plus" size={18} color={colors.dark} />
          <Text style={styles.createText}>Novo</Text>
        </Pressable>
      </View>
      <View style={styles.controls}>
        <View style={styles.search}>
          <Feather name="search" size={20} color={colors.green} />
          <TextInput
            accessibilityLabel="Buscar exercícios"
            placeholder="Buscar exercício pelo nome"
            placeholderTextColor="#63746A"
            value={search}
            returnKeyType="search"
            autoCorrect={false}
            onChangeText={(value) => {
              setSearch(value);
              setFeedback('');
            }}
            style={styles.searchInput}
          />
          {!!search && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              hitSlop={8}
              onPress={() => setSearch('')}
            >
              <Feather name="x" size={20} color={colors.muted} />
            </Pressable>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.filters}
        >
          {groups.map((item) => {
            const selected = item === group;
            return (
              <Pressable
                key={item}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => setGroup(item)}
                style={[styles.chip, selected && styles.chipOn]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextOn]}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.results}>
          <Text style={styles.count}>
            {visible.length === 1
              ? '1 exercício'
              : `${visible.length} exercícios`}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Favoritos"
            accessibilityState={{ selected: showFavorites }}
            disabled={offline || !favoritesReady}
            onPress={() => setFavoritesOnly((current) => !current)}
            style={[
              styles.chip,
              styles.favorites,
              showFavorites && styles.chipOn,
            ]}
          >
            <MaterialCommunityIcons
              name={showFavorites ? 'star' : 'star-outline'}
              size={17}
              color={colors.green}
            />
            <Text style={styles.favoriteText}>Favoritos</Text>
          </Pressable>
        </View>
        {offline && (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>
              Catálogo indisponível. Exibindo favoritos salvos neste aparelho.
            </Text>
            <Pressable
              accessibilityRole="button"
              disabled={refreshing}
              onPress={() => void refresh()}
            >
              <Text style={styles.retry}>Tentar novamente</Text>
            </Pressable>
          </View>
        )}
        {favoritesError && (
          <Text accessibilityLiveRegion="polite" style={styles.error}>
            Não foi possível acessar os favoritos neste aparelho.
          </Text>
        )}
        {!!feedback && (
          <Text accessibilityLiveRegion="polite" style={styles.feedback}>
            {feedback}
          </Text>
        )}
      </View>
      <FlatList
        data={visible}
        keyExtractor={({ id }) => id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refresh()}
            tintColor={colors.green}
          />
        }
        renderItem={({ item }) => (
          <ExerciseCard
            exercise={item}
            favorite={favoriteIds.has(item.id)}
            favoritesReady={favoritesReady}
            onOpen={() => {
              setFeedback('');
              setLocalOverlay({ kind: 'details', exercise: item });
            }}
            onFavorite={() => void toggleFavorite(item)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          status === 'loading' ||
          (offline && !favoritesReady && !favoritesError) ? (
            <ActivityIndicator
              accessibilityLabel="Carregando exercícios"
              color={colors.green}
              style={styles.empty}
            />
          ) : (
            <View style={styles.empty}>
              <MaterialCommunityIcons
                name={showFavorites ? 'star-outline' : 'dumbbell'}
                size={31}
                color={colors.green}
              />
              <Text style={styles.emptyText}>{emptyMessage}</Text>
            </View>
          )
        }
      />
      <Modal
        visible={Boolean(overlay)}
        animationType="slide"
        onRequestClose={() => {
          if (!mutationPending.current) close();
        }}
      >
        {overlay?.kind === 'editor' && (
          <NewExerciseScreen
            key={overlay.exercise?.id ?? 'novo'}
            exercise={overlay.exercise}
            saving={saving}
            onClose={close}
            onSave={saveAndClose}
          />
        )}
        {overlay?.kind === 'details' && (
          <ExerciseDetails
            key={overlay.exercise.id}
            exercise={overlay.exercise}
            saving={saving}
            canEdit={overlay.exercise.userId === userId && !offline}
            onClose={close}
            onEdit={() =>
              setLocalOverlay({ kind: 'editor', exercise: overlay.exercise })
            }
            onDelete={() =>
              mutate(() => remove(overlay.exercise), 'Exercício excluído.')
            }
          />
        )}
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.dark },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 17,
    backgroundColor: colors.dark,
  },
  mark: {
    width: 43,
    height: 43,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    backgroundColor: '#294738',
  },
  title: {
    flex: 1,
    fontSize: 29,
    fontWeight: '800',
    letterSpacing: -0.85,
    color: colors.white,
  },
  create: {
    minHeight: 43,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#B5E7B8',
  },
  createText: { color: colors.dark, fontSize: 15, fontWeight: '800' },
  controls: { backgroundColor: colors.page, paddingTop: 15, gap: 10 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 18,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.white,
  },
  searchInput: {
    flex: 1,
    minHeight: 45,
    paddingVertical: 8,
    color: colors.text,
    fontSize: 15,
  },
  filters: { paddingHorizontal: 18, gap: 6 },
  chip: {
    minHeight: 39,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
  chipOn: { borderColor: colors.green, backgroundColor: colors.pale },
  chipText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  chipTextOn: { color: colors.green, fontWeight: '800' },
  results: {
    marginHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: { color: colors.text, fontSize: 14, fontWeight: '800' },
  favorites: {
    minHeight: 34,
    paddingHorizontal: 9,
    gap: 5,
    flexDirection: 'row',
  },
  favoriteText: { color: colors.green, fontSize: 13, fontWeight: '700' },
  notice: {
    marginHorizontal: 18,
    padding: 10,
    gap: 5,
    borderRadius: 10,
    backgroundColor: colors.pale,
  },
  noticeText: { color: colors.text, fontSize: 13, lineHeight: 18 },
  retry: {
    paddingVertical: 4,
    color: colors.green,
    fontSize: 13,
    fontWeight: '700',
  },
  error: { marginHorizontal: 18, color: colors.red, fontSize: 13 },
  feedback: {
    marginHorizontal: 18,
    color: colors.green,
    fontSize: 13,
    fontWeight: '700',
  },
  list: { flex: 1, backgroundColor: colors.page },
  listContent: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 20 },
  separator: { height: 8 },
  empty: { marginTop: 32, alignItems: 'center', gap: 8, padding: 16 },
  emptyText: { color: colors.muted, fontSize: 15, textAlign: 'center' },
});
