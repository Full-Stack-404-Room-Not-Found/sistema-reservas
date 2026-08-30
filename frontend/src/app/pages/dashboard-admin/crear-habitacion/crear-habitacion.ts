import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-habitacion',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './crear-habitacion.html',
  styleUrl: './crear-habitacion.css'
})
export class CrearHabitacion {
  @Input() id!: string;

  habitacion = {
    numero: this.id || '',
    tipo: 'Standard',
    estado: 'Disponible',
    precio: 120,
    capacidad: 2,
    descripcion: 'Habitación con vista al mar'
  };

  guardar() {
    alert('✅ Habitación guardada correctamente');
  }
}
