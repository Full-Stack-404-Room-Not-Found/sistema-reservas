"""
Componente Habitaciones: habitaciones, comodidades y la tabla puente
habitacion_comodidad (relación muchos a muchos entre ambas).

Tablas, columnas, tipos y largos según el Modelo Relacional entregado.
"""
from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Habitacion(models.Model):
    TIPOS = [
        ('Standard', 'Standard'),
        ('Doble', 'Doble'),
        ('Suite', 'Suite'),
        ('Familiar', 'Familiar'),
    ]
    # 'Inactiva' figura en el MR: habitación dada de baja sin borrar su historial
    ESTADOS = [
        ('Disponible', 'Disponible'),
        ('Ocupada', 'Ocupada'),
        ('Mantenimiento', 'Mantenimiento'),
        ('Inactiva', 'Inactiva'),
    ]

    # PK del MR: id_habitacion. El atributo de Python sigue siendo "id" (ver usuarios/models.py)
    id = models.AutoField(primary_key=True, db_column='id_habitacion')
    numero = models.CharField(
        max_length=10,
        unique=True,
        help_text='Número de habitación. No se puede repetir.',
    )
    # choices restringe el campo a los mismos valores del <select> del frontend
    tipo = models.CharField(max_length=30, choices=TIPOS)
    capacidad = models.IntegerField(
        validators=[
            MinValueValidator(1, 'La capacidad mínima es 1 huésped.'),
            MaxValueValidator(10, 'La capacidad máxima es 10 huéspedes.'),
        ]
    )
    precio_noche = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'), 'El precio por noche debe ser mayor a 0.')],
    )
    estado = models.CharField(max_length=20, choices=ESTADOS, default='Disponible')
    # VARCHAR(500) NULL según el MR: el administrador puede dejarla vacía
    descripcion = models.CharField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'habitacion'
        verbose_name = 'habitación'
        verbose_name_plural = 'habitaciones'
        ordering = ['id']

    def __str__(self):
        return f'Habitación {self.numero} ({self.tipo})'

    def clean(self):
        # Validación personalizada: el número tiene que tener al menos un dígito
        if self.numero and not any(caracter.isdigit() for caracter in self.numero):
            raise ValidationError({'numero': 'El número de habitación debe contener al menos un dígito.'})


class Comodidad(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_comodidad')
    nombre_comodidad = models.CharField(
        max_length=50,
        unique=True,
        help_text='Nombre de la comodidad (Tv, Wifi...). Debe ser único.',
    )

    class Meta:
        db_table = 'comodidad'
        verbose_name = 'comodidad'
        verbose_name_plural = 'comodidades'
        ordering = ['id']

    def __str__(self):
        return self.nombre_comodidad


class HabitacionComodidad(models.Model):
    # PK compuesta, como en el MR: el par (id_habitacion, id_comodidad)
    # identifica la fila y no se puede repetir. No hay columna id propia.
    pk = models.CompositePrimaryKey('id_habitacion', 'id_comodidad')
    # CASCADE: si se borra una habitación o una comodidad, se borran sus relaciones
    id_habitacion = models.ForeignKey(
        Habitacion,
        on_delete=models.CASCADE,
        db_column='id_habitacion',
        related_name='comodidades',
    )
    id_comodidad = models.ForeignKey(
        Comodidad,
        on_delete=models.CASCADE,
        db_column='id_comodidad',
        related_name='habitaciones',
    )

    class Meta:
        db_table = 'habitacion_comodidad'
        verbose_name = 'comodidad de habitación'
        verbose_name_plural = 'comodidades de habitaciones'
        ordering = ['id_habitacion', 'id_comodidad']

    def __str__(self):
        return f'{self.id_habitacion} - {self.id_comodidad}'

    def clean(self):
        # La PK compuesta ya impide el duplicado en MySQL, pero respondería con
        # un error interno. Se valida antes para devolver un 400 con mensaje claro.
        if self._state.adding and self.id_habitacion_id and self.id_comodidad_id:
            existe = HabitacionComodidad.objects.filter(
                id_habitacion=self.id_habitacion_id,
                id_comodidad=self.id_comodidad_id,
            ).exists()
            if existe:
                raise ValidationError({'id_comodidad': 'La habitación ya tiene esta comodidad asignada.'})
