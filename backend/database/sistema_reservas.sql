-- =====================================================================
-- Sistema de Gestión de Reservas - Script de creación de base de datos
-- (Corregido estrictamente según el Modelo Relacional)
-- =====================================================================

CREATE DATABASE IF NOT EXISTS sistema_reservas
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE sistema_reservas;

-- ---------------------------------------------------------------------
-- Componente Usuarios
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS rol (
    id_rol      INT         NOT NULL AUTO_INCREMENT,
    nombre_rol  VARCHAR(30) NOT NULL,
    PRIMARY KEY (id_rol),
    UNIQUE KEY uq_rol_nombre (nombre_rol)
);

CREATE TABLE IF NOT EXISTS usuario (
    id_usuario      INT          NOT NULL AUTO_INCREMENT,
    id_rol          INT          NOT NULL,
    nombre          VARCHAR(50)  NOT NULL,
    apellido        VARCHAR(50)  NOT NULL,
    email           VARCHAR(100) NOT NULL,
    telefono        VARCHAR(20)  NULL,
    clave_acceso    VARCHAR(100) NOT NULL,
    fecha_registro  DATE         NOT NULL,
    PRIMARY KEY (id_usuario),
    UNIQUE KEY uq_usuario_email (email),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol (id_rol) ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Componente Habitaciones
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS habitacion (
    id_habitacion INT            NOT NULL AUTO_INCREMENT,
    numero        VARCHAR(10)    NOT NULL,
    tipo          VARCHAR(30)    NOT NULL,
    capacidad     INT            NOT NULL,
    precio_noche  DECIMAL(10, 2) NOT NULL,
    estado        VARCHAR(20)    NOT NULL DEFAULT 'Disponible',
    descripcion   VARCHAR(500)   NULL,
    PRIMARY KEY (id_habitacion),
    UNIQUE KEY uq_habitacion_numero (numero),
    CONSTRAINT ck_habitacion_tipo      CHECK (tipo IN ('Standard', 'Doble', 'Suite', 'Familiar')),
    CONSTRAINT ck_habitacion_estado    CHECK (estado IN ('Disponible', 'Ocupada', 'Mantenimiento', 'Inactiva')),
    CONSTRAINT ck_habitacion_capacidad CHECK (capacidad BETWEEN 1 AND 10),
    CONSTRAINT ck_habitacion_precio    CHECK (precio_noche > 0)
);

CREATE TABLE IF NOT EXISTS comodidad (
    id_comodidad     INT         NOT NULL AUTO_INCREMENT,
    nombre_comodidad VARCHAR(50) NOT NULL,
    PRIMARY KEY (id_comodidad),
    UNIQUE KEY uq_comodidad_nombre (nombre_comodidad)
);

-- Tabla puente: relación muchos a muchos entre habitación y comodidad (PK Compuesta)
CREATE TABLE IF NOT EXISTS habitacion_comodidad (
    id_habitacion INT NOT NULL,
    id_comodidad  INT NOT NULL,
    PRIMARY KEY (id_habitacion, id_comodidad),
    CONSTRAINT fk_hc_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitacion (id_habitacion) ON DELETE CASCADE,
    CONSTRAINT fk_hc_comodidad  FOREIGN KEY (id_comodidad)  REFERENCES comodidad (id_comodidad)  ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- Componente Reservas
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reserva (
    id_reserva         INT            NOT NULL AUTO_INCREMENT,
    id_usuario         INT            NOT NULL,
    id_habitacion      INT            NOT NULL,
    fecha_checkin      DATE           NOT NULL,
    fecha_checkout     DATE           NOT NULL,
    cantidad_huespedes INT            NOT NULL,
    estado             VARCHAR(20)    NOT NULL DEFAULT 'Pendiente',
    precio_total       DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_reserva),
    CONSTRAINT ck_reserva_fechas    CHECK (fecha_checkout > fecha_checkin),
    CONSTRAINT ck_reserva_huespedes CHECK (cantidad_huespedes >= 1),
    CONSTRAINT ck_reserva_estado    CHECK (estado IN ('Pendiente', 'Confirmada', 'Finalizada', 'Cancelada')),
    CONSTRAINT ck_reserva_precio    CHECK (precio_total >= 0),
    CONSTRAINT fk_reserva_usuario    FOREIGN KEY (id_usuario)    REFERENCES usuario (id_usuario)    ON DELETE RESTRICT,
    CONSTRAINT fk_reserva_habitacion FOREIGN KEY (id_habitacion) REFERENCES habitacion (id_habitacion) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS servicio (
    id_servicio INT            NOT NULL AUTO_INCREMENT,
    nombre      VARCHAR(50)    NOT NULL,
    descripcion VARCHAR(500)   NULL,
    precio      DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_servicio),
    UNIQUE KEY uq_servicio_nombre (nombre),
    CONSTRAINT ck_servicio_precio CHECK (precio >= 0)
);

-- Tabla puente: servicios adicionales (PK Compuesta)
CREATE TABLE IF NOT EXISTS reserva_servicio (
    id_reserva      INT            NOT NULL,
    id_servicio     INT            NOT NULL,
    cantidad        INT            NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id_reserva, id_servicio),
    CONSTRAINT ck_rs_cantidad CHECK (cantidad >= 1),
    CONSTRAINT ck_rs_precio   CHECK (precio_unitario >= 0),
    CONSTRAINT fk_rs_reserva  FOREIGN KEY (id_reserva)  REFERENCES reserva (id_reserva)  ON DELETE CASCADE,
    CONSTRAINT fk_rs_servicio FOREIGN KEY (id_servicio) REFERENCES servicio (id_servicio) ON DELETE RESTRICT
);

