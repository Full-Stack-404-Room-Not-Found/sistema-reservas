import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CrearHabitacionService} from '../../../services/crear-habitacion';

@Component({
  selector: 'app-crear-habitacion',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './crear-habitacion.html',
  styleUrl: './crear-habitacion.css'
})
export class CrearHabitacion implements OnInit {
  @Input() id!: string;

  private router = inject(Router);
  private crearHabitacionService = inject(CrearHabitacionService)

  comodidadesDisponibles = ['Tv', 'Wifi', 'Aire acondicionado'];

  habitacion = {
    numero: '',
    tipo: 'Standard',
    estado: 'Disponible',
    precio_noche: 120,
    capacidad: 2,
    comodidades: [false, false, false],
    descripcion: 'Habitación con vista al mar'
  };

  ngOnInit(): void {
    if (this.id) this.habitacion.numero = this.id;
  }

  guardar() {

    this.crearHabitacionService.crearHabitacion(this.habitacion)
    .subscribe({
      next:(respuesta) => {
        console.log('Habitación creada correctamente:', respuesta);
        this.router.navigate(['/dashboard-admin/inicio']);
      },
      error:(error) => {
        console.error('Error al crear la habitación:', error);
      }   
    })
  }
}
