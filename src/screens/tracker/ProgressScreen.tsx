import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { PRCard, PersonalRecord } from '../../components/tracker/PRCard';

type SubTab = 'evolucao' | 'medidas' | 'prs';

interface BodyMeasurement {
  id: string;
  date: string;
  weight: number;
  arm: number;
  chest: number;
  waist: number;
  thigh: number;
}

const INITIAL_PRS: PersonalRecord[] = [
  {
    id: 'pr-1',
    exerciseName: 'Supino Reto Barra',
    muscleGroup: 'Peitoral',
    weight: 100,
    reps: 3,
    date: '12 Nov 2026',
    gainKg: 10,
  },
  {
    id: 'pr-2',
    exerciseName: 'Agachamento Livre',
    muscleGroup: 'Pernas',
    weight: 140,
    reps: 5,
    date: '08 Nov 2026',
    gainKg: 15,
  },
  {
    id: 'pr-3',
    exerciseName: 'Levantamento Terra',
    muscleGroup: 'Costas / Posterior',
    weight: 160,
    reps: 3,
    date: '02 Nov 2026',
    gainKg: 10,
  },
  {
    id: 'pr-4',
    exerciseName: 'Desenvolvimento c/ Halteres',
    muscleGroup: 'Ombros',
    weight: 32,
    reps: 6,
    date: '28 Out 2026',
    gainKg: 4,
  },
];

// Dados dos gráficos por exercício
const CHART_DATA_SETS: Record<string, { value: number; label: string }[]> = {
  'Supino Reto': [
    { value: 70, label: 'Jul' },
    { value: 75, label: 'Ago' },
    { value: 80, label: 'Set' },
    { value: 85, label: 'Out' },
    { value: 92, label: 'Nov' },
    { value: 100, label: 'Atual' },
  ],
  'Agachamento': [
    { value: 100, label: 'Jul' },
    { value: 110, label: 'Ago' },
    { value: 120, label: 'Set' },
    { value: 125, label: 'Out' },
    { value: 135, label: 'Nov' },
    { value: 140, label: 'Atual' },
  ],
  'Lev. Terra': [
    { value: 120, label: 'Jul' },
    { value: 130, label: 'Ago' },
    { value: 140, label: 'Set' },
    { value: 145, label: 'Out' },
    { value: 155, label: 'Nov' },
    { value: 160, label: 'Atual' },
  ],
};

const INITIAL_MEASUREMENTS: BodyMeasurement[] = [
  { id: 'm-1', date: '15 Nov 2026', weight: 78.5, arm: 39.0, chest: 104, waist: 82, thigh: 60 },
  { id: 'm-2', date: '01 Nov 2026', weight: 77.8, arm: 38.5, chest: 103, waist: 83, thigh: 59.5 },
  { id: 'm-3', date: '15 Out 2026', weight: 77.0, arm: 38.0, chest: 102, waist: 84, thigh: 59 },
];

