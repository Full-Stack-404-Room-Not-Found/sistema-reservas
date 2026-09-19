import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HabitacionDisponibleService } from '../../services/habitacion-disponible.service';
import { Habitacion } from '../../models/habitacion.model';

@Component({
  selector: 'app-habitaciones-disponibles',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './habitaciones-disponibles.html',
  styleUrl: './habitaciones-disponibles.css'
})
export class HabitacionesDisponibles implements OnInit {
  habitaciones: Habitacion[] = [];
  cargando = true;
  error = '';

  constructor(private habitacionService: HabitacionDisponibleService) { }

  ngOnInit(): void {
    this.cargarDisponibles();
  }

  cargarDisponibles(): void {
    this.cargando = true;
    this.habitacionService.obtenerDisponibles().subscribe({
      next: (data) => {
        this.habitaciones = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar habitaciones disponibles';
        this.cargando = false;
        console.error(err);
      }
    });
  }
}
