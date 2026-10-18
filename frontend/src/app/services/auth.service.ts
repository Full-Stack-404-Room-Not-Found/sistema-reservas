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

  // POST /login de Django: la clave viaja en el cuerpo del pedido y no en la URL.
  // Devuelve el usuario si las credenciales coinciden, o un error 401 si no.
  login(email: string, clave: string): Observable<Usuario> {
    return this.http
      .post<Usuario>(`${API_URL}/login`, { email, clave_acceso: clave })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            return throwError(() => new Error('correo electrónico o contraseña incorrectos'));
          }
          return this.handleError(error);
        }),
      );
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
