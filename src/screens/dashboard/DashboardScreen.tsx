import React from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useDashboard } from '../../hooks/useDashboard';
import { UserAvatar } from '../../components/dashboard/UserAvatar';
import { StatCard } from '../../components/dashboard/StatCard';
import { RecentWorkoutCard } from '../../components/dashboard/RecentWorkoutCard';

interface HomeScreenProps {
  userEmail?: string;
  onLogout: () => void;
}

function getDisplayName(userEmail?: string): string {
  if (!userEmail) return 'Atleta';
  const localPart = userEmail.split('@')[0] ?? 'Atleta';
  const firstWord = localPart.split(/[._-]/)[0] || localPart;
  return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userEmail,
  onLogout,
}) => {
  const navigation = useNavigation();
  const { stats, recentWorkouts, loading, refreshing, error, refresh } =
    useDashboard();

  const displayName = getDisplayName(userEmail);
  const initials = getInitials(displayName);

  const handleAvatarPress = () => {
    Alert.alert('Conta', userEmail ?? '', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: onLogout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#16A34A"
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Text style={styles.brandBadgeText}>G</Text>
            </View>
            <Text style={styles.brandName}>GymFlow</Text>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.bellButton}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert('Notificações', 'Nenhuma notificação no momento.')
              }
            >
              <Feather name="bell" size={20} color="#0F172A" />
            </TouchableOpacity>
            <UserAvatar initials={initials} onPress={handleAvatarPress} />
          </View>
        </View>

        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Olá, {displayName}!</Text>
          <Text style={styles.greetingSubtitle}>
            Aqui está o resumo do seu dia.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon={
              <MaterialCommunityIcons
                name="dumbbell"
                size={20}
                color="#0F172A"
              />
            }
            value={stats.exercisesCount}
            label="Exercícios"
          />
          <StatCard
            icon={<Feather name="users" size={20} color="#0F172A" />}
            value={stats.studentsCount}
            label="Alunos"
          />
          <StatCard
            icon={<Feather name="calendar" size={20} color="#0F172A" />}
            value={stats.workoutsCount}
            label="Treinos"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.primaryAction}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ExercisesTab', { openNewExercise: true })}
            >
              <Feather name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.actionText}>Novo exercício</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryAction}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('WorkoutsTab')}
            >
              <Feather name="plus" size={16} color="#FFFFFF" />
              <Text style={styles.actionText}>Novo treino</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Últimos treinos</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('WorkoutsTab')}
            >
              <Text style={styles.seeAllText}>Ver todos ›</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.feedbackBox}>
              <ActivityIndicator size="small" color="#16A34A" />
            </View>
          ) : error ? (
            <TouchableOpacity
              style={styles.feedbackBox}
              activeOpacity={0.75}
              onPress={refresh}
            >
              <Text style={styles.errorText}>{error}</Text>
              <Text style={styles.retryText}>Toque para tentar novamente</Text>
            </TouchableOpacity>
          ) : recentWorkouts.length === 0 ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.emptyText}>
                Nenhum treino cadastrado ainda.
              </Text>
            </View>
          ) : (
            <View style={styles.workoutsList}>
              {recentWorkouts.map((workout) => (
                <RecentWorkoutCard
                  key={workout.id}
                  title={workout.title}
                  studentName={workout.studentName}
                  dateLabel={workout.dateLabel}
                  onPress={() => navigation.navigate('WorkoutsTab')}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBadgeText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    padding: 4,
  },
  greetingSection: {
    gap: 4,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  primaryAction: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  secondaryAction: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  workoutsList: {
    gap: 10,
  },
  feedbackBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
  },
  errorText: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
  },
  retryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
});
