import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { TextInputProps } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { ExerciseHeader } from '../../components/exercises/ExerciseHeader';
import { colors } from '../../components/exercises/colors';
import { MUSCLE_GROUPS, isVideoUrl } from '../../types/exercise';
import type { Exercise, ExerciseFields } from '../../types/exercise';
import type { PhotoChange } from '../../services/exercises';

type Props = {
  exercise: Exercise | null;
  saving: boolean;
  onClose: () => void;
  onSave: (
    fields: ExerciseFields,
    existing: Exercise | null,
    photo: PhotoChange,
  ) => Promise<void>;
};

function Field({
  label,
  hint,
  error,
  style,
  ...props
}: TextInputProps & {
  label: string;
  hint?: string;
  error?: string;
}) {
  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {!!hint && <Text style={styles.hint}>{hint}</Text>}
      </View>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#63746A"
        style={[styles.input, style, error && styles.invalid]}
        {...props}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

export function NewExerciseScreen({
  exercise,
  saving,
  onClose,
  onSave,
}: Props) {
  const [fields, setFields] = useState<ExerciseFields>(() => ({
    name: exercise?.name ?? '',
    muscleGroup: exercise?.muscleGroup ?? '',
    equipment: exercise?.equipment ?? '',
    instructions: exercise?.instructions ?? '',
    videoUrl: exercise?.videoUrl ?? '',
  }));
  const [photo, setPhoto] = useState<PhotoChange>();
  const [picking, setPicking] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const errors = {
    name: fields.name.trim() ? '' : 'Informe o nome do exercício.',
    muscleGroup: fields.muscleGroup ? '' : 'Selecione o grupo muscular.',
    instructions: fields.instructions.trim()
      ? ''
      : 'Informe como executar o exercício.',
    videoUrl:
      !fields.videoUrl.trim() || isVideoUrl(fields.videoUrl.trim())
        ? ''
        : 'Informe um link que comece com https://.',
  };
  const groups = [
    ...new Set([
      ...MUSCLE_GROUPS,
      ...(exercise?.muscleGroup ? [exercise.muscleGroup] : []),
    ]),
  ];
  const photoUri = photo === undefined ? exercise?.photoUrl : photo?.uri;

  const update = (field: keyof ExerciseFields, value: string) => {
    setFields((previous) => ({ ...previous, [field]: value }));
    setError('');
  };

  const choosePhoto = async (source: 'camera' | 'gallery') => {
    if (picking || saving) return;
    setPicking(true);
    setPhotoError('');
    try {
      if (source === 'camera' && Platform.OS !== 'web') {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          setPhotoError(
            'Permita o acesso à câmera nas configurações ou escolha uma foto da galeria.',
          );
          return;
        }
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        quality: 0.8,
        base64: Platform.OS !== 'web',
      };
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled) setPhoto(result.assets[0]);
    } catch {
      setPhotoError(
        'Não foi possível abrir a câmera ou a galeria. Tente novamente.',
      );
    } finally {
      setPicking(false);
    }
  };

  const submit = async () => {
    setSubmitted(true);
    if (picking || saving || Object.values(errors).some(Boolean)) return;
    setError('');
    try {
      await onSave(fields, exercise, photo);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : 'Não foi possível salvar o exercício.',
      );
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      <ExerciseHeader
        title={exercise ? 'Editar exercício' : 'Novo exercício'}
        onClose={onClose}
        disabled={saving}
      />
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.photoSection}>
            {photoUri ? (
              <Image
                accessibilityLabel="Foto selecionada"
                source={{ uri: photoUri }}
                resizeMode="contain"
                style={styles.photo}
              />
            ) : (
              <View style={styles.photoEmpty}>
                <Feather name="image" size={27} color={colors.green} />
                <Text style={styles.label}>Foto do exercício</Text>
              </View>
            )}
            <View style={styles.photoActions}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Câmera"
                disabled={picking || saving}
                onPress={() => void choosePhoto('camera')}
                style={styles.photoAction}
              >
                <Feather name="camera" size={17} color={colors.green} />
                <Text style={styles.actionText}>Câmera</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Galeria"
                disabled={picking || saving}
                onPress={() => void choosePhoto('gallery')}
                style={styles.photoAction}
              >
                <Feather name="image" size={17} color={colors.green} />
                <Text style={styles.actionText}>Galeria</Text>
              </Pressable>
            </View>
            {(photoUri || (photo === undefined && exercise?.photoPath)) && (
              <Pressable
                accessibilityRole="button"
                disabled={saving || picking}
                onPress={() => {
                  setPhoto(null);
                  setPhotoError('');
                }}
                style={styles.removePhoto}
              >
                <Text style={styles.error}>Remover foto</Text>
              </Pressable>
            )}
            {!!photoError && (
              <Text accessibilityLiveRegion="polite" style={styles.error}>
                {photoError}
              </Text>
            )}
          </View>
          <Field
            label="Nome do exercício"
            placeholder="Ex.: Agachamento livre"
            value={fields.name}
            maxLength={100}
            editable={!saving}
            onChangeText={(value) => update('name', value)}
            error={submitted ? errors.name : undefined}
          />
          <View style={styles.field}>
            <Text style={styles.label}>Grupo muscular</Text>
            <View style={styles.groups}>
              {groups.map((group) => {
                const selected = fields.muscleGroup === group;
                return (
                  <Pressable
                    key={group}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    disabled={saving}
                    onPress={() => update('muscleGroup', group)}
                    style={[styles.group, selected && styles.groupOn]}
                  >
                    <Text
                      style={[styles.groupText, selected && styles.groupTextOn]}
                    >
                      {group}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {submitted && !!errors.muscleGroup && (
              <Text style={styles.error}>{errors.muscleGroup}</Text>
            )}
          </View>
          <Field
            label="Equipamento"
            hint="Opcional"
            placeholder="Ex.: Barra, halteres ou máquina"
            value={fields.equipment}
            maxLength={80}
            editable={!saving}
            onChangeText={(value) => update('equipment', value)}
          />
          <Field
            label="Instruções"
            placeholder="Descreva a execução do movimento"
            value={fields.instructions}
            maxLength={2000}
            editable={!saving}
            multiline
            textAlignVertical="top"
            style={styles.instructions}
            onChangeText={(value) => update('instructions', value)}
            error={submitted ? errors.instructions : undefined}
          />
          <Field
            label="Vídeo explicativo"
            hint="Opcional"
            placeholder="https://"
            value={fields.videoUrl}
            maxLength={500}
            editable={!saving}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            onChangeText={(value) => update('videoUrl', value)}
            error={submitted ? errors.videoUrl : undefined}
          />
        </ScrollView>
        <View style={styles.footer}>
          {!!error && (
            <Text accessibilityLiveRegion="polite" style={styles.error}>
              {error}
            </Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Salvar exercício"
            accessibilityState={{ busy: saving }}
            disabled={saving || picking}
            onPress={() => void submit()}
            style={[styles.save, (saving || picking) && styles.disabled]}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Feather name="check" size={19} color={colors.white} />
            )}
            <Text style={styles.saveText}>
              {saving ? 'Salvando…' : 'Salvar exercício'}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.page },
  body: { flex: 1 },
  content: { padding: 18, gap: 15 },
  photoSection: { gap: 8 },
  photo: {
    width: '100%',
    height: 122,
    borderRadius: 14,
    backgroundColor: colors.pale,
  },
  photoEmpty: {
    height: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#8DB49A',
    backgroundColor: colors.pale,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  photoActions: { flexDirection: 'row', gap: 8 },
  photoAction: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  actionText: { color: colors.green, fontWeight: '700', fontSize: 14 },
  removePhoto: { alignSelf: 'flex-start', paddingVertical: 4 },
  field: { gap: 6 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: { color: colors.text, fontSize: 14, fontWeight: '700' },
  hint: { color: colors.muted, fontSize: 12 },
  input: {
    minHeight: 45,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 15,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  invalid: { borderColor: colors.red },
  instructions: { minHeight: 76, paddingTop: 11 },
  groups: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  group: {
    minHeight: 36,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  groupOn: { borderColor: colors.green, backgroundColor: colors.pale },
  groupText: { color: colors.muted, fontSize: 13, fontWeight: '600' },
  groupTextOn: { color: colors.green, fontWeight: '800' },
  error: { color: colors.red, fontSize: 13, lineHeight: 18 },
  footer: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  save: {
    minHeight: 49,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.green,
  },
  saveText: { color: colors.white, fontSize: 15, fontWeight: '800' },
  disabled: { opacity: 0.65 },
});
