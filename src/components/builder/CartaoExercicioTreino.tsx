import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ExercicioConfigurado } from '../../types/treino';

interface CartaoExercicioTreinoProps {
  item: ExercicioConfigurado;
  aoEditar: () => void;
  aoRemover: () => void;
}

export const CartaoExercicioTreino: React.FC<CartaoExercicioTreinoProps> = ({
  item,
  aoEditar,
  aoRemover,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        <View style={styles.fotoContainer}>
          <MaterialCommunityIcons name="dumbbell" size={22} color="#E5E7EB" />
        </View>

        <View style={styles.textoContainer}>
          <Text style={styles.nomeTexto} numberOfLines={1}>
            {item.nome}
          </Text>
          <Text style={styles.seriesTexto} numberOfLines={1}>
            {item.series} séries • {item.repeticoes}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuBotao}
          activeOpacity={0.6}
          onPress={aoEditar}
        >
          <Feather name="more-horizontal" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.cargaEDescansoLinha}
        activeOpacity={0.8}
        onPress={aoEditar}
      >
        <View style={styles.blocoMetrica}>
          <Text style={styles.metricaRotulo}>Carga</Text>
          <Text style={styles.metricaValor}>{item.cargaKg} kg</Text>
        </View>

        <View style={styles.blocoMetrica}>
          <Text style={styles.metricaRotulo}>Descanso</Text>
          <Text style={styles.metricaValor}>{item.descansoSegundos}s</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  seriesTexto: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  menuBotao: {
    padding: 4,
  },
  cargaEDescansoLinha: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  blocoMetrica: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricaRotulo: {
    fontSize: 11,
    fontWeight: '400',
    color: '#6B7280',
  },
  metricaValor: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
});
