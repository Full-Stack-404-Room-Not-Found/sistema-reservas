"""
Componente Usuarios: roles y cuentas de usuario.

Los nombres de tablas, columnas, tipos y largos respetan el Modelo Relacional
entregado (rol, usuario, id_rol, id_usuario...). El script
database/sistema_reservas.sql crea exactamente estas tablas.
"""
from django.core.validators import MinLengthValidator, RegexValidator
from django.db import models


class Rol(models.Model):
    # PK del MR: id_rol, INT AUTO_INCREMENT. En Python el atributo se sigue
    # llamando "id", así el JSON de la API mantiene la clave "id" que usa el
    # frontend, pero en MySQL la columna se llama id_rol (db_column).
    id = models.AutoField(primary_key=True, db_column='id_rol')
    nombre_rol = models.CharField(
        max_length=30,
        unique=True,
        help_text='Nombre del rol (Administrador o Usuario). Debe ser único.',
    )

    class Meta:
        db_table = 'rol'
        verbose_name = 'rol'
        verbose_name_plural = 'roles'
        ordering = ['id']

    def __str__(self):
        return self.nombre_rol


class Usuario(models.Model):
    id = models.AutoField(primary_key=True, db_column='id_usuario')
    # Relación uno a muchos: un rol tiene muchos usuarios, cada usuario un rol.
    # PROTECT impide borrar un rol mientras tenga usuarios asignados
    # (en MySQL: ON DELETE RESTRICT).
    id_rol = models.ForeignKey(
        Rol,
        on_delete=models.PROTECT,
        db_column='id_rol',
        related_name='usuarios',
        help_text='Rol del usuario.',
    )
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(
        max_length=100,
        unique=True,
        help_text='Correo electrónico único: es el usuario del login.',
    )
    telefono = models.CharField(
        max_length=20,
        blank=True,
        null=True,
        validators=[
            RegexValidator(
                r'^[0-9\- ]{7,20}$',
                'El teléfono solo puede tener números, guiones y espacios (7 a 20 caracteres).',
            )
        ],
    )
    # La consigna no exige encriptar: la clave se compara tal cual en el login.
    clave_acceso = models.CharField(
        max_length=100,
        validators=[MinLengthValidator(6, 'La clave debe tener al menos 6 caracteres.')],
    )
    fecha_registro = models.DateField()

    class Meta:
        db_table = 'usuario'
        verbose_name = 'usuario'
        verbose_name_plural = 'usuarios'
        ordering = ['id']

    def __str__(self):
        return f'{self.nombre} {self.apellido} ({self.email})'