export const ProgressScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SubTab>('evolucao');
  const [selectedExercise, setSelectedExercise] = useState<string>('Supino Reto');
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>(INITIAL_MEASUREMENTS);
  const [prs] = useState<PersonalRecord[]>(INITIAL_PRS);

  // Modal de Nova Medida
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newArm, setNewArm] = useState('');
  const [newChest, setNewChest] = useState('');
  const [newWaist, setNewWaist] = useState('');
  const [newThigh, setNewThigh] = useState('');

  const handleSaveMeasurement = () => {
    if (!newWeight) {
      Alert.alert('Campo obrigatório', 'Informe ao menos o seu peso atual.');
      return;
    }

    const newRecord: BodyMeasurement = {
      id: `m-${Date.now()}`,
      date: 'Hoje',
      weight: parseFloat(newWeight) || 0,
      arm: parseFloat(newArm) || 0,
      chest: parseFloat(newChest) || 0,
      waist: parseFloat(newWaist) || 0,
      thigh: parseFloat(newThigh) || 0,
    };

    setMeasurements([newRecord, ...measurements]);
    setIsModalOpen(false);
    setNewWeight('');
    setNewArm('');
    setNewChest('');
    setNewWaist('');
    setNewThigh('');
    Alert.alert('Sucesso', 'Nova medição registrada com sucesso!');
  };

  const chartData = CHART_DATA_SETS[selectedExercise] || CHART_DATA_SETS['Supino Reto'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progresso & PRs</Text>
          <Text style={styles.subtitle}>
            Acompanhe sua evolução física, métricas e recordes pessoais.
          </Text>
        </View>

        {/* Sub-Abas Segmentadas */}
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'evolucao' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('evolucao')}
          >
            <Feather
              name="trending-up"
              size={14}
              color={activeTab === 'evolucao' ? '#16A34A' : '#9CA3AF'}
            />
            <Text
              style={[styles.segmentText, activeTab === 'evolucao' && styles.segmentTextActive]}
            >
              Evolução
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'medidas' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('medidas')}
          >
            <MaterialCommunityIcons
              name="tape-measure"
              size={15}
              color={activeTab === 'medidas' ? '#16A34A' : '#9CA3AF'}
            />
            <Text
              style={[styles.segmentText, activeTab === 'medidas' && styles.segmentTextActive]}
            >
              Medidas
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'prs' && styles.segmentBtnActive]}
            onPress={() => setActiveTab('prs')}
          >
            <MaterialCommunityIcons
              name="trophy-outline"
              size={15}
              color={activeTab === 'prs' ? '#16A34A' : '#9CA3AF'}
            />
            <Text style={[styles.segmentText, activeTab === 'prs' && styles.segmentTextActive]}>
              PRs
            </Text>
          </TouchableOpacity>
        </View>

        {/* CONTEÚDO 1: ABA EVOLUÇÃO */}
        {activeTab === 'evolucao' && (
          <View>
            {/* Seletor de Exercício para o Gráfico */}
            <View style={styles.chipRow}>
              {['Supino Reto', 'Agachamento', 'Lev. Terra'].map((exName) => {
                const isSelected = selectedExercise === exName;
                return (
                  <TouchableOpacity
                    key={exName}
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => setSelectedExercise(exName)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {exName}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Card do Gráfico Gifted Charts */}
            <View style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <View>
                  <Text style={styles.chartTitle}>Progressão de Carga (kg)</Text>
                  <Text style={styles.chartSubtitle}>{selectedExercise} • Últimos 5 meses</Text>
                </View>
                <View style={styles.chartBadge}>
                  <Text style={styles.chartBadgeText}>
                    +{chartData[chartData.length - 1].value - chartData[0].value} kg
                  </Text>
                </View>
              </View>

              <View style={styles.chartWrapper}>
                <LineChart
                  data={chartData}
                  color="#16A34A"
                  thickness={3}
                  startFillColor="rgba(22, 163, 74, 0.3)"
                  endFillColor="rgba(22, 163, 74, 0.01)"
                  startOpacity={0.9}
                  endOpacity={0.2}
                  areaChart
                  curved
                  hideDataPoints={false}
                  dataPointsColor="#4ADE80"
                  dataPointsRadius={5}
                  textColor="#9CA3AF"
                  textFontSize={11}
                  rulesColor="#23322B"
                  rulesType="solid"
                  yAxisTextStyle={{ color: '#6B7280', fontSize: 10 }}
                  xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                  yAxisColor="#23322B"
                  xAxisColor="#23322B"
                  height={190}
                  spacing={48}
                  initialSpacing={16}
                  backgroundColor="transparent"
                />
              </View>
            </View>

            {/* KPI Cards */}
            <View style={styles.kpiRow}>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Ganho Total</Text>
                <Text style={styles.kpiValue}>+25 kg</Text>
                <Text style={styles.kpiFooter}>em todas as cargas</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Novos PRs</Text>
                <Text style={[styles.kpiValue, { color: '#FBBF24' }]}>4</Text>
                <Text style={styles.kpiFooter}>neste mês</Text>
              </View>
              <View style={styles.kpiCard}>
                <Text style={styles.kpiLabel}>Frequência</Text>
                <Text style={[styles.kpiValue, { color: '#60A5FA' }]}>18</Text>
                <Text style={styles.kpiFooter}>treinos no mês</Text>
              </View>
            </View>
          </View>
        )}

        {/* CONTEÚDO 2: ABA MEDIDAS */}
        {activeTab === 'medidas' && (
          <View>
            <View style={styles.actionHeader}>
              <Text style={styles.sectionTitle}>Histórico de Medidas</Text>
              <TouchableOpacity
                style={styles.addMeasureBtn}
                onPress={() => setIsModalOpen(true)}
              >
                <Feather name="plus" size={14} color="#FFFFFF" />
                <Text style={styles.addMeasureText}>Nova Medida</Text>
              </TouchableOpacity>
            </View>

            {measurements.map((m) => (
              <View key={m.id} style={styles.measureCard}>
                <View style={styles.measureDateRow}>
                  <Text style={styles.measureDate}>{m.date}</Text>
                  <Text style={styles.measureWeight}>{m.weight} kg</Text>
                </View>
                <View style={styles.measureGrid}>
                  <View style={styles.measureItem}>
                    <Text style={styles.measureLabel}>Braço</Text>
                    <Text style={styles.measureVal}>{m.arm} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={styles.measureLabel}>Tórax</Text>
                    <Text style={styles.measureVal}>{m.chest} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={styles.measureLabel}>Cintura</Text>
                    <Text style={styles.measureVal}>{m.waist} cm</Text>
                  </View>
                  <View style={styles.measureItem}>
                    <Text style={styles.measureLabel}>Coxa</Text>
                    <Text style={styles.measureVal}>{m.thigh} cm</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* CONTEÚDO 3: ABA PRS */}
        {activeTab === 'prs' && (
          <View>
            <View style={styles.actionHeader}>
              <Text style={styles.sectionTitle}>Recordes Pessoais (PRs)</Text>
              <Text style={styles.prCountBadge}>{prs.length} Conquistas</Text>
            </View>

            {prs.map((pr) => (
              <PRCard key={pr.id} pr={pr} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal de Registro de Nova Medida */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Registrar Novas Medidas</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Feather name="x" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Peso Corporal (kg)*</Text>
                <TextInput
                  style={styles.modalInput}
                  keyboardType="numeric"
                  placeholder="Ex: 78.5"
                  placeholderTextColor="#6B7280"
                  value={newWeight}
                  onChangeText={setNewWeight}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Braço (cm)</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    placeholder="Ex: 39"
                    placeholderTextColor="#6B7280"
                    value={newArm}
                    onChangeText={setNewArm}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Tórax (cm)</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    placeholder="Ex: 104"
                    placeholderTextColor="#6B7280"
                    value={newChest}
                    onChangeText={setNewChest}
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Cintura (cm)</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    placeholder="Ex: 82"
                    placeholderTextColor="#6B7280"
                    value={newWaist}
                    onChangeText={setNewWaist}
                  />
                </View>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>Coxa (cm)</Text>
                  <TextInput
                    style={styles.modalInput}
                    keyboardType="numeric"
                    placeholder="Ex: 60"
                    placeholderTextColor="#6B7280"
                    value={newThigh}
                    onChangeText={setNewThigh}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveMeasurement}
              >
                <Text style={styles.modalSaveText}>Salvar Medidas</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0E1311',
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#161F1B',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#23322B',
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#273830',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  chip: {
    backgroundColor: '#161F1B',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#23322B',
  },
  chipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  chartCard: {
    backgroundColor: '#161F1B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#23322B',
    marginBottom: 16,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  chartSubtitle: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  chartBadge: {
    backgroundColor: 'rgba(22, 163, 74, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  chartBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16A34A',
  },
  chartWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
    overflow: 'hidden',
  },
  kpiRow: {
    flexDirection: 'row',
    gap: 10,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: '#161F1B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#23322B',
  },
  kpiLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#16A34A',
    marginBottom: 2,
  },
  kpiFooter: {
    fontSize: 10,
    color: '#6B7280',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F9FAFB',
  },
  prCountBadge: {
    fontSize: 12,
    color: '#FBBF24',
    fontWeight: '600',
  },
  addMeasureBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addMeasureText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  measureCard: {
    backgroundColor: '#161F1B',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#23322B',
    marginBottom: 12,
  },
  measureDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#23322B',
    paddingBottom: 10,
    marginBottom: 10,
  },
  measureDate: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  measureWeight: {
    fontSize: 16,
    fontWeight: '800',
    color: '#16A34A',
  },
  measureGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measureItem: {
    alignItems: 'center',
  },
  measureLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  measureVal: {
    fontSize: 13,
    fontWeight: '700',
    color: '#E5E7EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#161F1B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#23322B',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalBody: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#0E1311',
    borderWidth: 1,
    borderColor: '#23322B',
    borderRadius: 8,
    color: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: '#273830',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
