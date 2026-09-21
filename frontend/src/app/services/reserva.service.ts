import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Reserva } from '../models/reserva';
import { Habitacion } from '../models/habitacion';
import { API_URL } from '../api.config';

export interface ReservaConHabitacion {
  reserva: Reserva;
  habitacion: Habitacion | null;
}

// Servicio de la colección reservas: el alta del caso de uso, las consultas del
// historial y las que el buscador y el borrado necesitan para decidir.
@Injectable({
  providedIn: 'root',
})
export class ReservaService {
  private url = `${API_URL}/reservas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.url).pipe(catchError(this.handleError));
  }

  listarPorUsuario(idUsuario: string): Observable<Reserva[]> {
    const consulta = `id_usuario=${encodeURIComponent(idUsuario)}`;
    return this.http.get<Reserva[]>(`${this.url}?${consulta}`).pipe(catchError(this.handleError));
  }

  listarPorHabitacion(idHabitacion: string): Observable<Reserva[]> {
    const consulta = `id_habitacion=${encodeURIComponent(idHabitacion)}`;
    return this.http.get<Reserva[]>(`${this.url}?${consulta}`).pipe(catchError(this.handleError));
  }

  // json-server no resuelve _expand con nuestras claves foráneas: el cruce se hace acá
  conHabitacion(reservas: Reserva[], habitaciones: Habitacion[]): ReservaConHabitacion[] {
    return reservas.map((reserva) => ({
      reserva,
      habitacion: habitaciones.find((h) => h.id === reserva.id_habitacion) ?? null,
    }));
  }

  obtener(id: string): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  crear(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(this.url, reserva).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al consultar reservas', error.status, error.error);
    return throwError(() => new Error('No se pudieron obtener las reservas.'));
  }
}
