import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { MainTabParamList } from '../../navigation/navigationTypes';
import { ProgressBar } from '../../components/tracker/ProgressBar';
import { SeriesGrid, WorkoutExerciseItem } from '../../components/tracker/SeriesGrid';
import { RestTimerDisplay } from '../../components/tracker/RestTimerDisplay';
import { useRestTimer } from '../../hooks/useRestTimer';
import { requestNotificationPermissions } from '../../services/notifications';
import { supabase } from '../../services/supabase';

const ACTIVE_WORKOUT_STORAGE_KEY = '@gymflow_active_workout_state';
const WORKOUT_HISTORY_STORAGE_KEY = '@gymflow_workout_history';

// Treino A Padrão (Figma Screen 08)
const INITIAL_EXERCISES: WorkoutExerciseItem[] = [
  {
    id: 'ex-1',
    name: 'Supino Reto Barra',
    muscleGroup: 'Peitoral',
    sets: [
      { id: 's-1-1', setNumber: 1, previousWeight: 70, previousReps: 10, weight: 70, reps: 10, completed: false },
      { id: 's-1-2', setNumber: 2, previousWeight: 75, previousReps: 8, weight: 75, reps: 8, completed: false },
      { id: 's-1-3', setNumber: 3, previousWeight: 80, previousReps: 6, weight: 80, reps: 6, completed: false },
      { id: 's-1-4', setNumber: 4, previousWeight: 80, previousReps: 6, weight: 80, reps: 6, completed: false },
    ],
  },
  {
    id: 'ex-2',
    name: 'Supino Inclinado c/ Halteres',
    muscleGroup: 'Peitoral',
    sets: [
      { id: 's-2-1', setNumber: 1, previousWeight: 28, previousReps: 12, weight: 28, reps: 12, completed: false },
      { id: 's-2-2', setNumber: 2, previousWeight: 30, previousReps: 10, weight: 30, reps: 10, completed: false },
      { id: 's-2-3', setNumber: 3, previousWeight: 32, previousReps: 8, weight: 32, reps: 8, completed: false },
    ],
  },
  {
    id: 'ex-3',
    name: 'Crucifixo na Máquina',
    muscleGroup: 'Peitoral',
    sets: [
      { id: 's-3-1', setNumber: 1, previousWeight: 60, previousReps: 12, weight: 60, reps: 12, completed: false },
      { id: 's-3-2', setNumber: 2, previousWeight: 65, previousReps: 10, weight: 65, reps: 10, completed: false },
      { id: 's-3-3', setNumber: 3, previousWeight: 65, previousReps: 10, weight: 65, reps: 10, completed: false },
    ],
  },
  {
    id: 'ex-4',
    name: 'Tríceps Corda Pulley',
    muscleGroup: 'Tríceps',
    sets: [
      { id: 's-4-1', setNumber: 1, previousWeight: 35, previousReps: 12, weight: 35, reps: 12, completed: false },
      { id: 's-4-2', setNumber: 2, previousWeight: 40, previousReps: 10, weight: 40, reps: 10, completed: false },
      { id: 's-4-3', setNumber: 3, previousWeight: 40, previousReps: 10, weight: 40, reps: 10, completed: false },
    ],
  },
];

interface ActiveWorkoutScreenProps {
  workoutName?: string;
  onFinishWorkout?: () => void;
  onCancelWorkout?: () => void;
}

