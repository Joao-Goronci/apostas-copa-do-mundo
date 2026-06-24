import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Time } from '../models/time.model';

@Injectable({ providedIn: 'root' })
export class TimeService {
  private readonly apiUrl = `${environment.apiUrl}/times`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Time[]> {
    return this.http.get<Time[]>(this.apiUrl);
  }

  obterPorId(id: string): Observable<Time> {
    return this.http.get<Time>(`${this.apiUrl}/${id}`);
  }
}
