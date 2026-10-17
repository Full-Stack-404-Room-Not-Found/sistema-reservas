"""
Componente Reservas: reservas, servicios adicionales y la tabla puente
reserva_servicio. Depende de los componentes Usuarios y Habitaciones.

Tablas, columnas, tipos y largos según el Modelo Relacional entregado.
"""
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models

from habitaciones.models import Habitacion
from usuarios.models import Usuario


class Reserva(models.Model):
    ESTADOS = [
        ('Pendiente', 'Pendiente'),
        ('Confirmada', 'Confirmada'),
        ('Finalizada', 'Finalizada'),
        ('Cancelada', 'Cancelada'),
    ]

    id = models.AutoField(primary_key=True, db_column='id_reserva')
    # PROTECT: no se puede borrar un usuario o una habitación con reservas
    id_usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column='id_usuario',
        related_name='reservas',
    )
    id_habitacion = models.ForeignKey(
        Habitacion,
        on_delete=models.PROTECT,
        db_column='id_habitacion',
        related_name='reservas',
    )
    fecha_checkin = models.DateField()
    fecha_checkout = models.DateField()
    cantidad_huespedes = models.IntegerField(
        validators=[MinValueValidator(1, 'La reserva debe tener al menos 1 huésped.')]
    )
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Pendiente')
    precio_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0, 'El precio total no puede ser negativo.')],
    )

    class Meta:
        db_table = 'reserva'
        verbose_name = 'reserva'
        verbose_name_plural = 'reservas'
        ordering = ['id']

    def __str__(self):
        return f'Reserva {self.pk} - habitación {self.id_habitacion_id} ({self.fecha_checkin} a {self.fecha_checkout})'

    def clean(self):
        """
        Validaciones personalizadas de la reserva (reglas de negocio del MR):
        1. El checkout tiene que ser posterior al checkin.
        2. Los huéspedes no pueden superar la capacidad de la habitación.
        3. No se puede reservar una habitación en mantenimiento o inactiva.
        4. No puede haber dos reservas activas superpuestas en la misma
           habitación: es el problema de la doble reserva del Documento ABP.
        """
        errores = {}

        if self.fecha_checkin and self.fecha_checkout and self.fecha_checkout <= self.fecha_checkin:
            errores['fecha_checkout'] = 'La fecha de checkout debe ser posterior a la de checkin.'

        # id_habitacion_id es el número guardado en la columna id_habitacion
        habitacion = None
        if self.id_habitacion_id:
            habitacion = Habitacion.objects.filter(pk=self.id_habitacion_id).first()

        if habitacion and self.cantidad_huespedes and self.cantidad_huespedes > habitacion.capacidad:
            errores['cantidad_huespedes'] = (
                f'La habitación {habitacion.numero} admite como máximo {habitacion.capacidad} huéspedes.'
            )

        # Solo al crear: una reserva vieja se puede seguir editando aunque la
        # habitación haya pasado a mantenimiento o a inactiva después.
        if habitacion and self.pk is None and habitacion.estado in ('Mantenimiento', 'Inactiva'):
            errores['id_habitacion'] = (
                f'La habitación está en estado {habitacion.estado.lower()} y no se puede reservar.'
            )

        # Dos rangos se superponen cuando checkin_nuevo < checkout_existente
        # y checkout_nuevo > checkin_existente (misma regla que el frontend).
        if habitacion and self.estado != 'Cancelada' and 'fecha_checkout' not in errores \
                and self.fecha_checkin and self.fecha_checkout:
            superpuestas = (
                Reserva.objects.filter(
                    id_habitacion=habitacion,
                    fecha_checkin__lt=self.fecha_checkout,
                    fecha_checkout__gt=self.fecha_checkin,
                )
                .exclude(estado='Cancelada')
                .exclude(pk=self.pk)
            )
            if superpuestas.exists():
                errores['fecha_checkin'] = 'La habitación ya tiene una reserva en esas fechas.'

        if errores:
            raise ValidationError(errores)


class Servicio(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_servicio')
    nombre = models.CharField(
        max_length=50,
        unique=True,
        help_text='Nombre del servicio adicional. Debe ser único.',
    )
    # VARCHAR(500) NULL según el MR
    descripcion = models.CharField(max_length=500, blank=True, null=True)
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0, 'El precio no puede ser negativo.')],
    )

    class Meta:
        db_table = 'servicio'
        verbose_name = 'servicio'
        verbose_name_plural = 'servicios'
        ordering = ['id']

    def __str__(self):
        return self.nombre


class ReservaServicio(models.Model):
    # PK compuesta, como en el MR: un servicio aparece una sola vez por reserva
    # (si se contrata más de una vez, se aumenta la cantidad).
    pk = models.CompositePrimaryKey('id_reserva', 'id_servicio')
    # Si se borra la reserva se borran sus servicios; un servicio con
    # consumos registrados no se puede borrar (PROTECT / ON DELETE RESTRICT).
    id_reserva = models.ForeignKey(
        Reserva,
        on_delete=models.CASCADE,
        db_column='id_reserva',
        related_name='servicios',
    )
    id_servicio = models.ForeignKey(
        Servicio,
        on_delete=models.PROTECT,
        db_column='id_servicio',
        related_name='reservas',
    )
    cantidad = models.IntegerField(
        validators=[MinValueValidator(1, 'La cantidad mínima es 1.')]
    )
    # Precio al momento de contratarlo: si después cambia el precio del
    # servicio, el de esta reserva queda igual.
    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0, 'El precio unitario no puede ser negativo.')],
    )

    class Meta:
        db_table = 'reserva_servicio'
        verbose_name = 'servicio de reserva'
        verbose_name_plural = 'servicios de reservas'
        ordering = ['id_reserva', 'id_servicio']

    def __str__(self):
        return f'Reserva {self.id_reserva_id} - {self.id_servicio} x{self.cantidad}'

    def clean(self):
        # La PK compuesta impide el duplicado en MySQL; se valida antes para
        # responder 400 con un mensaje claro en lugar de un error interno.
        if self._state.adding and self.id_reserva_id and self.id_servicio_id:
            existe = ReservaServicio.objects.filter(
                id_reserva=self.id_reserva_id,
                id_servicio=self.id_servicio_id,
            ).exists()
            if existe:
                raise ValidationError(
                    {'id_servicio': 'La reserva ya tiene este servicio. Modificá la cantidad en su lugar.'}
                )