export const ActiveWorkoutScreen: React.FC<ActiveWorkoutScreenProps> = ({
  workoutName: workoutNameProp = 'Treino A - Peito & Tríceps',
  onFinishWorkout,
  onCancelWorkout,
}) => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainTabParamList, 'WorkoutsTab'>>();
  const workoutName = route.params?.workoutTitle ?? workoutNameProp;
  const [exercises, setExercises] = useState<WorkoutExerciseItem[]>(INITIAL_EXERCISES);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning] = useState<boolean>(true);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  // Hook do Cronômetro de Descanso (Integrante 4)
  const {
    remainingSeconds,
    isActive: isRestActive,
    startTimer: startRestTimer,
    togglePause: togglePauseRest,
    skipTimer: skipRestTimer,
    addSeconds: addRestSeconds,
  } = useRestTimer({
    defaultDuration: 60,
    onTimerComplete: () => {
      // Callback ao terminar descanso
    },
  });

  // Pedir permissão de notificações ao abrir a tela
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Recupera treino ativo salvo no AsyncStorage se existir
  useEffect(() => {
    const loadSavedState = async () => {
      try {
        const saved = await AsyncStorage.getItem(ACTIVE_WORKOUT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.exercises && parsed.exercises.length > 0) {
            setExercises(parsed.exercises);
          }
          if (typeof parsed.elapsedSeconds === 'number') {
            setElapsedSeconds(parsed.elapsedSeconds);
          }
        }
      } catch (err) {
        console.warn('Erro ao carregar estado do treino:', err);
      }
    };
    loadSavedState();
  }, []);

  // Salva no AsyncStorage sempre que houver alteração
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(
          ACTIVE_WORKOUT_STORAGE_KEY,
          JSON.stringify({ exercises, elapsedSeconds })
        );
      } catch (err) {
        console.warn('Erro ao salvar estado do treino:', err);
      }
    };
    saveState();
  }, [exercises, elapsedSeconds]);

  // Cronômetro geral do treino
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatElapsed = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Cálculo de progresso de séries
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );

  // Manipulação de séries
  const handleToggleSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => {
            if (s.id !== setId) return s;
            const nextCompleted = !s.completed;
            // Se marcou como concluído, dispara o cronômetro de descanso automaticamente!
            if (nextCompleted) {
              startRestTimer(60);
            }
            return { ...s, completed: nextCompleted };
          }),
        };
      })
    );
  };

  const handleUpdateWeight = (exerciseId: string, setId: string, weight: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, weight } : s)),
        };
      })
    );
  };

  const handleUpdateReps = (exerciseId: string, setId: string, reps: number) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s) => (s.id === setId ? { ...s, reps } : s)),
        };
      })
    );
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const lastSet = ex.sets[ex.sets.length - 1];
        const newSet = {
          id: `s-${ex.id}-${Date.now()}`,
          setNumber: ex.sets.length + 1,
          previousWeight: lastSet ? lastSet.weight : 20,
          previousReps: lastSet ? lastSet.reps : 10,
          weight: lastSet ? lastSet.weight : 20,
          reps: lastSet ? lastSet.reps : 10,
          completed: false,
        };
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    );
  };

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        return {
          ...ex,
          sets: ex.sets.filter((s) => s.id !== setId),
        };
      })
    );
  };

  // Descartar Treino
  const handleDiscard = () => {
    Alert.alert(
      'Descartar Treino?',
      'Todo o progresso deste treino atual será perdido.',
      [
        { text: 'Continuar Treinando', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY);
            setExercises(INITIAL_EXERCISES);
            setElapsedSeconds(0);
            if (onCancelWorkout) {
              onCancelWorkout();
            } else {
              navigation.navigate('HomeTab');
            }
          },
        },
      ]
    );
  };

  // Finalizar Treino
  const handleFinish = async () => {
    if (completedSets === 0) {
      Alert.alert(
        'Nenhuma série concluída',
        'Conclua ao menos uma série antes de finalizar o treino.'
      );
      return;
    }

    setIsFinishing(true);

    const sessionSummary = {
      id: `session-${Date.now()}`,
      workoutName,
      date: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalSets,
      completedSets,
      exercises,
    };

    try {
      // 1. Salvar no histórico local do AsyncStorage
      const historyRaw = await AsyncStorage.getItem(WORKOUT_HISTORY_STORAGE_KEY);
      const history = historyRaw ? JSON.parse(historyRaw) : [];
      history.unshift(sessionSummary);
      await AsyncStorage.setItem(WORKOUT_HISTORY_STORAGE_KEY, JSON.stringify(history));

      // 2. Limpar o estado do treino ativo
      await AsyncStorage.removeItem(ACTIVE_WORKOUT_STORAGE_KEY);

      // 3. Tentar sincronizar com Supabase se a tabela existir
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await supabase.from('workout_sessions').insert({
            user_id: session.user.id,
            workout_name: workoutName,
            duration_seconds: elapsedSeconds,
            completed_sets: completedSets,
            total_sets: totalSets,
            created_at: new Date().toISOString(),
          });
        }
      } catch (sbErr) {
        // Falha silenciosa no supabase se offline ou tabela ainda não criada
        console.log('Supabase sync skipped/offline:', sbErr);
      }

      Alert.alert(
        '🎉 Parabéns!',
        `Treino concluído com sucesso em ${formatElapsed(elapsedSeconds)}!\n${completedSets} de ${totalSets} séries realizadas.`,
        [
          {
            text: 'Excelente!',
            onPress: () => {
              setExercises(INITIAL_EXERCISES);
              setElapsedSeconds(0);
              if (onFinishWorkout) {
                onFinishWorkout();
              } else {
                navigation.navigate('HomeTab');
              }
            },
          },
        ]
      );
    } catch (err) {
      console.warn('Erro ao salvar treino:', err);
      Alert.alert('Erro', 'Não foi possível salvar o treino.');
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.discardButton} onPress={handleDiscard}>
          <Feather name="x" size={20} color="#EF4444" />
          <Text style={styles.discardText}>Descartar</Text>
        </TouchableOpacity>

        {/* Cronômetro Decorrido */}
        <View style={styles.timerPill}>
          <View style={styles.liveDot} />
          <Text style={styles.timerPillText}>{formatElapsed(elapsedSeconds)}</Text>
        </View>

        <TouchableOpacity
          style={[styles.finishButton, isFinishing && styles.finishButtonDisabled]}
          onPress={handleFinish}
          disabled={isFinishing}
        >
          <Feather name="check" size={16} color="#FFFFFF" />
          <Text style={styles.finishText}>Finalizar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Título do Treino */}
        <View style={styles.titleSection}>
          <Text style={styles.workoutTitle}>{workoutName}</Text>
          <Text style={styles.workoutSubtitle}>
            Acompanhe suas séries, cargas e descanso ao vivo.
          </Text>
        </View>

        {/* Barra de Progresso Verde (Componente Integrante 4) */}
        <ProgressBar completed={completedSets} total={totalSets} />

        {/* Visor de Descanso (Componente Integrante 4) */}
        {(isRestActive || remainingSeconds > 0) && (
          <RestTimerDisplay
            remainingSeconds={remainingSeconds}
            isActive={isRestActive}
            onAddSeconds={addRestSeconds}
            onSetPreset={(secs) => startRestTimer(secs)}
            onTogglePause={togglePauseRest}
            onSkip={skipRestTimer}
          />
        )}

        {/* Grid de Séries de Cada Exercício (Componente Integrante 4) */}
        {exercises.map((exercise) => (
          <SeriesGrid
            key={exercise.id}
            exercise={exercise}
            onToggleSet={handleToggleSet}
            onUpdateWeight={handleUpdateWeight}
            onUpdateReps={handleUpdateReps}
            onAddSet={handleAddSet}
            onRemoveSet={handleRemoveSet}
          />
        ))}

        {/* Botão de Finalizar no rodapé */}
        <TouchableOpacity
          style={styles.bottomFinishBtn}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <Feather name="check-circle" size={20} color="#FFFFFF" />
          <Text style={styles.bottomFinishText}>Concluir Treino</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E1311',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2924',
    backgroundColor: '#0E1311',
  },
  discardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discardText: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '600',
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161F1B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#23322B',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  timerPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F9FAFB',
    fontVariant: ['tabular-nums'],
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16A34A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  finishButtonDisabled: {
    opacity: 0.6,
  },
  finishText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  workoutTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  workoutSubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  bottomFinishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  bottomFinishText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
