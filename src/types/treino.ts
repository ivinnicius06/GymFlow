export type GrupoMuscular =
  | 'Todos'
  | 'Peito'
  | 'Costas'
  | 'Pernas'
  | 'Ombros'
  | 'Braços';

export interface Aluno {
  id: string;
  nome: string;
  iniciais: string;
  corAvatar: string;
  treinoAtual?: string;
  email?: string;
}

export interface ExercicioCatalogo {
  id: string;
  nome: string;
  grupoMuscular: Exclude<GrupoMuscular, 'Todos'>;
  equipamento: string;
  seriesPadrao: number;
  repeticoesPadrao: string;
  cargaPadraoKg: number;
  descansoPadraoSegundos: number;
}

export interface ExercicioConfigurado {
  id: string; // identificador único do exercício dentro deste treino
  exercicioId: string; // id do catálogo
  nome: string;
  grupoMuscular: string;
  equipamento: string;
  series: number;
  repeticoes: string;
  cargaKg: number;
  descansoSegundos: number;
}

export interface TreinoCompleto {
  id: string;
  titulo: string;
  alunoId: string;
  alunoNome: string;
  alunoIniciais: string;
  alunoCorAvatar: string;
  dataAgendada: string;
  exercicios: ExercicioConfigurado[];
  criadoEm: string;
}
