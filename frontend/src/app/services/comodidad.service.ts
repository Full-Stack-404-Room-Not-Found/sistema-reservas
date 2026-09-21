import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Comodidad } from '../models/comodidad';
import { HabitacionComodidad } from '../models/habitacion-comodidad';
import { API_URL } from '../api.config';

// Servicio de las comodidades y de la tabla puente habitacion_comodidad.
@Injectable({
  providedIn: 'root',
})
export class ComodidadService {
  private url = `${API_URL}/comodidades`;
  private urlRelaciones = `${API_URL}/habitacion_comodidad`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Comodidad[]> {
    return this.http.get<Comodidad[]>(this.url).pipe(catchError(this.handleError));
  }

  listarRelaciones(idHabitacion: string): Observable<HabitacionComodidad[]> {
    const consulta = `id_habitacion=${encodeURIComponent(idHabitacion)}`;
    return this.http
      .get<HabitacionComodidad[]>(`${this.urlRelaciones}?${consulta}`)
      .pipe(catchError(this.handleError));
  }

  crearRelacion(idHabitacion: number, idComodidad: number): Observable<HabitacionComodidad> {
    const relacion: HabitacionComodidad = {
      id_habitacion: idHabitacion,
      id_comodidad: idComodidad,
    };
    return this.http
      .post<HabitacionComodidad>(this.urlRelaciones, relacion)
      .pipe(catchError(this.handleError));
  }

  eliminarRelacion(id: number): Observable<unknown> {
    return this.http.delete(`${this.urlRelaciones}/${id}`).pipe(catchError(this.handleError));
  }

  // json-server no hace joins: el cruce de la tabla puente se resuelve acá
  nombresDe(relaciones: HabitacionComodidad[], comodidades: Comodidad[]): string[] {
    return relaciones
      .map((relacion) => comodidades.find((comodidad) => comodidad.id === relacion.id_comodidad))
      .filter((comodidad) => comodidad !== undefined)
      .map((comodidad) => comodidad.nombre_comodidad);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error al consultar comodidades', error.status, error.error);
    return throwError(() => new Error('No se pudieron obtener las comodidades.'));
  }
}
