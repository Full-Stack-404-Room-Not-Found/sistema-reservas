import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detalle-habitacion',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-habitacion.html',
  styleUrl: './detalle-habitacion.css'
})
export class DetalleHabitacion {
  @Input() id!: string;
}
