import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { InterfaceHabitaciones } from '../modelsAModificar/habitaciones.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Habitaciones {
  url: string="http://localhost:3000/habitaciones";

  constructor(private _httpClient: HttpClient){}

  obtenerHabitaciones(): Observable<InterfaceHabitaciones[]>{
    return this._httpClient.get<InterfaceHabitaciones[]>(this.url);

  }

 

}
