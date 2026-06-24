import { Jogo } from './jogo.model';

export type StatusAposta = 'pendente' | 'acertou_placar' | 'acertou_vencedor' | 'errou';

export interface Aposta {
  _id: string;
  usuario: string;
  jogo: Jogo;
  palpiteGolsCasa: number;
  palpiteGolsFora: number;
  pontosGanhos: number;
  status: StatusAposta;
  createdAt: string;
}

export interface NovaAposta {
  jogo: string;
  palpiteGolsCasa: number;
  palpiteGolsFora: number;
}
