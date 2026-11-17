import React from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ItemExercicioSelecao } from '../../components/builder/ItemExercicioSelecao';
import type { ExercicioCatalogo, GrupoMuscular } from '../../types/treino';

interface AdicionarExerciciosScreenProps {
  exercicios: ExercicioCatalogo[];
  totalSelecionados: number;
  estaSelecionado: (id: string) => boolean;
  onAlternarExercicio: (exercicio: ExercicioCatalogo) => void;
  busca: string;
  onMudarBusca: (texto: string) => void;
  filtroGrupo: GrupoMuscular;
  onMudarFiltro: (grupo: GrupoMuscular) => void;
  onAvancar: () => void;
  onVoltar: () => void;
}

const GRUPOS: GrupoMuscular[] = [
  'Todos',
  'Peito',
  'Costas',
  'Pernas',
  'Ombros',
  'Braços',
];

export const AdicionarExerciciosScreen: React.FC<
  AdicionarExerciciosScreenProps
> = ({
  exercicios,
  totalSelecionados,
  estaSelecionado,
  onAlternarExercicio,
  busca,
  onMudarBusca,
  filtroGrupo,
  onMudarFiltro,
  onAvancar,
  onVoltar,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.botaoVoltar}
          activeOpacity={0.7}
          onPress={onVoltar}
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.tituloHeader} numberOfLines={1}>
          Adicionar exercício ao treino
        </Text>
      </View>

      {/* Campo de Busca */}
      <View style={styles.buscaContainer}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar exercício..."
          placeholderTextColor="#9CA3AF"
          value={busca}
          onChangeText={onMudarBusca}
          autoCapitalize="words"
        />
        {busca.length > 0 && (
          <TouchableOpacity onPress={() => onMudarBusca('')}>
            <Feather name="x-circle" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Chips de Filtros Horizontais */}
      <View style={styles.filtrosWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtrosConteudo}
        >
          {GRUPOS.map((grupo) => {
            const isAtivo = filtroGrupo === grupo;
            return (
              <TouchableOpacity
                key={grupo}
                style={[
                  styles.chip,
                  isAtivo ? styles.chipAtivo : styles.chipInativo,
                ]}
                activeOpacity={0.7}
                onPress={() => onMudarFiltro(grupo)}
              >
                <Text
                  style={[
                    styles.chipTexto,
                    isAtivo ? styles.chipTextoAtivo : styles.chipTextoInativo,
                  ]}
                >
                  {grupo}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Exercícios */}
      <FlatList
        data={exercicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ItemExercicioSelecao
            exercicio={item}
            selecionado={estaSelecionado(item.id)}
            aoAlternar={() => onAlternarExercicio(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.listaVaziaTexto}>
              Nenhum exercício encontrado.
            </Text>
          </View>
        }
      />

      {/* Botão Inferior Fixo com Contador Dinâmico */}
      <View style={styles.rodape}>
        <TouchableOpacity
          style={[
            styles.botaoAdicionar,
            totalSelecionados === 0 && styles.botaoDesabilitado,
          ]}
          activeOpacity={0.8}
          onPress={onAvancar}
          disabled={totalSelecionados === 0}
        >
          <Text style={styles.botaoAdicionarTexto}>
            Adicionar selecionados ({totalSelecionados})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
    marginBottom: 4,
  },
  botaoVoltar: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  buscaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    marginVertical: 10,
  },
  buscaInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    padding: 0,
  },
  filtrosWrapper: {
    marginBottom: 10,
  },
  filtrosConteudo: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
  },
  chipAtivo: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  chipInativo: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  chipTexto: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipTextoAtivo: {
    color: '#FFFFFF',
  },
  chipTextoInativo: {
    color: '#111827',
  },
  listaConteudo: {
    paddingBottom: 16,
  },
  listaVazia: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  listaVaziaTexto: {
    fontSize: 13,
    color: '#6B7280',
  },
  rodape: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  botaoAdicionar: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoAdicionarTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
