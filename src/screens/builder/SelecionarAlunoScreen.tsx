import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarraEtapas } from '../../components/builder/BarraEtapas';
import { CartaoAluno } from '../../components/builder/CartaoAluno';
import type { Aluno } from '../../types/treino';

interface SelecionarAlunoScreenProps {
  alunos: Aluno[];
  alunoSelecionado: Aluno | null;
  onSelecionarAluno: (aluno: Aluno) => void;
  busca: string;
  onMudarBusca: (texto: string) => void;
  onAvancar: () => void;
  onVoltar?: () => void;
}

export const SelecionarAlunoScreen: React.FC<SelecionarAlunoScreenProps> = ({
  alunos,
  alunoSelecionado,
  onSelecionarAluno,
  busca,
  onMudarBusca,
  onAvancar,
  onVoltar,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {onVoltar && (
          <TouchableOpacity
            style={styles.botaoVoltar}
            activeOpacity={0.7}
            onPress={onVoltar}
          >
            <Feather name="arrow-left" size={24} color="#111827" />
          </TouchableOpacity>
        )}
        <Text style={styles.tituloHeader}>Criar treino</Text>
      </View>

      {/* Stepper de 4 Etapas */}
      <BarraEtapas etapaAtual={1} />

      {/* Título da Seção */}
      <Text style={styles.secaoTitulo}>Selecionar aluno</Text>

      {/* Campo de Busca */}
      <View style={styles.buscaContainer}>
        <Feather name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.buscaInput}
          placeholder="Buscar aluno..."
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

      {/* Lista de Alunos */}
      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartaoAluno
            aluno={item}
            selecionado={alunoSelecionado?.id === item.id}
            aoPressionar={() => onSelecionarAluno(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaConteudo}
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.listaVaziaTexto}>
              {`Nenhum aluno encontrado para "${busca}".`}
            </Text>
          </View>
        }
      />

      {/* Botão Inferior Próximo */}
      <View style={styles.rodape}>
        <TouchableOpacity
          style={[
            styles.botaoProximo,
            !alunoSelecionado && styles.botaoDesabilitado,
          ]}
          activeOpacity={0.8}
          onPress={onAvancar}
          disabled={!alunoSelecionado}
        >
          <Text style={styles.botaoProximoTexto}>Próximo</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
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
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 14,
    marginBottom: 10,
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
    marginBottom: 14,
  },
  buscaInput: {
    flex: 1,
    fontSize: 13,
    color: '#111827',
    padding: 0,
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
  botaoProximo: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  botaoDesabilitado: {
    opacity: 0.5,
  },
  botaoProximoTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
