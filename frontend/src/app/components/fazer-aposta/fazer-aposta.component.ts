import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Jogo } from '../../models/jogo.model';
import { JogoService } from '../../services/jogo.service';
import { ApostaService } from '../../services/aposta.service';

@Component({
  selector: 'app-fazer-aposta',
  templateUrl: './fazer-aposta.component.html',
  styleUrls: ['./fazer-aposta.component.css']
})
export class FazerApostaComponent implements OnInit {
  jogo?: Jogo;
  formulario: FormGroup;
  carregando = true;
  enviando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jogoService: JogoService,
    private apostaService: ApostaService,
    private formBuilder: FormBuilder
  ) {
    this.formulario = this.formBuilder.group({
      palpiteGolsCasa: [0, [Validators.required, Validators.min(0)]],
      palpiteGolsFora: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const jogoId = this.route.snapshot.paramMap.get('jogoId');
    if (!jogoId) {
      this.router.navigate(['/jogos']);
      return;
    }

    this.jogoService.obterPorId(jogoId).subscribe({
      next: (jogo) => {
        this.jogo = jogo;
        this.carregando = false;
      },
      error: () => {
        this.mensagemErro = 'Jogo não encontrado';
        this.carregando = false;
      }
    });
  }

  apostar(): void {
    if (this.formulario.invalid || !this.jogo) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.enviando = true;
    this.mensagemErro = '';
    const { palpiteGolsCasa, palpiteGolsFora } = this.formulario.value;

    this.apostaService
      .criar({ jogo: this.jogo._id, palpiteGolsCasa, palpiteGolsFora })
      .subscribe({
        next: () => {
          this.enviando = false;
          this.mensagemSucesso = 'Aposta registrada com sucesso!';
          setTimeout(() => this.router.navigate(['/apostas/historico']), 1200);
        },
        error: (erro) => {
          this.enviando = false;
          this.mensagemErro = erro?.error?.mensagem || 'Não foi possível registrar a aposta';
        }
      });
  }
}
