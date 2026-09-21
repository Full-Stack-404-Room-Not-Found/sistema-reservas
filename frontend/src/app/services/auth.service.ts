import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { API_URL } from '../api.config';

// Servicio de la colección usuarios. Además del login y el registro, guarda el
// usuario de la sesión: lo leen la reserva y el historial para saber quién opera.
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${API_URL}/usuarios`;

  usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, clave: string): Observable<Usuario[]> {
    const consulta = `email=${encodeURIComponent(email)}&clave_acceso=${encodeURIComponent(clave)}`;
    return this.http.get<Usuario[]>(`${this.url}?${consulta}`).pipe(catchError(this.handleError));
  }

  buscarPorEmail(email: string): Observable<Usuario[]> {
    const consulta = `email=${encodeURIComponent(email)}`;
    return this.http.get<Usuario[]>(`${this.url}?${consulta}`).pipe(catchError(this.handleError));
  }

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, usuario).pipe(catchError(this.handleError));
  }

  guardarSesion(usuario: Usuario): void {
    this.usuarioActual = usuario;
  }

  logout(): void {
    this.usuarioActual = null;
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio de usuarios', error.status, error.error);
    return throwError(() => new Error('No se pudo conectar con el servidor.'));
  }
}
