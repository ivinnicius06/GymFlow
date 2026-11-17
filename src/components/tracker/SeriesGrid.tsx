import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface ExerciseSet {
  id: string;
  setNumber: number;
  previousWeight?: number;
  previousReps?: number;
  weight: number;
  reps: number;
  completed: boolean;
}

export interface WorkoutExerciseItem {
  id: string;
  name: string;
  muscleGroup: string;
  notes?: string;
  sets: ExerciseSet[];
}

interface SeriesGridProps {
  exercise: WorkoutExerciseItem;
  onToggleSet: (exerciseId: string, setId: string) => void;
  onUpdateWeight: (exerciseId: string, setId: string, weight: number) => void;
  onUpdateReps: (exerciseId: string, setId: string, reps: number) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
}

export const SeriesGrid: React.FC<SeriesGridProps> = ({
  exercise,
  onToggleSet,
  onUpdateWeight,
  onUpdateReps,
  onAddSet,
  onRemoveSet,
}) => {
  return (
    <View style={styles.card}>
      {/* Cabeçalho do Exercício */}
      <View style={styles.exerciseHeader}>
        <View style={styles.titleInfo}>
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.muscleBadge}>{exercise.muscleGroup}</Text>
        </View>
        <TouchableOpacity
          style={styles.addSetHeaderBtn}
          onPress={() => onAddSet(exercise.id)}
        >
          <Feather name="plus" size={14} color="#16A34A" />
          <Text style={styles.addSetHeaderText}>Série</Text>
        </TouchableOpacity>
      </View>

      {/* Cabeçalho da Tabela */}
      <View style={styles.tableHeader}>
        <Text style={[styles.colHeader, styles.colSet]}>SET</Text>
        <Text style={[styles.colHeader, styles.colPrev]}>ANTERIOR</Text>
        <Text style={[styles.colHeader, styles.colInput]}>KG</Text>
        <Text style={[styles.colHeader, styles.colInput]}>REPS</Text>
        <Text style={[styles.colHeader, styles.colCheck]}>CHECK</Text>
      </View>

      {/* Linhas de Séries */}
      {exercise.sets.map((set, index) => {
        const isChecked = set.completed;
        return (
          <View
            key={set.id}
            style={[styles.setRow, isChecked && styles.setRowCompleted]}
          >
            {/* Número da Série */}
            <View style={styles.colSet}>
              <View style={[styles.setNumberBadge, isChecked && styles.setNumberBadgeDone]}>
                <Text style={[styles.setNumberText, isChecked && styles.setNumberTextDone]}>
                  {index + 1}
                </Text>
              </View>
            </View>

            {/* Anterior */}
            <View style={styles.colPrev}>
              <Text style={styles.prevText}>
                {set.previousWeight
                  ? `${set.previousWeight}kg × ${set.previousReps}`
                  : '—'}
              </Text>
            </View>

            {/* Input Carga (Kg) */}
            <View style={styles.colInput}>
              <TextInput
                style={[styles.inputBox, isChecked && styles.inputBoxChecked]}
                keyboardType="numeric"
                value={String(set.weight || '')}
                onChangeText={(val) => {
                  const num = parseFloat(val) || 0;
                  onUpdateWeight(exercise.id, set.id, num);
                }}
                placeholder="0"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Input Repetições */}
            <View style={styles.colInput}>
              <TextInput
                style={[styles.inputBox, isChecked && styles.inputBoxChecked]}
                keyboardType="numeric"
                value={String(set.reps || '')}
                onChangeText={(val) => {
                  const num = parseInt(val, 10) || 0;
                  onUpdateReps(exercise.id, set.id, num);
                }}
                placeholder="0"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Checkbox de Conclusão */}
            <View style={[styles.colCheck, styles.checkContainer]}>
              <TouchableOpacity
                style={[styles.checkBox, isChecked && styles.checkBoxDone]}
                activeOpacity={0.7}
                onPress={() => onToggleSet(exercise.id, set.id)}
              >
                {isChecked && <Feather name="check" size={16} color="#FFFFFF" />}
              </TouchableOpacity>

              {/* Botão de excluir série se houver mais de 1 */}
              {exercise.sets.length > 1 && !isChecked && (
                <TouchableOpacity
                  style={styles.deleteSetBtn}
                  onPress={() => onRemoveSet(exercise.id, set.id)}
                >
                  <Feather name="trash-2" size={13} color="#6B7280" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        );
      })}
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
    marginBottom: 16,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  muscleBadge: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  addSetHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(22, 163, 74, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  addSetHeaderText: {
    fontSize: 12,
    color: '#16A34A',
    fontWeight: '600',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#23322B',
    marginBottom: 6,
  },
  colHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  colSet: {
    width: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colPrev: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colInput: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colCheck: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 8,
    marginVertical: 2,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(22, 163, 74, 0.08)',
  },
  setNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#273830',
    alignItems: 'center',
    justifyContent: 'center',
  },
  setNumberBadgeDone: {
    backgroundColor: '#16A34A',
  },
  setNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  setNumberTextDone: {
    color: '#FFFFFF',
  },
  prevText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  inputBox: {
    backgroundColor: '#0E1311',
    borderWidth: 1,
    borderColor: '#23322B',
    borderRadius: 6,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    width: '85%',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  inputBoxChecked: {
    borderColor: '#16A34A',
    color: '#4ADE80',
  },
  checkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  checkBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0E1311',
  },
  checkBoxDone: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  deleteSetBtn: {
    padding: 4,
  },
});
