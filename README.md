<img src="./maqueta/imagenes/banner_principal.png">

# Sistema de Gestión de Reservas

---

## 🛎️ Descripción

Sistema web de gestión hotelera que permite administrar reservas, habitaciones y servicios adicionales, integrando frontend y backend en una solución centralizada

---

## ❗ Problema

En hoteles pequeños y medianos, la gestión manual o con herramientas aisladas genera errores como doble reserva y pérdida de información de servicios, debido a la falta de un sistema centralizado y en tiempo real.

---

## 🔑 Objetivo

Desarrollar una aplicación web para la administración hotelera que permita organizar y gestionar el flujo de huéspedes, facilitando a los usuarios buscar, visualizar, reservar habitaciones y solicitar servicios adicionales, como también visualizar métricas de ocupación.

---

## ⚙️ Funcionalidades principales

- Gestión de reservas de habitaciones
- Visualización de disponibilidad en tiempo real
- Registro y administración de usuarios
- Gestión de servicios adicionales del hotel
- Panel de administración
- Consulta de métricas e indicadores de ocupación
- Sistema de autenticación con roles de usuario y administrador

---

## 🛠️ Información General

Sistema de reservas hoteleras desarrollado con Angular.
El proyecto permite gestionar la navegación entre las diferentes secciones de la aplicación y cuenta con páginas de inicio, autenticación, información
institucional y dashboard administrativo.

La aplicación está desarrollada utilizando una arquitectura basada en
componentes y rutas de Angular.

---

## 🛠️ Tecnologías

- Frontend: Angular (HTML5, CSS, TypeScript, Bootstrap, Node.js, npm)
- Control de versiones: Git y GitHub
- Backend: Python, Django y Django REST Framework (API REST en `/api/v1/`)
- Base de datos: MySQL
- API de desarrollo (evidencia 5, ya reemplazada): json-server sobre `frontend/db.json`

---

## 📂 Estructura del proyecto

- `/backend`
- `/frontend`
  - src/app/ →incluye componentes y configuraciones de las rutas
  - src/app/api.config.ts →url base de la API, en un solo lugar
  - src/app/models/ →interfaces de las nueve entidades del modelo relacional
  - src/app/services/ →acceso a la API: habitación, comodidad, reserva, pago y autenticación
  - src/app/pages/ →incluye las páginas principales de la aplicación
  - src/app/pages/auth/ →incluye páginas relacionadas con el login y registro
  - src/app/pages/dashboard-usuario/ →panel del usuario: buscador, reserva, confirmación e historial
  - src/app/pages/dashboard-admin/ →panel del administrador: listado, alta, edición y detalle de habitaciones
  - src/app/pages/not-found →página de error 404
  - src/app/app.routes.ts →configuración de las páginas
  - src/app/app.html →plantilla principal de la aplicación
  - public/ imágenes →utilizadas en la aplicación
  - db.json →datos de prueba que sirve json-server

  Rutas de la aplicación

  Públicas:
  - `/` →Página de inicio
  - `/quienes-somos` →Página de Quiénes Somos
  - `/login` →Página de inicio de sesión
  - `/registro` →Página de registro de cuentas

  Panel del usuario:
  - `/dashboard-usuario/inicio` →Buscador de habitaciones disponibles
  - `/dashboard-usuario/reservar/:id` →Detalle de la habitación y alta de la reserva
  - `/dashboard-usuario/confirmacion` →Confirmación de la reserva con su pago
  - `/dashboard-usuario/historial` →Historial de reservas del usuario

  Panel del administrador:
  - `/dashboard-admin/inicio` →Listado de habitaciones y contadores por estado
  - `/dashboard-admin/crear-habitacion` →Alta de una habitación
  - `/dashboard-admin/habitacion/:id` →Detalle de la habitación con sus comodidades
  - `/dashboard-admin/habitacion/:id/editar` →Edición de la habitación

  Cualquier otra ruta cae en la página de error 404.

- `/maqueta`

---

## ▶️ Instalación y ejecución del programa

El sistema tiene dos partes que se ejecutan por separado y al mismo tiempo:

- **Backend:** API REST con Django y Django REST Framework, conectada a MySQL (carpeta `backend`).
- **Frontend:** aplicación Angular que consume esa API (carpeta `frontend`).

> Los comandos de esta guía son para **Git Bash** (la terminal que se instala con
> Git para Windows; en VS Code, elegir *Git Bash* como terminal). Si usás
> **CMD**, al final de esta sección hay una tabla de equivalencias.

### 1. Requisitos

Instalar antes de empezar:

