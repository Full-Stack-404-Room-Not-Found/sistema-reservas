import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EMPTY, Observable, forkJoin, of, switchMap } from 'rxjs';
import { HabitacionService } from '../../../services/habitacion.service';
import { ComodidadService } from '../../../services/comodidad.service';
import { Habitacion } from '../../../models/habitacion';
import { Comodidad } from '../../../models/comodidad';
import { HabitacionComodidad } from '../../../models/habitacion-comodidad';

// CU-03 Gestión de Habitaciones, flujos 1 y 2. Un solo componente en dos modos:
// sin id en la ruta es alta, con id es edición.
@Component({
  selector: 'app-crear-habitacion',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './crear-habitacion.html',
  styleUrl: './crear-habitacion.css',
})
export class CrearHabitacion implements OnInit {
  @Input() id!: string;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private habitacionService = inject(HabitacionService);
  private comodidadService = inject(ComodidadService);
  private cd = inject(ChangeDetectorRef);

  comodidadesDisponibles: Comodidad[] = [];
  private relacionesPrevias: HabitacionComodidad[] = [];

  error = '';
  guardando = false;

  // Formulario reactivo, como el resto de la aplicación. Los mensajes del CU-03
  // se siguen armando en guardar(), en el mismo orden que antes.
  form = this.fb.group({
    numero: this.fb.nonNullable.control('', Validators.required),
    tipo: this.fb.nonNullable.control('', Validators.required),
    estado: this.fb.nonNullable.control('Disponible'),
    precio_noche: this.fb.control<number | null>(null, Validators.required),
    capacidad: this.fb.control<number | null>(null, Validators.required),
    descripcion: this.fb.nonNullable.control('', Validators.required),
    // Un checkbox por comodidad, en el mismo orden que comodidadesDisponibles
    comodidades: this.fb.array<FormControl<boolean>>([]),
  });

  get comodidadesForm(): FormArray<FormControl<boolean>> {
    return this.form.controls.comodidades;
  }

  // ========== CARGA INICIAL ==========
  // Las comodidades salen de la API, no de una lista fija: sin eso no se conocen
  // los id que necesitan las filas de la tabla puente.
  ngOnInit(): void {
    // forkJoin trae las comodidades y, en la edición, las que ya tiene la habitación.
    // En el alta no hay relaciones previas: of([]) emite una lista vacía.
    const relaciones$ = this.id
      ? this.comodidadService.listarRelaciones(this.id)
      : of([] as HabitacionComodidad[]);

    forkJoin({ comodidades: this.comodidadService.listar(), relaciones: relaciones$ }).subscribe({
      next: ({ comodidades, relaciones }) => {
        this.comodidadesDisponibles = comodidades;
        this.relacionesPrevias = relaciones;
        this.comodidadesForm.clear();
        comodidades.forEach((comodidad) =>
          this.comodidadesForm.push(
            this.fb.nonNullable.control(
              relaciones.some((relacion) => relacion.id_comodidad === comodidad.id),
            ),
          ),
        );
        this.cd.markForCheck();
      },
      error: (error) => this.fallar(error),
    });

    if (this.id) {
      this.habitacionService.obtener(this.id).subscribe({
        next: (habitacion) => {
          this.form.patchValue({
            numero: habitacion.numero,
            tipo: habitacion.tipo,
            estado: habitacion.estado,
            precio_noche: habitacion.precio_noche,
            capacidad: habitacion.capacidad,
            descripcion: habitacion.descripcion ?? '',
          });
          this.cd.markForCheck();
        },
        error: (error) => this.fallar(error),
      });
    }
  }

  // ========== GUARDAR ==========
  // Las cuatro validaciones del CU-03, en orden. A4 va antes que A3 porque A3
  // cubre precio y capacidad juntos y taparía el mensaje específico de capacidad.
  guardar(): void {
    this.error = '';

    const valores = this.form.getRawValue();
    const numero = String(valores.numero).trim();
    const descripcion = valores.descripcion.trim();
    const precio = Number(valores.precio_noche);
    const capacidad = Number(valores.capacidad);

    // CU-03-A2: algún obligatorio vacío (form.invalid) o con solo espacios
    if (this.form.invalid || !numero || !descripcion) {
      this.error = 'Complete todos los campos obligatorios';
      return;
    }

    // CU-03-A4
    if (capacidad < 1) {
      this.error = 'La capacidad debe ser al menos 1 persona';
      return;
    }

    // CU-03-A3
    if (precio <= 0) {
      this.error = 'Verifique los datos ingresados (precio > 0, capacidad ≥ 1)';
      return;
    }

    this.guardando = true;

    // CU-03-A1, y después el guardado: cada switchMap arranca cuando terminó el pedido anterior
    this.habitacionService
      .buscarPorNumero(numero)
      .pipe(
        switchMap((existentes) => {
          const duplicada = existentes.some((otra) => String(otra.id) !== this.id);
          if (duplicada) {
            this.error = 'Ya existe una habitación con ese número';
            this.guardando = false;
            this.cd.markForCheck();
            return EMPTY;
          }

          return this.persistir({
            numero,
            tipo: valores.tipo,
            estado: valores.estado,
            precio_noche: precio,
            capacidad,
            descripcion,
          });
        }),
        switchMap((guardada) =>
          this.sincronizarComodidades(this.id ? Number(this.id) : Number(guardada.id)),
        ),
      )
      .subscribe({
        next: () => this.volverAlListado(),
        error: (error) => this.fallar(error),
      });
  }

  // ========== PERSISTENCIA ==========
  // Devuelve el pedido sin suscribirse: quien lo encadena es guardar()
  private persistir(datos: Habitacion): Observable<Habitacion> {
    if (this.id) {
      return this.habitacionService.actualizar(this.id, { ...datos, id: Number(this.id) });
    }
    return this.habitacionService.crear(datos);
  }

  // forkJoin lanza las altas y bajas de la tabla puente a la vez y emite cuando terminaron
  // todas. Si no cambió ninguna comodidad, of(null) deja seguir igual.
  private sincronizarComodidades(idHabitacion: number): Observable<unknown> {
    const pedidos: Observable<unknown>[] = [];

    this.comodidadesDisponibles.forEach((comodidad, i) => {
      const previa = this.relacionesPrevias.find((r) => r.id_comodidad === comodidad.id);
      const marcada = this.comodidadesForm.at(i).value;
      if (marcada && !previa) {
        pedidos.push(this.comodidadService.crearRelacion(idHabitacion, Number(comodidad.id)));
      }
      if (!marcada && previa) {
        // Sin id propio (PK compuesta): la baja se identifica por el id de la comodidad
        pedidos.push(this.comodidadService.eliminarRelacion(idHabitacion, Number(comodidad.id)));
      }
    });

    return pedidos.length > 0 ? forkJoin(pedidos) : of(null);
  }

  private volverAlListado(): void {
    this.router.navigate(['/dashboard-admin/inicio']);
  }

  private fallar(error: Error): void {
    this.error = error.message;
    this.guardando = false;
    this.cd.markForCheck();
  }
}
