import { Component, OnInit } from '@angular/core';
import { Jogo } from '../../models/jogo.model';
import { JogoService } from '../../services/jogo.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-lista-jogos',
  templateUrl: './lista-jogos.component.html',
  styleUrls: ['./lista-jogos.component.css']
})
export class ListaJogosComponent implements OnInit {
  jogos: Jogo[] = [];
  carregando = true;
  mensagemErro = '';

  constructor(private jogoService: JogoService, public authService: AuthService) {}

  ngOnInit(): void {
    this.carregarJogos();
  }

  carregarJogos(): void {
    this.carregando = true;
    this.jogoService.listar().subscribe({
      next: (jogos) => {
        this.jogos = jogos;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Não foi possível carregar os jogos';
        this.carregando = false;
      }
    });
  }

  podeApostar(jogo: Jogo): boolean {
    return jogo.status === 'agendado' && new Date(jogo.dataHora) > new Date();
  }
}