| Herramienta | Versión | Para qué se usa | Cómo verificar |
| --- | --- | --- | --- |
| Git (incluye Git Bash) | cualquiera reciente | Clonar el repositorio y usar la terminal | `git --version` |
| Python | 3.10 o superior | Ejecutar el backend | `python --version` |
| MySQL Server | 8.0 o superior | Base de datos | `mysql --version` |
| MySQL Workbench | opcional | Ejecutar el script SQL de forma visual | — |
| Node.js | 22.22 o superior (incluye npm) | Ejecutar el frontend | `node --version` |
| Navegador web | cualquiera | Usar la aplicación | — |

Durante la instalación de MySQL se define la contraseña del usuario `root`:
**anotarla**, porque se usa en el paso 3.3.

### 2. Clonar el repositorio

```bash
git clone https://github.com/Full-Stack-404-Room-Not-Found/sistema-reservas.git
cd sistema-reservas
```

### 3. Configurar y levantar el backend

Abrir una terminal en la carpeta `backend`:

```bash
cd backend
```

**3.1. Crear y activar el entorno virtual** (aísla las librerías de Python del proyecto):

```bash
python -m venv venv
source venv/Scripts/activate
```

Si se activó bien, la terminal muestra `(venv)`. Hay que activarlo **cada vez**
que se abre una terminal nueva para trabajar con el backend.

**3.2. Instalar las dependencias** (Django, Django REST Framework, CORS, el
driver de MySQL y `python-dotenv`, que lee el archivo `.env`):

```bash
pip install -r requirements.txt
```

**3.3. Configurar la conexión a MySQL con el archivo `.env`.** Copiar la
plantilla y completar la contraseña de `root`:

```bash
cp .env.example .env
```

Abrir `backend/.env` con cualquier editor y completar:

```
DB_NAME=sistema_reservas
DB_USER=root
DB_PASSWORD=la_contraseña_de_root
DB_HOST=localhost
DB_PORT=3306
```

> Django lee este archivo al arrancar, así que **no hay que volver a escribir la
> contraseña** en cada terminal. El `.env` está en el `.gitignore`: cada
> integrante tiene el suyo y **nunca se sube al repositorio**.

**3.4. Crear la base de datos con los datos iniciales.** El script
`database/sistema_reservas.sql` crea la base `sistema_reservas` y sus 9 tablas
**exactamente como el Modelo Relacional** (claves, `CHECK`, `ON DELETE`), y carga
los datos de prueba. Elegir una de estas dos formas:

- **Consola** (pide la contraseña de `root`):

  ```bash
  mysql -u root -p < database/sistema_reservas.sql
  ```

- **MySQL Workbench:** *File → Open SQL Script*, elegir
  `backend/database/sistema_reservas.sql` y ejecutarlo con el botón del rayo.

**3.5. Crear las tablas internas de Django** (panel de administración, sesiones, etc.).
El `--fake-initial` le indica a Django que las tablas del sistema ya las creó el script:

```bash
python manage.py migrate --fake-initial
```

> **El orden importa:** primero el script (3.4) y después `migrate --fake-initial` (3.5).
> Si se corre `migrate` sobre una base vacía, Django crea las tablas sin los `CHECK`
> ni las acciones `ON DELETE` del Modelo Relacional.

**3.6. (Opcional) Crear un superusuario** para entrar al panel de administración
de Django en `http://localhost:8000/admin`:

```bash
winpty python manage.py createsuperuser
```

> En Git Bash se antepone `winpty` para que la pregunta de la contraseña funcione
> bien. Este superusuario **no** sirve para iniciar sesión en la aplicación de
> Angular: para eso están los usuarios de prueba del paso 5.

**3.7. Levantar el servidor del backend:**

```bash
python manage.py runserver
```

Para comprobar que funciona, abrir en el navegador
`http://localhost:8000/api/v1/habitaciones`: tiene que mostrar el listado de
habitaciones. **Dejar esta terminal abierta.**

> Las rutas de la API van **sin barra final**: `.../api/v1/habitaciones` funciona y
> `.../api/v1/habitaciones/` responde 404. El detalle de los endpoints está en
> [`backend/readme.md`](backend/readme.md).

### 4. Configurar y levantar el frontend

Abrir **otra terminal** (la del backend tiene que seguir abierta) en la carpeta `frontend`:

```bash
cd sistema-reservas/frontend
```

**4.1. Instalar las dependencias** (solo la primera vez, o si cambió el `package.json`):

```bash
npm install
```

**4.2. Levantar la aplicación:**

```bash
npm start
```

