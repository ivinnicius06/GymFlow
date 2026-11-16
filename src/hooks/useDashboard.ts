import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

export interface DashboardStats {
  exercisesCount: number;
  studentsCount: number;
  workoutsCount: number;
}

export interface RecentWorkoutItem {
  id: string;
  title: string;
  studentName: string;
  dateLabel: string;
}

interface WorkoutRow {
  id: string;
  title: string;
  scheduled_at: string | null;
  created_at: string;
  students: { name: string } | { name: string }[] | null;
}

const EMPTY_STATS: DashboardStats = {
  exercisesCount: 0,
  studentsCount: 0,
  workoutsCount: 0,
};

function formatDateLabel(dateValue: string | null): string {
  if (!dateValue) return 'Sem data';

  const datePart = dateValue.slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  if (!year || !month || !day) return dateValue;

  const target = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round(
    (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';

  const dd = String(day).padStart(2, '0');
  const mm = String(month).padStart(2, '0');
  return `${dd}/${mm}/${year}`;
}

function extractStudentName(students: WorkoutRow['students']): string {
  if (!students) return 'Sem aluno';
  if (Array.isArray(students)) return students[0]?.name ?? 'Sem aluno';
  return students.name ?? 'Sem aluno';
}

async function fetchRemoteDashboard(): Promise<{
  stats: DashboardStats;
  recentWorkouts: RecentWorkoutItem[];
}> {
  const [exercisesRes, studentsRes, workoutsRes, recentRes] = await Promise.all(
    [
      supabase.from('exercises').select('id', { count: 'exact', head: true }),
      supabase.from('students').select('id', { count: 'exact', head: true }),
      supabase.from('workouts').select('id', { count: 'exact', head: true }),
      supabase
        .from('workouts')
        .select('id, title, scheduled_at, created_at, students(name)')
        .order('created_at', { ascending: false })
        .limit(3),
    ],
  );

  if (exercisesRes.error) throw exercisesRes.error;
  if (studentsRes.error) throw studentsRes.error;
  if (workoutsRes.error) throw workoutsRes.error;
  if (recentRes.error) throw recentRes.error;

  const rows = (recentRes.data ?? []) as unknown as WorkoutRow[];
  return {
    stats: {
      exercisesCount: exercisesRes.count ?? 0,
      studentsCount: studentsRes.count ?? 0,
      workoutsCount: workoutsRes.count ?? 0,
    },
    recentWorkouts: rows.map((row) => ({
      id: row.id,
      title: row.title,
      studentName: extractStudentName(row.students),
      dateLabel: formatDateLabel(row.scheduled_at ?? row.created_at),
    })),
  };
}

export function useDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [recentWorkouts, setRecentWorkouts] = useState<RecentWorkoutItem[]>([]);
  const [loading, setLoading] = useState(Boolean(session));
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!session) {
      Promise.resolve().then(() => {
        if (!active) return;
        setStats(EMPTY_STATS);
        setRecentWorkouts([]);
        setError(null);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }

    fetchRemoteDashboard()
      .then((data) => {
        if (!active) return;
        setStats(data.stats);
        setRecentWorkouts(data.recentWorkouts);
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar o resumo.',
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [session]);

  const refresh = useCallback(() => {
    if (!session) return;

    setRefreshing(true);
    setError(null);

    fetchRemoteDashboard()
      .then((data) => {
        setStats(data.stats);
        setRecentWorkouts(data.recentWorkouts);
      })
      .catch((err) => {
        setError(
          err instanceof Error ? err.message : 'Erro ao carregar o resumo.',
        );
      })
      .finally(() => {
        setRefreshing(false);
      });
  }, [session]);

  return {
    stats,
    recentWorkouts,
    loading,
    refreshing,
    error,
    refresh,
  };
}
