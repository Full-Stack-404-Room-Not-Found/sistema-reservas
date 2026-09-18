import { Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  comodidadesDisponibles = ['Tv', 'Wifi', 'Aire acondicionado'];

  habitacion = {
    numero: '',
    tipo: 'Standard',
    estado: 'Disponible',
    precio: 120,
    capacidad: 2,
    comodidades: [false, false, false],
    descripcion: 'Habitación con vista al mar'
  };

  ngOnInit(): void {
    if (this.id) this.habitacion.numero = this.id;
  }

  guardar() {
    // TODO: conectar con el servicio de habitaciones
    console.log(this.habitacion);
    this.router.navigate(['/dashboard-admin/inicio']);
  }
}