**Dejar esta terminal abierta.** Cualquier cambio en el código actualiza la
aplicación automáticamente.

### 5. Usar la aplicación

Abrir `http://localhost:4200` en el navegador e iniciar sesión con alguno de
los usuarios de prueba:

| Rol | Email | Clave |
| --- | --- | --- |
| Administrador | `admin@404roomnotfound.com` | `admin123` |
| Usuario | `martina.ferreyra@gmail.com` | `martina123` |
| Usuario | `diego.sosa@gmail.com` | `diego123` |

También se puede crear una cuenta nueva desde *Registrar*.

### 6. Uso diario (después de la primera instalación)

La instalación se hace una sola vez. Las próximas veces alcanza con abrir dos terminales:

| Terminal | Carpeta | Comandos | Qué levanta |
| --- | --- | --- | --- |
| 1 | `backend` | `source venv/Scripts/activate`<br>`python manage.py runserver` | La API de Django, en `http://localhost:8000/api/v1` |
| 2 | `frontend` | `npm start` | La aplicación Angular, en `http://localhost:4200` |

**Sin el backend corriendo, las pantallas se ven pero no muestran datos.** La
URL de la API está configurada en `frontend/src/app/api.config.ts`.

**Para recrear la base desde cero** (por ejemplo, si cambió el script):

```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS sistema_reservas;"
mysql -u root -p < database/sistema_reservas.sql
python manage.py migrate --fake-initial
```

### 7. Problemas comunes

| Mensaje o síntoma | Causa probable | Solución |
| --- | --- | --- |
| `No module named 'dotenv'` o `No module named 'django'` | El entorno virtual no está activado o faltan dependencias | `source venv/Scripts/activate` (debe verse `(venv)`) y `pip install -r requirements.txt` |
| `Access denied for user 'root'@'localhost'` | Falta el archivo `.env` o la contraseña es incorrecta | Revisar `DB_PASSWORD` en `backend/.env` (paso 3.3) |
| `Can't connect to MySQL server on 'localhost'` | El servicio de MySQL está detenido | Iniciar el servicio *MySQL80* desde *Servicios* de Windows o desde MySQL Workbench |
| `Unknown database 'sistema_reservas'` | No se ejecutó el script SQL | Volver al paso 3.4 |
| `mysql: command not found` | MySQL no está en el PATH de Windows | Ejecutar el script desde MySQL Workbench (paso 3.4) |
| `createsuperuser` se queda colgado al pedir la contraseña | Git Bash sin `winpty` | Usar `winpty python manage.py createsuperuser` |
| Una ruta de la API responde 404 | La URL termina en `/` | Quitar la barra final: `/api/v1/habitaciones`, no `/api/v1/habitaciones/` |
| `Error: That port is already in use` | Ya hay otro backend corriendo | Cerrar la otra terminal o usar `python manage.py runserver 8001` (y cambiar el puerto en `api.config.ts`) |
| `The Angular CLI requires a minimum Node.js version` | Versión de Node.js antigua | Instalar Node.js 22.22 o superior |
| La aplicación abre pero no muestra datos | El backend no está corriendo | Levantar el backend (paso 3.7) |

### Equivalencias para CMD

Si se usa la terminal **CMD** de Windows en lugar de Git Bash, cambian estos comandos:

| Acción | Git Bash | CMD |
| --- | --- | --- |
| Activar el entorno virtual | `source venv/Scripts/activate` | `venv\Scripts\activate` |
| Copiar la plantilla del `.env` | `cp .env.example .env` | `copy .env.example .env` |
| Ejecutar el script SQL | `mysql -u root -p < database/sistema_reservas.sql` | `mysql -u root -p < database\sistema_reservas.sql` |
| Crear el superusuario | `winpty python manage.py createsuperuser` | `python manage.py createsuperuser` |
| Ir a la carpeta del frontend | `cd sistema-reservas/frontend` | `cd sistema-reservas\frontend` |

Más detalles del backend (endpoints, validaciones, códigos de estado y
consistencia con el Modelo Relacional) en [`backend/readme.md`](backend/readme.md).

---

## 🚀 Estado del proyecto

🟡 En desarrollo

---

## 👥 Integrantes

- Nancy Maribel Morales - nancymorales1994
- Julieta Victoria Cabrera - JuliCabrera
- Lorena Paola Pereyra - lore376
- Romina Vanesa HUK - rohu17
- Laura Analía Brizuela - gerbena03
- Fernando Agustín Moyano - FernandoAMoyano

---

## 🔗 Organización

https://github.com/Full-Stack-404-Room-Not-Found
