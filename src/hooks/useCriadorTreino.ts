import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import type {
  Aluno,
  ExercicioCatalogo,
  ExercicioConfigurado,
  GrupoMuscular,
  TreinoCompleto,
} from '../types/treino';

const CHAVE_RASCUNHO = '@GymFlow:rascunho_criador_treino';
const CHAVE_HISTORICO_TREINOS = '@GymFlow:treinos_salvos';

// Dados padrão idênticos ao protótipo do Figma para fallback/offline
export const ALUNOS_PADRAO: Aluno[] = [
  {
    id: 'aluno-1',
    nome: 'João Silva',
    iniciais: 'JS',
    corAvatar: '#6B7280',
    treinoAtual: 'Treino A – Peito + Tríceps',
  },
  {
    id: 'aluno-2',
    nome: 'Maria Oliveira',
    iniciais: 'MO',
    corAvatar: '#B45309',
    treinoAtual: 'Treino B – Costas + Bíceps',
  },
  {
    id: 'aluno-3',
    nome: 'Carlos Santos',
    iniciais: 'CS',
    corAvatar: '#4B5563',
    treinoAtual: 'Treino C – Pernas',
  },
  {
    id: 'aluno-4',
    nome: 'Ana Costa',
    iniciais: 'AC',
    corAvatar: '#9D174D',
    treinoAtual: 'Treino D – Ombros + Abdômen',
  },
];

export const EXERCICIOS_PADRAO: ExercicioCatalogo[] = [
  {
    id: 'ex-1',
    nome: 'Supino Reto',
    grupoMuscular: 'Peito',
    equipamento: 'Barra',
    seriesPadrao: 4,
    repeticoesPadrao: '8–12 repetições',
    cargaPadraoKg: 40,
    descansoPadraoSegundos: 90,
  },
  {
    id: 'ex-2',
    nome: 'Supino Inclinado',
    grupoMuscular: 'Peito',
    equipamento: 'Halteres',
    seriesPadrao: 3,
    repeticoesPadrao: '10 repetições',
    cargaPadraoKg: 30,
    descansoPadraoSegundos: 60,
  },
  {
    id: 'ex-3',
    nome: 'Crucifixo',
    grupoMuscular: 'Peito',
    equipamento: 'Halteres',
    seriesPadrao: 3,
    repeticoesPadrao: '12 repetições',
    cargaPadraoKg: 14,
    descansoPadraoSegundos: 45,
  },
  {
    id: 'ex-4',
    nome: 'Puxada Frontal',
    grupoMuscular: 'Costas',
    equipamento: 'Máquina',
    seriesPadrao: 3,
    repeticoesPadrao: '10–12 repetições',
    cargaPadraoKg: 50,
    descansoPadraoSegundos: 60,
  },
  {
    id: 'ex-5',
    nome: 'Remada Curvada',
    grupoMuscular: 'Costas',
    equipamento: 'Barra',
    seriesPadrao: 4,
    repeticoesPadrao: '8–10 repetições',
    cargaPadraoKg: 45,
    descansoPadraoSegundos: 60,
  },
  {
    id: 'ex-6',
    nome: 'Agachamento Livre',
    grupoMuscular: 'Pernas',
    equipamento: 'Barra',
    seriesPadrao: 4,
    repeticoesPadrao: '8–10 repetições',
    cargaPadraoKg: 80,
    descansoPadraoSegundos: 90,
  },
  {
    id: 'ex-7',
    nome: 'Leg Press 45°',
    grupoMuscular: 'Pernas',
    equipamento: 'Máquina',
    seriesPadrao: 4,
    repeticoesPadrao: '10–12 repetições',
    cargaPadraoKg: 160,
    descansoPadraoSegundos: 60,
  },
  {
    id: 'ex-8',
    nome: 'Desenvolvimento',
    grupoMuscular: 'Ombros',
    equipamento: 'Halteres',
    seriesPadrao: 3,
    repeticoesPadrao: '10–12 repetições',
    cargaPadraoKg: 18,
    descansoPadraoSegundos: 60,
  },
  {
    id: 'ex-9',
    nome: 'Elevação Lateral',
    grupoMuscular: 'Ombros',
    equipamento: 'Halteres',
    seriesPadrao: 4,
    repeticoesPadrao: '12–15 repetições',
    cargaPadraoKg: 10,
    descansoPadraoSegundos: 45,
  },
  {
    id: 'ex-10',
    nome: 'Rosca Direta',
    grupoMuscular: 'Braços',
    equipamento: 'Halteres',
    seriesPadrao: 3,
    repeticoesPadrao: '10–12 repetições',
    cargaPadraoKg: 24,
    descansoPadraoSegundos: 60,
  },
  {
    id: 'ex-11',
    nome: 'Tríceps Pulley',
    grupoMuscular: 'Braços',
    equipamento: 'Polia',
    seriesPadrao: 3,
    repeticoesPadrao: '12 repetições',
    cargaPadraoKg: 25,
    descansoPadraoSegundos: 60,
  },
];

function gerarIniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  if (partes.length >= 2) {
    return `${partes[0][0]}${partes[1][0]}`.toUpperCase();
  }
  return nome.slice(0, 2).toUpperCase();
}

function obterDataFormatada(data: Date = new Date()): string {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

export function useCriadorTreino() {
  const { session } = useAuth();

  // Etapa atual: 1 = Aluno, 2 = Exercícios, 3 = Configuração (Treino A)
  const [etapaAtual, setEtapaAtual] = useState<1 | 2 | 3>(1);

  // Listas de dados disponíveis
  const [alunos, setAlunos] = useState<Aluno[]>(ALUNOS_PADRAO);
  const [exerciciosCatalogo, setExerciciosCatalogo] =
    useState<ExercicioCatalogo[]>(EXERCICIOS_PADRAO);

  // Filtros e buscas
  const [buscaAluno, setBuscaAluno] = useState('');
  const [buscaExercicio, setBuscaExercicio] = useState('');
  const [filtroGrupoMuscular, setFiltroGrupoMuscular] =
    useState<GrupoMuscular>('Todos');

  // Seleções do treino
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(
    ALUNOS_PADRAO[0] ?? null,
  );
  const [exerciciosSelecionados, setExerciciosSelecionados] = useState<
    ExercicioConfigurado[]
  >([
    {
      id: 'cfg-1',
      exercicioId: 'ex-1',
      nome: 'Supino Reto',
      grupoMuscular: 'Peito',
      equipamento: 'Barra',
      series: 4,
      repeticoes: '8–12 repetições',
      cargaKg: 40,
      descansoSegundos: 90,
    },
    {
      id: 'cfg-2',
      exercicioId: 'ex-2',
      nome: 'Supino Inclinado',
      grupoMuscular: 'Peito',
      equipamento: 'Halteres',
      series: 3,
      repeticoes: '10 repetições',
      cargaKg: 30,
      descansoSegundos: 60,
    },
    {
      id: 'cfg-3',
      exercicioId: 'ex-11',
      nome: 'Tríceps Pulley',
      grupoMuscular: 'Braços',
      equipamento: 'Polia',
      series: 3,
      repeticoes: '12 repetições',
      cargaKg: 25,
      descansoSegundos: 60,
    },
  ]);

  const [tituloTreino, setTituloTreino] = useState(
    'Treino A – Peito + Tríceps',
  );
  const [dataAgendada, setDataAgendada] = useState(obterDataFormatada());

  // Estados de controle
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Carrega alunos e exercícios remotos se disponíveis no Supabase
  useEffect(() => {
    let ativo = true;

    async function carregarDadosRemotos() {
      if (!session) return;
      try {
        setCarregando(true);
        const [alunosRes, exerciciosRes] = await Promise.all([
          supabase.from('students').select('id, name').order('name'),
          supabase
            .from('exercises')
            .select(
              'id, name, muscle_group, equipment, default_sets, default_reps, default_load, default_rest',
            )
            .order('name'),
        ]);

        if (!ativo) return;

        if (alunosRes.data && alunosRes.data.length > 0) {
          const cores = ['#6B7280', '#B45309', '#4B5563', '#9D174D', '#16A34A'];
          const alunosMapeados: Aluno[] = alunosRes.data.map(
            (item: { id: string; name: string }, index: number) => ({
              id: item.id,
              nome: item.name,
              iniciais: gerarIniciais(item.name),
              corAvatar: cores[index % cores.length] ?? '#6B7280',
              treinoAtual: 'Treino ativo',
            }),
          );
          setAlunos(alunosMapeados);
          if (alunosMapeados.length > 0) {
            setAlunoSelecionado((atual) => atual ?? alunosMapeados[0]);
          }
        }

        if (exerciciosRes.data && exerciciosRes.data.length > 0) {
          const exerciciosMapeados: ExercicioCatalogo[] = exerciciosRes.data.map(
            (item: {
              id: string;
              name: string;
              muscle_group?: string;
              equipment?: string;
              default_sets?: number;
              default_reps?: string;
              default_load?: number;
              default_rest?: number;
            }) => ({
              id: item.id,
              nome: item.name,
              grupoMuscular:
                (item.muscle_group as Exclude<GrupoMuscular, 'Todos'>) || 'Peito',
              equipamento: item.equipment || 'Livre',
              seriesPadrao: item.default_sets || 3,
              repeticoesPadrao: item.default_reps || '10 repetições',
              cargaPadraoKg: item.default_load || 20,
              descansoPadraoSegundos: item.default_rest || 60,
            }),
          );
          setExerciciosCatalogo(exerciciosMapeados);
        }
      } catch {
        // Falha silenciosa: usa os dados padrão do Figma sem interromper a navegação
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregarDadosRemotos();

    return () => {
      ativo = false;
    };
  }, [session]);

  // Carrega rascunho salvo do AsyncStorage
  useEffect(() => {
    async function carregarRascunho() {
      try {
        const salvo = await AsyncStorage.getItem(CHAVE_RASCUNHO);
        if (salvo) {
          const dados = JSON.parse(salvo);
          if (dados.alunoSelecionado) setAlunoSelecionado(dados.alunoSelecionado);
          if (dados.exerciciosSelecionados?.length) {
            setExerciciosSelecionados(dados.exerciciosSelecionados);
          }
          if (dados.tituloTreino) setTituloTreino(dados.tituloTreino);
          if (dados.etapaAtual) setEtapaAtual(dados.etapaAtual);
        }
      } catch {
        // Ignora erros ao recuperar rascunho
      }
    }

    carregarRascunho();
  }, []);

  // Salva rascunho no AsyncStorage
  const salvarRascunho = useCallback(async () => {
    try {
      await AsyncStorage.setItem(
        CHAVE_RASCUNHO,
        JSON.stringify({
          etapaAtual,
          alunoSelecionado,
          exerciciosSelecionados,
          tituloTreino,
        }),
      );
    } catch {
      // Ignora erro de gravação
    }
  }, [etapaAtual, alunoSelecionado, exerciciosSelecionados, tituloTreino]);

  useEffect(() => {
    salvarRascunho();
  }, [salvarRascunho]);

  // Ações de seleção de aluno
  const selecionarAluno = useCallback((aluno: Aluno) => {
    setAlunoSelecionado(aluno);
  }, []);

  // Ações de seleção de exercícios
  const estaExercicioSelecionado = useCallback(
    (exercicioId: string) => {
      return exerciciosSelecionados.some(
        (item) => item.exercicioId === exercicioId,
      );
    },
    [exerciciosSelecionados],
  );

  const alternarSelecaoExercicio = useCallback(
    (exercicio: ExercicioCatalogo) => {
      setExerciciosSelecionados((anteriores) => {
        const jaExiste = anteriores.some(
          (item) => item.exercicioId === exercicio.id,
        );
        if (jaExiste) {
          return anteriores.filter((item) => item.exercicioId !== exercicio.id);
        }

        const novoItem: ExercicioConfigurado = {
          id: `cfg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          exercicioId: exercicio.id,
          nome: exercicio.nome,
          grupoMuscular: exercicio.grupoMuscular,
          equipamento: exercicio.equipamento,
          series: exercicio.seriesPadrao,
          repeticoes: exercicio.repeticoesPadrao,
          cargaKg: exercicio.cargaPadraoKg,
          descansoSegundos: exercicio.descansoPadraoSegundos,
        };

        return [...anteriores, novoItem];
      });
    },
    [],
  );

  const atualizarConfiguracaoExercicio = useCallback(
    (idConfigurado: string, novosDados: Partial<ExercicioConfigurado>) => {
      setExerciciosSelecionados((anteriores) =>
        anteriores.map((item) =>
          item.id === idConfigurado ? { ...item, ...novosDados } : item,
        ),
      );
    },
    [],
  );

  const removerExercicio = useCallback((idConfigurado: string) => {
    setExerciciosSelecionados((anteriores) =>
      anteriores.filter((item) => item.id !== idConfigurado),
    );
  }, []);

  // Navegação entre etapas
  const irParaEtapa = useCallback((etapa: 1 | 2 | 3) => {
    setEtapaAtual(etapa);
  }, []);

  const avancarParaExercicios = useCallback(() => {
    setEtapaAtual(2);
  }, []);

  const avancarParaConfiguracao = useCallback(() => {
    setEtapaAtual(3);
  }, []);

  const voltarEtapa = useCallback(() => {
    setEtapaAtual((anterior) => (anterior > 1 ? ((anterior - 1) as 1 | 2 | 3) : 1));
  }, []);

  // Reinicia o fluxo para um novo treino
  const reiniciarCriacao = useCallback(async () => {
    setEtapaAtual(1);
    setAlunoSelecionado(alunos[0] ?? null);
    setExerciciosSelecionados([]);
    setTituloTreino('Treino A – Peito + Tríceps');
    try {
      await AsyncStorage.removeItem(CHAVE_RASCUNHO);
    } catch {
      // Ignora erro
    }
  }, [alunos]);

  // Salvar treino final
  const salvarTreino = useCallback(async (): Promise<{
    sucesso: boolean;
    mensagem: string;
  }> => {
    if (!alunoSelecionado) {
      return { sucesso: false, mensagem: 'Selecione um aluno para o treino.' };
    }

    if (exerciciosSelecionados.length === 0) {
      return {
        sucesso: false,
        mensagem: 'Adicione pelo menos um exercício ao treino.',
      };
    }

    setSalvando(true);

    const novoTreino: TreinoCompleto = {
      id: `treino-${Date.now()}`,
      titulo: tituloTreino.trim() || 'Treino Personalizado',
      alunoId: alunoSelecionado.id,
      alunoNome: alunoSelecionado.nome,
      alunoIniciais: alunoSelecionado.iniciais,
      alunoCorAvatar: alunoSelecionado.corAvatar,
      dataAgendada,
      exercicios: exerciciosSelecionados,
      criadoEm: new Date().toISOString(),
    };

    try {
      // 1. Tenta salvar no Supabase se houver conexão e tabela disponível
      if (session) {
        try {
          await supabase.from('workouts').insert({
            title: novoTreino.titulo,
            student_id: alunoSelecionado.id.startsWith('aluno-')
              ? null
              : alunoSelecionado.id,
            scheduled_at: new Date().toISOString(),
          });
        } catch {
          // Se a tabela remota falhar, continua e persiste no cache local
        }
      }

      // 2. Persistência local garantida no AsyncStorage
      const historicoAnterior = await AsyncStorage.getItem(
        CHAVE_HISTORICO_TREINOS,
      );
      const listaTreinos: TreinoCompleto[] = historicoAnterior
        ? JSON.parse(historicoAnterior)
        : [];
      listaTreinos.unshift(novoTreino);
      await AsyncStorage.setItem(
        CHAVE_HISTORICO_TREINOS,
        JSON.stringify(listaTreinos),
      );

      // 3. Limpa rascunho
      await AsyncStorage.removeItem(CHAVE_RASCUNHO);

      return {
        sucesso: true,
        mensagem: `Treino "${novoTreino.titulo}" para ${alunoSelecionado.nome} salvo com sucesso!`,
      };
    } catch (err) {
      return {
        sucesso: false,
        mensagem:
          err instanceof Error
            ? err.message
            : 'Não foi possível salvar o treino.',
      };
    } finally {
      setSalvando(false);
    }
  }, [alunoSelecionado, exerciciosSelecionados, tituloTreino, dataAgendada, session]);

  // Filtros aplicados
  const alunosFiltrados = alunos.filter((aluno) =>
    aluno.nome.toLowerCase().includes(buscaAluno.toLowerCase().trim()),
  );

  const exerciciosFiltrados = exerciciosCatalogo.filter((exercicio) => {
    const bateTexto = exercicio.nome
      .toLowerCase()
      .includes(buscaExercicio.toLowerCase().trim());
    const bateGrupo =
      filtroGrupoMuscular === 'Todos' ||
      exercicio.grupoMuscular === filtroGrupoMuscular;
    return bateTexto && bateGrupo;
  });

  return {
    etapaAtual,
    irParaEtapa,
    avancarParaExercicios,
    avancarParaConfiguracao,
    voltarEtapa,
    reiniciarCriacao,
    // Alunos
    alunos: alunosFiltrados,
    alunoSelecionado,
    selecionarAluno,
    buscaAluno,
    setBuscaAluno,
    // Exercícios
    exercicios: exerciciosFiltrados,
    exerciciosSelecionados,
    estaExercicioSelecionado,
    alternarSelecaoExercicio,
    atualizarConfiguracaoExercicio,
    removerExercicio,
    buscaExercicio,
    setBuscaExercicio,
    filtroGrupoMuscular,
    setFiltroGrupoMuscular,
    // Treino
    tituloTreino,
    setTituloTreino,
    dataAgendada,
    setDataAgendada,
    // Controle
    carregando,
    salvando,
    salvarTreino,
  };
}
