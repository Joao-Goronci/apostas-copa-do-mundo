import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Jogo } from '../models/jogo.model';

@Injectable({ providedIn: 'root' })
export class JogoService {
  private readonly apiUrl = `${environment.apiUrl}/jogos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Jogo[]> {
    return this.http.get<Jogo[]>(this.apiUrl);
  }

  obterPorId(id: string): Observable<Jogo> {
    return this.http.get<Jogo>(`${this.apiUrl}/${id}`);
  }
}
