import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CartaoExercicioTreino } from '../../components/builder/CartaoExercicioTreino';
import { ModalEditarExercicio } from '../../components/builder/ModalEditarExercicio';
import type { Aluno, ExercicioConfigurado } from '../../types/treino';

interface ConfigurarTreinoScreenProps {
  aluno: Aluno | null;
  tituloTreino: string;
  dataAgendada: string;
  exercicios: ExercicioConfigurado[];
  salvando: boolean;
  onAdicionarMaisExercicios: () => void;
  onAtualizarExercicio: (
    id: string,
    novosDados: Partial<ExercicioConfigurado>,
  ) => void;
  onRemoverExercicio: (id: string) => void;
  onSalvarTreino: () => void;
  onVoltar: () => void;
}

export const ConfigurarTreinoScreen: React.FC<ConfigurarTreinoScreenProps> = ({
  aluno,
  tituloTreino,
  dataAgendada,
  exercicios,
  salvando,
  onAdicionarMaisExercicios,
  onAtualizarExercicio,
  onRemoverExercicio,
  onSalvarTreino,
  onVoltar,
}) => {
  const [itemParaEditar, setItemParaEditar] =
    useState<ExercicioConfigurado | null>(null);

  const handleMenuOpcoes = () => {
    Alert.alert('Opções do Treino', tituloTreino, [
      { text: 'Adicionar mais exercícios', onPress: onAdicionarMaisExercicios },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

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
          {tituloTreino}
        </Text>
        <TouchableOpacity
          style={styles.botaoMais}
          activeOpacity={0.7}
          onPress={handleMenuOpcoes}
        >
          <Feather name="more-horizontal" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      {/* Info do Aluno */}
      {aluno && (
        <View style={styles.alunoContainer}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: aluno.corAvatar || '#6B7280' },
            ]}
          >
            <Text style={styles.avatarTexto}>{aluno.iniciais}</Text>
          </View>
          <View style={styles.alunoTextoContainer}>
            <Text style={styles.alunoNome}>{aluno.nome}</Text>
            <Text style={styles.alunoAgendamento}>
              Agendado para: {dataAgendada}
            </Text>
          </View>
        </View>
      )}

      {/* Lista de Exercícios do Treino */}
      <FlatList
        data={exercicios}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartaoExercicioTreino
            item={item}
            aoEditar={() => setItemParaEditar(item)}
            aoRemover={() => onRemoverExercicio(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.botaoAdicionarMais}
            activeOpacity={0.7}
            onPress={onAdicionarMaisExercicios}
          >
            <Feather name="plus" size={16} color="#16A34A" />
            <Text style={styles.botaoAdicionarMaisTexto}>Adicionar exercício</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.listaVaziaTexto}>
              Nenhum exercício configurado ainda.
            </Text>
          </View>
        }
      />

      {/* Botão Inferior Salvar Treino */}
      <View style={styles.rodape}>
        <TouchableOpacity
          style={[styles.botaoSalvar, salvando && styles.botaoDesabilitado]}
          activeOpacity={0.8}
          onPress={onSalvarTreino}
          disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.botaoSalvarTexto}>Salvar treino</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de Ajuste de Carga e Descanso */}
      <ModalEditarExercicio
        visivel={itemParaEditar !== null}
        item={itemParaEditar}
        aoFechar={() => setItemParaEditar(null)}
        aoSalvar={onAtualizarExercicio}
        aoRemover={onRemoverExercicio}
      />
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
  botaoMais: {
    padding: 4,
  },
  alunoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  alunoTextoContainer: {
    flex: 1,
    gap: 2,
  },
  alunoNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  alunoAgendamento: {
    fontSize: 12,
    fontWeight: '400',
    color: '#6B7280',
  },
  listaConteudo: {
    paddingBottom: 20,
  },
  botaoAdicionarMais: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  botaoAdicionarMaisTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#16A34A',
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
  botaoSalvar: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.7,
  },
  botaoSalvarTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
