import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formulario: FormGroup;
  mensagemErro = '';
  carregando = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.formulario = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  entrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.mensagemErro = '';
    this.carregando = true;
    const { email, senha } = this.formulario.value;

    this.authService.login(email, senha).subscribe({
      next: () => {
        this.carregando = false;
        this.router.navigate(['/jogos']);
      },
      error: (erro) => {
        this.carregando = false;
        this.mensagemErro = erro?.error?.mensagem || 'Não foi possível realizar o login';
      }
    });
  }
}
