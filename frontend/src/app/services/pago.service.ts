import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Pago } from '../models/pago';
import { API_URL } from '../api.config';

// Servicio de la colección pagos. El pago se crea solo al confirmar una reserva:
// el sistema no le pide un método de pago al usuario, porque PAGO no tiene esa columna.
@Injectable({
  providedIn: 'root',
})
export class PagoService {
  private url = `${API_URL}/pagos`;

  constructor(private http: HttpClient) {}

  listarPorReserva(idReserva: string): Observable<Pago[]> {
    const consulta = `id_reserva=${encodeURIComponent(idReserva)}`;
    return this.http.get<Pago[]>(`${this.url}?${consulta}`).pipe(catchError(this.handleError));
  }

  crear(pago: Pago): Observable<Pago> {
    return this.http.post<Pago>(this.url, pago).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en el servicio de pagos', error.status, error.error);
    return throwError(() => new Error('No se pudo registrar el pago.'));
  }
}
