# Backend - Sistema de Gestión de Reservas

API REST del sistema, desarrollada con **Django** y **Django REST Framework**
sobre una base de datos **MySQL**. La consume la SPA de Angular de la carpeta
`frontend`.

---

## 🧩 Estructura: una aplicación por componente

El proyecto se divide en cuatro aplicaciones de Django. Cada una es un
componente del diagrama de componentes UML y tiene sus propios modelos,
serializers, vistas y rutas.

| Aplicación     | Responsabilidad                                     | Tablas                                        | Depende de               |
| -------------- | --------------------------------------------------- | --------------------------------------------- | ------------------------ |
| `usuarios`     | Roles, registro e inicio de sesión                  | `rol`, `usuario`                              | —                        |
| `habitaciones` | Habitaciones y sus comodidades                      | `habitacion`, `comodidad`, `habitacion_comodidad` | —                    |
| `reservas`     | Reservas, servicios adicionales y la doble reserva | `reserva`, `servicio`, `reserva_servicio`     | `usuarios`, `habitaciones` |
| `pagos`        | Pagos de cada reserva                               | `pago`                                        | `reservas`               |

### Consistencia con el Modelo Relacional

La base de datos respeta **exactamente** el Modelo Relacional entregado (DER-MR):
mismos nombres de tablas y columnas, tipos (`INT`, `VARCHAR(n)`, `DECIMAL(10,2)`,
`DATE`, `DATETIME`), nulos y claves.

- **PK con nombre propio:** `id_rol`, `id_usuario`, `id_habitacion`, `id_comodidad`,
  `id_reserva`, `id_servicio` e `id_pago`. En los modelos de Django el atributo se
  llama `id` y la columna se mapea con `db_column`, así el JSON de la API conserva
  la clave `"id"`.
- **PK compuesta** en las tablas puente: `habitacion_comodidad (id_habitacion, id_comodidad)`
  y `reserva_servicio (id_reserva, id_servicio)`, con `CompositePrimaryKey` de Django 5.2.
  Esas dos tablas no tienen `id` propio: sus registros se identifican por el par de claves.
- El script `database/sistema_reservas.sql` es la **fuente oficial** de la estructura:
  crea las tablas con los `CHECK` y las acciones `ON DELETE` del MR.

```
backend/
├── manage.py
├── requirements.txt
├── database/
│   └── sistema_reservas.sql   ← script de creación de la base con datos iniciales
├── sistema_reservas/          ← proyecto: settings.py, urls.py, validacion.py
├── usuarios/                  ← models.py, serializers.py, views.py, urls.py, admin.py
├── habitaciones/
├── reservas/
└── pagos/
```

Flujo de cada pedido: **urls.py → vista (APIView) → serializer → modelo → MySQL**,
y la respuesta vuelve en JSON.

---

## ⚙️ Requisitos

- Python 3.10 o superior
- MySQL 8 (o MariaDB 10.5+) con MySQL Workbench o la consola `mysql`

---

## 🚀 Instalación y ejecución

Los comandos son para la terminal **Command Prompt (CMD)** de Windows, desde la
carpeta `backend`.

1. **Crear y activar el entorno virtual**

   ```
   python -m venv venv
   venv\Scripts\activate
   ```

2. **Instalar las dependencias**

   ```
   pip install -r requirements.txt
   ```

3. **Configurar la conexión a MySQL.** Copiar `.env.example` como `.env` y
   completar la contraseña de tu MySQL:

   ```
   copy .env.example .env
   ```

   ```
   DB_NAME=sistema_reservas
   DB_USER=root
   DB_PASSWORD=tu_contraseña
   DB_HOST=localhost
   DB_PORT=3306
   ```

   `settings.py` lee este archivo al arrancar (con `python-dotenv`). El `.env`
   está en el `.gitignore`: **cada integrante tiene el suyo y nunca se sube al
   repositorio**. Como alternativa, se puede definir la variable en la terminal
   con `set DB_PASSWORD=tu_contraseña` (solo dura mientras esa terminal esté abierta).

4. **Crear la base de datos con los datos iniciales.** Ejecutar el script
   `database/sistema_reservas.sql`, desde MySQL Workbench (*File → Open SQL
   Script* y el botón del rayo) o desde la consola:

   ```
   mysql -u root -p < database\sistema_reservas.sql
   ```

5. **Crear las tablas propias de Django** (admin, sesiones, etc.). El
   `--fake-initial` le indica a Django que las tablas del sistema ya las creó
   el script:

   ```
   python manage.py migrate --fake-initial
   ```

   > **Importante:** el orden es siempre *primero el script, después `migrate --fake-initial`*.
   > Si se corre `migrate` sobre una base vacía, Django crea las tablas sin los
   > `CHECK` ni las acciones `ON DELETE` del MR y la base deja de coincidir con él.
   >
   > **Para recrear la base desde cero** (por ejemplo, después de esta actualización):
   >
   > ```
   > mysql -u root -p -e "DROP DATABASE IF EXISTS sistema_reservas;"
   > mysql -u root -p < database\sistema_reservas.sql
   > python manage.py migrate --fake-initial
   > ```

6. **(Opcional) Crear un superusuario** para entrar al panel de administración
   de Django en `http://localhost:8000/admin`:

   ```
   python manage.py createsuperuser
   ```

   > El panel de Django no admite modelos con PK compuesta, así que
   > `habitacion_comodidad` y `reserva_servicio` no aparecen como tablas propias:
   > se ven como columna en los listados de habitaciones y de reservas, y se
   > gestionan por la API.

7. **Levantar el servidor**

   ```
   python manage.py runserver
   ```

   La API queda en `http://localhost:8000/api/v1/`. Con el frontend corriendo
   (`npm start` en la carpeta `frontend`), la aplicación ya usa estos datos.

