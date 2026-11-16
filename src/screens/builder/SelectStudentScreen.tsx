import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useCriadorTreino } from '../../hooks/useCriadorTreino';
import { SelecionarAlunoScreen } from './SelecionarAlunoScreen';
import { AdicionarExerciciosScreen } from './AdicionarExerciciosScreen';
import { ConfigurarTreinoScreen } from './ConfigurarTreinoScreen';

export const SelectStudentScreen: React.FC = () => {
  const navigation = useNavigation();
  const {
    etapaAtual,
    avancarParaExercicios,
    avancarParaConfiguracao,
    voltarEtapa,
    reiniciarCriacao,
    // Alunos (Tela 5)
    alunos,
    alunoSelecionado,
    selecionarAluno,
    buscaAluno,
    setBuscaAluno,
    // Exercícios (Tela 6)
    exercicios,
    exerciciosSelecionados,
    estaExercicioSelecionado,
    alternarSelecaoExercicio,
    atualizarConfiguracaoExercicio,
    removerExercicio,
    buscaExercicio,
    setBuscaExercicio,
    filtroGrupoMuscular,
    setFiltroGrupoMuscular,
    // Treino Final (Tela 7)
    tituloTreino,
    dataAgendada,
    salvando,
    salvarTreino,
  } = useCriadorTreino();

  const handleSalvarFinal = async () => {
    const resultado = await salvarTreino();
    if (resultado.sucesso) {
      Alert.alert('Treino Salvo!', resultado.mensagem, [
        {
          text: 'Concluir',
          onPress: () => {
            reiniciarCriacao();
            // Redireciona de volta para a aba Início
            navigation.navigate('HomeTab');
          },
        },
      ]);
    } else {
      Alert.alert('Atenção', resultado.mensagem);
    }
  };

  const handleVoltarPrimeiraEtapa = () => {
    navigation.navigate('HomeTab');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.conteudo}>
        {etapaAtual === 1 && (
          <SelecionarAlunoScreen
            alunos={alunos}
            alunoSelecionado={alunoSelecionado}
            onSelecionarAluno={selecionarAluno}
            busca={buscaAluno}
            onMudarBusca={setBuscaAluno}
            onAvancar={avancarParaExercicios}
            onVoltar={handleVoltarPrimeiraEtapa}
          />
        )}

        {etapaAtual === 2 && (
          <AdicionarExerciciosScreen
            exercicios={exercicios}
            totalSelecionados={exerciciosSelecionados.length}
            estaSelecionado={estaExercicioSelecionado}
            onAlternarExercicio={alternarSelecaoExercicio}
            busca={buscaExercicio}
            onMudarBusca={setBuscaExercicio}
            filtroGrupo={filtroGrupoMuscular}
            onMudarFiltro={setFiltroGrupoMuscular}
            onAvancar={avancarParaConfiguracao}
            onVoltar={voltarEtapa}
          />
        )}

        {etapaAtual === 3 && (
          <ConfigurarTreinoScreen
            aluno={alunoSelecionado}
            tituloTreino={tituloTreino}
            dataAgendada={dataAgendada}
            exercicios={exerciciosSelecionados}
            salvando={salvando}
            onAdicionarMaisExercicios={avancarParaExercicios}
            onAtualizarExercicio={atualizarConfiguracaoExercicio}
            onRemoverExercicio={removerExercicio}
            onSalvarTreino={handleSalvarFinal}
            onVoltar={voltarEtapa}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// Exportação também com nome semântico em português
export const CriadorTreinoScreen = SelectStudentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  conteudo: {
    flex: 1,
  },
});
