import { decode } from 'base64-arraybuffer';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { Exercise, ExerciseFields } from '../types/exercise';
import { supabase } from './supabase';

const COLUMNS =
  'id, user_id, name, muscle_group, equipment, instructions, video_url, photo_path';
const PAGE_SIZE = 100;
const PHOTO_LIMIT = 8 * 1024 * 1024;
const IMAGE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;
const photos = supabase.storage.from('exercise-photos');

interface ExerciseRow {
  id: string;
  user_id: string;
  name: string;
  muscle_group: string;
  equipment: string;
  instructions: string | null;
  video_url: string | null;
  photo_path: string | null;
}

// undefined keeps the existing photo, null removes it, and an asset replaces it.
export type PhotoChange = ImagePickerAsset | null | undefined;

function toExercise(
  row: ExerciseRow,
  photoUrl: string | null = null,
): Exercise {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    muscleGroup: row.muscle_group,
    equipment: row.equipment,
    instructions: row.instructions ?? '',
    videoUrl: row.video_url ?? '',
    photoPath: row.photo_path,
    photoUrl,
  };
}

export async function listExercises(userId: string): Promise<Exercise[]> {
  const rows: ExerciseRow[] = [];

  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from('exercises')
      .select(COLUMNS)
      .eq('user_id', userId)
      .order('name')
      .order('id')
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw error;
    rows.push(...data);
    if (data.length < PAGE_SIZE) break;
  }

  const paths = rows.flatMap(({ photo_path }) =>
    photo_path ? [photo_path] : [],
  );
  const urls = new Map<string, string>();
  for (let offset = 0; offset < paths.length; offset += PAGE_SIZE) {
    const { data } = await photos.createSignedUrls(
      paths.slice(offset, offset + PAGE_SIZE),
      3600,
    );
    for (const link of data ?? []) {
      if (link.path && link.signedUrl) urls.set(link.path, link.signedUrl);
    }
  }

  return rows.map((row) =>
    toExercise(row, row.photo_path ? urls.get(row.photo_path) : null),
  );
}

function imageType(bytes: ArrayBuffer): keyof typeof IMAGE_EXTENSIONS {
  const first = new Uint8Array(bytes, 0, Math.min(12, bytes.byteLength));
  if (first[0] === 0xff && first[1] === 0xd8 && first[2] === 0xff)
    return 'image/jpeg';
  if (first[0] === 0x89 && String.fromCharCode(...first.slice(1, 4)) === 'PNG')
    return 'image/png';
  const signature = String.fromCharCode(...first);
  if (signature.startsWith('RIFF') && signature.slice(8, 12) === 'WEBP')
    return 'image/webp';
  throw new Error('Escolha uma foto JPG, PNG ou WebP.');
}

async function uploadPhoto(userId: string, photo: ImagePickerAsset) {
  if (
    (photo.file?.size ?? 0) > PHOTO_LIMIT ||
    (photo.base64?.length ?? 0) > 4 * Math.ceil(PHOTO_LIMIT / 3)
  ) {
    throw new Error('Escolha uma foto de até 8 MB.');
  }

  const bytes = photo.file
    ? await photo.file.arrayBuffer()
    : photo.base64
      ? decode(photo.base64)
      : null;
  if (!bytes)
    throw new Error('Não foi possível ler a foto. Escolha a imagem novamente.');
  if (bytes.byteLength > PHOTO_LIMIT)
    throw new Error('Escolha uma foto de até 8 MB.');

  const contentType = imageType(bytes);
  const suffix = Math.random().toString(36).slice(2);
  const path = `${userId}/${Date.now()}-${suffix}.${IMAGE_EXTENSIONS[contentType]}`;
  const { error } = await photos.upload(path, bytes, { contentType });
  if (error)
    throw new Error('Não foi possível enviar a foto. Tente novamente.');
  return path;
}

async function removePhoto(path: string | null | undefined) {
  if (!path) return;
  try {
    await photos.remove([path]);
  } catch {
    // The exercise write has already been confirmed.
  }
}

export async function saveExercise(
  userId: string,
  fields: ExerciseFields,
  current: Exercise | null,
  photo: PhotoChange,
): Promise<Exercise> {
  const newPath = photo ? await uploadPhoto(userId, photo) : null;
  const values = {
    name: fields.name.trim(),
    muscle_group: fields.muscleGroup,
    equipment: fields.equipment.trim() || 'Livre',
    instructions: fields.instructions.trim(),
    video_url: fields.videoUrl.trim() || null,
    ...(photo !== undefined ? { photo_path: newPath } : {}),
  };

  let query;
  if (current) {
    query = supabase
      .from('exercises')
      .update(values)
      .eq('id', current.id)
      .eq('user_id', userId);
    if (photo !== undefined) {
      query = current.photoPath
        ? query.eq('photo_path', current.photoPath)
        : query.is('photo_path', null);
    }
  } else {
    query = supabase.from('exercises').insert({ ...values, user_id: userId });
  }

  const { data, error, status } = await query.select(COLUMNS).maybeSingle();
  if (!data || error) {
    // On a lost response, the row may already refer to the uploaded file.
    if (!error || (status >= 400 && status < 500)) await removePhoto(newPath);
    throw new Error(
      'Não foi possível confirmar o salvamento. Atualize o catálogo antes de tentar novamente.',
    );
  }

  if (photo !== undefined) await removePhoto(current?.photoPath);
  const url =
    current && data.photo_path === current.photoPath
      ? current.photoUrl
      : photo?.uri;
  return toExercise(data, url);
}

export async function deleteExercise(userId: string, exercise: Exercise) {
  const { data, error } = await supabase
    .from('exercises')
    .delete()
    .eq('id', exercise.id)
    .eq('user_id', userId)
    .select('photo_path')
    .maybeSingle();

  if (error || !data)
    throw new Error(
      'Não foi possível excluir o exercício. Atualize o catálogo e tente novamente.',
    );
  await removePhoto(data.photo_path);
}
