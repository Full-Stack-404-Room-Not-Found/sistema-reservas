import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Habitacion } from '../models/habitacion';
import { Reserva } from '../models/reserva';
import { API_URL } from '../api.config';

// Servicio de la colección habitaciones. Incluye filtrarPorFechas(), la regla de
// negocio central del proyecto: el problema de la doble reserva del Documento ABP.
@Injectable({
  providedIn: 'root',
})
export class HabitacionService {
  private url = `${API_URL}/habitaciones`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(this.url).pipe(catchError(this.handleError));
  }

  obtener(id: string): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  listarDisponibles(tipo: string, capacidad: number): Observable<Habitacion[]> {
    let consulta = `estado=Disponible&capacidad_gte=${capacidad}`;
    if (tipo) {
      consulta += `&tipo=${encodeURIComponent(tipo)}`;
    }
    return this.http
      .get<Habitacion[]>(`${this.url}?${consulta}`)
      .pipe(catchError(this.handleError));
  }

  buscarPorNumero(numero: string): Observable<Habitacion[]> {
    const consulta = `numero=${encodeURIComponent(numero)}`;
    return this.http
      .get<Habitacion[]>(`${this.url}?${consulta}`)
      .pipe(catchError(this.handleError));
  }

  crear(habitacion: Habitacion): Observable<Habitacion> {
    return this.http.post<Habitacion>(this.url, habitacion).pipe(catchError(this.handleError));
  }

  actualizar(id: string, habitacion: Habitacion): Observable<Habitacion> {
    return this.http
      .put<Habitacion>(`${this.url}/${id}`, habitacion)
      .pipe(catchError(this.handleError));
  }

  eliminar(id: string): Observable<unknown> {
    return this.http.delete(`${this.url}/${id}`).pipe(catchError(this.handleError));
  }

  actualizarEstado(id: number, estado: string): Observable<Habitacion> {
    return this.http
      .patch<Habitacion>(`${this.url}/${id}`, { estado })
      .pipe(catchError(this.handleError));
  }

  // Descarta las habitaciones con una reserva no cancelada superpuesta al rango pedido.
  // Dos rangos se superponen cuando checkin_pedido < checkout_existente y checkout_pedido > checkin_existente.
  filtrarPorFechas(
    habitaciones: Habitacion[],
    reservas: Reserva[],
    checkin: string,
    checkout: string,
  ): Habitacion[] {
    const ocupadas = reservas
      .filter((reserva) => reserva.estado !== 'Cancelada')
      .filter((reserva) => checkin < reserva.fecha_checkout && checkout > reserva.fecha_checkin)
      .map((reserva) => reserva.id_habitacion);

    return habitaciones.filter((habitacion) => !ocupadas.includes(Number(habitacion.id)));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al consultar habitaciones', error.status, error.error);
    return throwError(() => new Error('No se pudieron obtener las habitaciones.'));
  }
}