---

## 🔐 Usuarios de prueba

| Rol           | Email                        | Clave        |
| ------------- | ---------------------------- | ------------ |
| Administrador | `admin@404roomnotfound.com`  | `admin123`   |
| Usuario       | `martina.ferreyra@gmail.com` | `martina123` |
| Usuario       | `diego.sosa@gmail.com`       | `diego123`   |

---

## 🌐 Endpoints

Las rutas se definen con `path()` y van **sin barra final**: `/api/v1/habitaciones`
y `/api/v1/habitaciones/3` (con barra final responden 404). Las rutas de detalle
reciben el id del registro (`/habitaciones/3`). En las dos tablas puente, que
tienen PK compuesta, el detalle recibe **el par de claves**
(`/habitacion_comodidad/1/2` es la comodidad 2 de la habitación 1) y el JSON no
tiene campo `id`: `{"id_habitacion": 1, "id_comodidad": 2}`.

| Recurso | Ruta | Métodos | Filtros (query string) |
| --- | --- | --- | --- |
| Login | `/api/v1/login` | POST | — |
| Roles | `/api/v1/roles` · `/api/v1/roles/<id>` | GET, POST · GET, PUT, PATCH, DELETE | — |
| Usuarios | `/api/v1/usuarios` · `/api/v1/usuarios/<id>` | GET, POST · GET, PUT, PATCH, DELETE | `email`, `id_rol` |
| Habitaciones | `/api/v1/habitaciones` · `/api/v1/habitaciones/<id>` | GET, POST · GET, PUT, PATCH, DELETE | `estado`, `tipo`, `numero`, `capacidad_gte` |
| Comodidades | `/api/v1/comodidades` · `/api/v1/comodidades/<id>` | GET, POST · GET, PUT, PATCH, DELETE | — |
| Comodidades por habitación | `/api/v1/habitacion_comodidad` · `/api/v1/habitacion_comodidad/<id_habitacion>/<id_comodidad>` | GET, POST · GET, DELETE | `id_habitacion` |
| Reservas | `/api/v1/reservas` · `/api/v1/reservas/<id>` | GET, POST · GET, PUT, PATCH, DELETE | `id_usuario`, `id_habitacion`, `estado` |
| Servicios | `/api/v1/servicios` · `/api/v1/servicios/<id>` | GET, POST · GET, PUT, PATCH, DELETE | — |
| Servicios por reserva | `/api/v1/reserva_servicio` · `/api/v1/reserva_servicio/<id_reserva>/<id_servicio>` | GET, POST · GET, PUT, PATCH, DELETE | `id_reserva` |
| Pagos | `/api/v1/pagos` · `/api/v1/pagos/<id>` | GET, POST · GET, PUT, PATCH, DELETE | `id_reserva`, `estado` |

### Códigos de estado

| Código | Cuándo |
| --- | --- |
| 200 OK | Consulta, edición o login correctos |
| 201 Created | Alta de un registro |
| 204 No Content | Registro eliminado |
| 400 Bad Request | Datos inválidos (el cuerpo indica qué campo y por qué) |
| 401 Unauthorized | Login con email o clave incorrectos |
| 404 Not Found | El id no existe |
| 409 Conflict | Borrado bloqueado por datos relacionados (ej. habitación con reservas) |
| 500 Internal Server Error | Error inesperado del servidor (sin exponer detalles internos) |

---

## ✅ Validaciones en la capa de modelos

**En los campos** (restricciones de Django):

- `unique`: email del usuario, número de habitación y nombres de rol, comodidad y servicio.
- `choices`: tipo y estado de habitación (Disponible, Ocupada, Mantenimiento, Inactiva), estado de reserva y estado de pago.
- `RegexValidator`: formato del teléfono.
- `MinLengthValidator`: la clave tiene al menos 6 caracteres.
- `MinValueValidator` / `MaxValueValidator`: capacidad (1 a 10), precios, montos y cantidades.
- PK compuesta: una habitación no puede tener la misma comodidad dos veces y una
  reserva no puede tener el mismo servicio dos veces (se aumenta la cantidad).
  Un par repetido responde 400 con un mensaje claro.
- `reserva_servicio`: en PUT y PATCH no se puede cambiar `id_reserva` ni `id_servicio`,
  porque forman la clave primaria.

**Personalizadas** (método `clean()` del modelo, ejecutado desde el serializer
mediante `sistema_reservas/validacion.py`):

- Habitación: el número tiene que contener al menos un dígito.
- Reserva: el checkout debe ser posterior al checkin.
- Reserva: los huéspedes no pueden superar la capacidad de la habitación.
- Reserva: no se puede reservar una habitación en mantenimiento o inactiva.
- Reserva: **no puede haber dos reservas activas superpuestas en la misma
  habitación** (el problema de la doble reserva que plantea el proyecto).

---

## 🧪 Probar la API

- **Browsable API:** abrir cualquier ruta en el navegador, por ejemplo
  `http://localhost:8000/api/v1/habitaciones`.
- **Postman:** ejemplo de login.

  ```
  POST http://localhost:8000/api/v1/login
  Content-Type: application/json

  { "email": "martina.ferreyra@gmail.com", "clave_acceso": "martina123" }
  ```

  Ejemplo de reserva que choca con otra (responde 400):

  ```
  POST http://localhost:8000/api/v1/reservas
  Content-Type: application/json

  {
    "id_usuario": 2, "id_habitacion": 1,
    "fecha_checkin": "2026-10-04", "fecha_checkout": "2026-10-07",
    "cantidad_huespedes": 2, "estado": "Confirmada", "precio_total": 255000
  }
  ```
