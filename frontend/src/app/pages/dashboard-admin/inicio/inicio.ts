import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InterfaceHabitaciones } from '../../../modelsAModificar/habitaciones.model';
import { Habitaciones } from '../../../services/habitaciones-services';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard-admin-inicio',
  styleUrl: './inicio.css',
  templateUrl: './inicio.html',
})
export class DashboardAdminInicio implements OnInit{ 

  private _habitacionesService = inject(Habitaciones);
 
  habitacionesList = signal<InterfaceHabitaciones[]>([]);
  disponiblesCount = 0;
  ocupadasCount = 0;
  mantenimientoCount= 0;

  ngOnInit(): void {
    this.cargarHabitaciones();
  }

  cargarHabitaciones(): void{
    this._habitacionesService.obtenerHabitaciones().subscribe({
      next: (habitacionesList) =>{

        console.log('habitaciones recibidas:', habitacionesList);
        
        this.habitacionesList.set(habitacionesList);
        console.log('lista asignada', this.habitacionesList);
        console.log('cantidad:', this.habitacionesList.length);


        this.calcularTotales();
      },
      error:(error)=>{
        console.error(error)
      }
    });
  }

  calcularTotales(): void {
    this.disponiblesCount = this.habitacionesList().filter(h => h.estado === 'Disponible').length;
    this.ocupadasCount = this.habitacionesList().filter(h => h.estado === 'Ocupada').length;
    this.mantenimientoCount = this.habitacionesList().filter(h => h.estado === 'Mantenimiento').length;
  }
}







 
  


