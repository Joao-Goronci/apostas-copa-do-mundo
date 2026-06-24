import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  formulario: FormGroup;
  mensagemErro = '';
  carregando = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]]
    });
  }

  cadastrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const { nome, email, senha, confirmarSenha } = this.formulario.value;

    if (senha !== confirmarSenha) {
      this.mensagemErro = 'As senhas informadas não coincidem';
      return;
    }

    this.mensagemErro = '';
    this.carregando = true;

    this.authService.registrar(nome, email, senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/jogos']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = erro?.error?.mensagem || 'Não foi possível concluir o cadastro';
      }
    });
  }
}
