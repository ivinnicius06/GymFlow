export const MUSCLE_GROUPS = [
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
] as const;

export interface ExerciseFields {
  name: string;
  muscleGroup: string;
  equipment: string;
  instructions: string;
  videoUrl: string;
}

export interface Exercise extends ExerciseFields {
  id: string;
  userId: string;
  photoPath: string | null;
  photoUrl: string | null;
}

export function isVideoUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname);
  } catch {
    return false;
  }
}
