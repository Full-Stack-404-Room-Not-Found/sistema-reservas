import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private url = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient) {}

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(this.url, reserva);
  }
}