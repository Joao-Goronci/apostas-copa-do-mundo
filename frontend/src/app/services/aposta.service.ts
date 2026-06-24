import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Aposta, NovaAposta } from '../models/aposta.model';

@Injectable({ providedIn: 'root' })
export class ApostaService {
  private readonly apiUrl = `${environment.apiUrl}/apostas`;

  constructor(private http: HttpClient) {}

  criar(novaAposta: NovaAposta): Observable<{ mensagem: string; aposta: Aposta }> {
    return this.http.post<{ mensagem: string; aposta: Aposta }>(this.apiUrl, novaAposta);
  }

  listarMinhas(): Observable<Aposta[]> {
    return this.http.get<Aposta[]>(`${this.apiUrl}/minhas`);
  }

  remover(id: string): Observable<{ mensagem: string }> {
    return this.http.delete<{ mensagem: string }>(`${this.apiUrl}/${id}`);
  }
}
