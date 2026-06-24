import { Time } from './time.model';

export type FaseJogo = 'grupos' | 'oitavas' | 'quartas' | 'semifinal' | 'final' | 'terceiro_lugar';
export type StatusJogo = 'agendado' | 'em_andamento' | 'finalizado' | 'cancelado';

export interface Jogo {
  _id: string;
  timeCasa: Time;
  timeFora: Time;
  dataHora: string;
  fase: FaseJogo;
  estadio?: string;
  golsCasa: number | null;
  golsFora: number | null;
  status: StatusJogo;
}
