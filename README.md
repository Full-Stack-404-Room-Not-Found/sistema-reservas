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
- API de desarrollo: json-server sobre `frontend/db.json`
- Backend: (Python)
- Base de datos: MYSQL

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

- Requisitos Antes de ejecutar el proyecto:
  - Tener instalado Node.js
  - npm
  - Un navegador web
  - Opcional: Visual Studio Code para trabajar con el código
- Pasos:
  - Clonar el repositorio. git clone https://github.com/Full-Stack-404-Room-Not-Found/sistema-reservas.git
  - Acceder a la carpeta del proyecto (sistema-reservas)
  - Ingresar a la carpeta frontend
  - Instalar las dependencias: npm install
  - Iniciar la aplicación en modo desarrollo: npm start o ng serve
  - Iniciado el servidor abrir en el navegador con el puerto indicado.
  - Cualquier cambio generado en el código se actualizará la aplicación automáticamente

### 🔌 Levantar la aplicación y la API

La aplicación consume una API servida con json-server a partir de `frontend/db.json`.
**Sin la API corriendo, las pantallas se ven pero no muestran datos.**

Hacen falta **dos terminales abiertas** a la vez, las dos desde la carpeta `frontend`:

| Terminal | Comando       | Qué levanta                                       |
| -------- | ------------- | ------------------------------------------------- |
| 1        | `npm start`   | La aplicación Angular, en `http://localhost:4200` |
| 2        | `npm run api` | La API de json-server, en `http://localhost:3000` |

El puerto 3000 es el que está configurado en `src/app/api.config.ts`. Las dos
terminales tienen que quedar abiertas mientras se usa la aplicación.

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
