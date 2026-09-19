import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Habitacion } from '../models/habitacion.model';

@Injectable({
    providedIn: 'root'
})
export class HabitacionDisponibleService {
    private apiUrl = 'http://localhost:3000/habitaciones';

    constructor(private http: HttpClient) { }

    // ⭐ Caso de uso: obtener habitaciones disponibles
    obtenerDisponibles(): Observable<Habitacion[]> {
        return this.http.get<Habitacion[]>(`${this.apiUrl}?estado=Disponible`);
    }
}