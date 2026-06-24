import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespostaAutenticacao, Usuario } from '../models/usuario.model';

const CHAVE_TOKEN = 'apostas_copa_token';
const CHAVE_USUARIO = 'apostas_copa_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  registrar(nome: string, email: string, senha: string): Observable<RespostaAutenticacao> {
    return this.http
      .post<RespostaAutenticacao>(`${this.apiUrl}/registrar`, { nome, email, senha })
      .pipe(tap((resposta) => this.salvarSessao(resposta)));
  }

  login(email: string, senha: string): Observable<RespostaAutenticacao> {
    return this.http
      .post<RespostaAutenticacao>(`${this.apiUrl}/login`, { email, senha })
      .pipe(tap((resposta) => this.salvarSessao(resposta)));
  }

  logout(): void {
    localStorage.removeItem(CHAVE_TOKEN);
    localStorage.removeItem(CHAVE_USUARIO);
  }

  private salvarSessao(resposta: RespostaAutenticacao): void {
    localStorage.setItem(CHAVE_TOKEN, resposta.token);
    localStorage.setItem(CHAVE_USUARIO, JSON.stringify(resposta.usuario));
  }

  obterToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
  }

  obterUsuario(): Usuario | null {
    const usuarioSalvo = localStorage.getItem(CHAVE_USUARIO);
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  }

  estaAutenticado(): boolean {
    return !!this.obterToken();
  }

  ehAdmin(): boolean {
    return this.obterUsuario()?.papel === 'admin';
  }
}
