import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ExercicioCatalogo } from '../../types/treino';

interface ItemExercicioSelecaoProps {
  exercicio: ExercicioCatalogo;
  selecionado: boolean;
  aoAlternar: () => void;
}

export const ItemExercicioSelecao: React.FC<ItemExercicioSelecaoProps> = ({
  exercicio,
  selecionado,
  aoAlternar,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={aoAlternar}
    >
      <View
        style={[
          styles.checkbox,
          selecionado ? styles.checkboxAtivo : styles.checkboxInativo,
        ]}
      >
        {selecionado && <Feather name="check" size={13} color="#FFFFFF" />}
      </View>

      <View style={styles.fotoContainer}>
        <MaterialCommunityIcons name="dumbbell" size={22} color="#E5E7EB" />
      </View>

      <View style={styles.textoContainer}>
        <Text style={styles.nomeTexto} numberOfLines={1}>
          {exercicio.nome}
        </Text>
        <Text style={styles.categoriaTexto} numberOfLines={1}>
          {exercicio.grupoMuscular} • {exercicio.equipamento}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    width: '100%',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxAtivo: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkboxInativo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D1D5DB',
  },
  fotoContainer: {
    width: 52,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  nomeTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  categoriaTexto: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
});