-- ---------------------------------------------------------------------
-- Componente Pagos
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pago (
    id_pago    INT            NOT NULL AUTO_INCREMENT,
    id_reserva INT            NOT NULL,
    estado     VARCHAR(20)    NOT NULL DEFAULT 'Pendiente',
    monto      DECIMAL(10, 2) NOT NULL,
    fecha      DATETIME       NOT NULL,
    PRIMARY KEY (id_pago),
    CONSTRAINT ck_pago_estado CHECK (estado IN ('Pendiente', 'Confirmado', 'Rechazado')),
    CONSTRAINT ck_pago_monto  CHECK (monto >= 0),
    CONSTRAINT fk_pago_reserva FOREIGN KEY (id_reserva) REFERENCES reserva (id_reserva) ON DELETE RESTRICT
);

-- =====================================================================
-- DATOS INICIALES
-- =====================================================================

INSERT INTO rol (id_rol, nombre_rol) VALUES
    (1, 'Administrador'),
    (2, 'Usuario');

INSERT INTO usuario (id_usuario, id_rol, nombre, apellido, email, telefono, clave_acceso, fecha_registro) VALUES
    (1, 1, 'Carolina', 'Ahumada',  'admin@404roomnotfound.com',  '351-4000000', 'admin123',   '2026-02-10'),
    (2, 2, 'Martina',  'Ferreyra', 'martina.ferreyra@gmail.com', '351-5512233', 'martina123', '2026-04-02'),
    (3, 2, 'Diego',    'Sosa',     'diego.sosa@gmail.com',       '351-6698745', 'diego123',   '2026-06-21');

INSERT INTO habitacion (id_habitacion, numero, tipo, capacidad, precio_noche, estado, descripcion) VALUES
    (1, '101', 'Standard', 2,  85000.00, 'Disponible',    'Habitación standard con cama matrimonial, baño privado y vista interna.'),
    (2, '102', 'Standard', 2,  85000.00, 'Disponible',    'Habitación standard con dos camas individuales y baño privado.'),
    (3, '103', 'Doble',    3, 120000.00, 'Ocupada',       'Habitación doble con cama matrimonial y un sofá cama, balcón al jardín.'),
    (4, '104', 'Suite',    2, 250000.00, 'Disponible',    'Suite con área de estar, cama king y vista panorámica a la ciudad.'),
    (5, '105', 'Familiar', 4, 180000.00, 'Mantenimiento', 'Habitación familiar con una cama matrimonial y dos individuales.');

INSERT INTO comodidad (id_comodidad, nombre_comodidad) VALUES
    (1, 'Tv'),
    (2, 'Wifi'),
    (3, 'Aire acondicionado');

-- Modificado: Sin ID subrogado, insertando directo sobre la PK compuesta
INSERT INTO habitacion_comodidad (id_habitacion, id_comodidad) VALUES
    (1, 1), (1, 2),
    (2, 2),
    (3, 1), (3, 2), (3, 3),
    (4, 1), (4, 2), (4, 3),
    (5, 2), (5, 3);

INSERT INTO reserva (id_reserva, id_usuario, id_habitacion, fecha_checkin, fecha_checkout, cantidad_huespedes, estado, precio_total) VALUES
    (1, 2, 4, '2026-08-14', '2026-08-18', 2, 'Finalizada', 1000000.00),
    (2, 3, 3, '2026-09-15', '2026-09-20', 3, 'Confirmada',  600000.00),
    (3, 2, 1, '2026-10-03', '2026-10-05', 2, 'Confirmada',  170000.00),
    (4, 3, 5, '2026-11-20', '2026-11-23', 4, 'Pendiente',   540000.00),
    (5, 2, 2, '2026-12-26', '2026-12-28', 2, 'Cancelada',   170000.00);

INSERT INTO servicio (id_servicio, nombre, descripcion, precio) VALUES
    (1, 'Desayuno',               'Desayuno buffet, de 7 a 10.',                    12000.00),
    (2, 'Spa',                    'Acceso al spa por día, con toallas incluidas.',  25000.00),
    (3, 'Traslado al aeropuerto', 'Traslado ida o vuelta al aeropuerto Taravella.', 30000.00),
    (4, 'Cochera',                'Cochera cubierta por noche.',                     8000.00);

-- Modificado: Sin ID subrogado, insertando directo sobre la PK compuesta
INSERT INTO reserva_servicio (id_reserva, id_servicio, cantidad, precio_unitario) VALUES
    (1, 1, 4, 11000.00),
    (1, 2, 2, 25000.00),
    (2, 1, 5, 12000.00),
    (3, 4, 2,  8000.00),
    (4, 3, 1, 30000.00);

INSERT INTO pago (id_pago, id_reserva, estado, monto, fecha) VALUES
    (1, 1, 'Confirmado', 500000.00, '2026-08-01 10:15:00'),
    (2, 1, 'Confirmado', 594000.00, '2026-08-14 09:02:00'),
    (3, 2, 'Confirmado', 330000.00, '2026-09-05 18:40:00'),
    (4, 3, 'Pendiente',  186000.00, '2026-09-16 12:00:00'),
    (5, 5, 'Rechazado',  170000.00, '2026-09-10 20:25:00');

-- Ajuste de los autoincrementables
ALTER TABLE rol      AUTO_INCREMENT = 3;
ALTER TABLE usuario  AUTO_INCREMENT = 4;
ALTER TABLE habitacion AUTO_INCREMENT = 6;
ALTER TABLE comodidad  AUTO_INCREMENT = 4;
ALTER TABLE reserva    AUTO_INCREMENT = 6;
ALTER TABLE servicio   AUTO_INCREMENT = 5;
ALTER TABLE pago       AUTO_INCREMENT = 6;