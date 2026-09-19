import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion';

@Injectable({
    providedIn: 'root'
})
export class CrearHabitacionService {
    private url = 'http://localhost:3000/habitaciones'

    constructor(private http: HttpClient){

    }
    crearHabitacion(habitacion: Habitacion): Observable<Habitacion> {
        return this.http.post<Habitacion>(this.url, habitacion);
    }
}
