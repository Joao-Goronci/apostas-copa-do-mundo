import { Component, OnInit } from '@angular/core';
import { Aposta } from '../../models/aposta.model';
import { ApostaService } from '../../services/aposta.service';

@Component({
  selector: 'app-historico-apostas',
  templateUrl: './historico-apostas.component.html',
  styleUrls: ['./historico-apostas.component.css']
})
export class HistoricoApostasComponent implements OnInit {
  apostas: Aposta[] = [];
  carregando = true;
  mensagemErro = '';

  constructor(private apostaService: ApostaService) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico(): void {
    this.carregando = true;
    this.apostaService.listarMinhas().subscribe({
      next: (apostas) => {
        this.apostas = apostas;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar seu histórico de apostas';
        this.carregando = false;
      }
    });
  }

  remover(id: string): void {
    if (!confirm('Deseja remover esta aposta?')) {
      return;
    }

    this.apostaService.remover(id).subscribe({
      next: () => this.carregarHistorico(),
      error: () => {
        this.mensagemErro = 'Não foi possível remover a aposta';
      }
    });
  }

  totalPontos(): number {
    return this.apostas.reduce((total, aposta) => total + (aposta.pontosGanhos || 0), 0);
  }
}
