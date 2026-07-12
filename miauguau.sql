-- ============================================================================
--  Base de datos: miauguau
--  Script MySQL 8 completo
--  Plataforma de adopción de mascotas "Miauguau"
--
--  Generado a partir del Modelo Entidad-Relación proporcionado.
--  Motor: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
--  Los `id` son cuids generados por la aplicación (VARCHAR(30), sin AUTO_INCREMENT).
-- ============================================================================

CREATE DATABASE IF NOT EXISTS miauguau
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE miauguau;

-- ============================================================================
--  1. USUARIOS
--     Usuarios registrados en la plataforma (adoptantes, voluntarios, admin).
--     Es la tabla raíz: el resto de tablas con FK la referencian.
-- ============================================================================
CREATE TABLE `USUARIOS` (
  `id`             VARCHAR(30)  NOT NULL,
  `correo`         VARCHAR(255) NOT NULL,
  `nombre`         VARCHAR(255) NULL,
  `creado_en`      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Usuarios registrados en la plataforma Miauguau (adoptantes, voluntarios, administradores).';


-- ============================================================================
--  2. MASCOTAS
--     Mascotas publicadas para adopción. Depende de USUARIOS (creado_por_id).
-- ============================================================================
CREATE TABLE `MASCOTAS` (
  `id`                VARCHAR(30)  NOT NULL,
  `nombre`            VARCHAR(255) NOT NULL,
  `especie`           ENUM('perro','gato','otro')         NOT NULL,
  `sexo`              ENUM('macho','hembra')              NOT NULL,
  `edad`              INT          NOT NULL,
  `tamaño`            ENUM('pequeño','mediano','grande')  NOT NULL,
  `descripcion`       TEXT         NOT NULL,
  `direccion_imagen`  VARCHAR(255) NOT NULL,
  `estado`            ENUM('disponible','reservado','adoptado') NOT NULL DEFAULT 'disponible',
  `es_urgente`        BOOLEAN      NOT NULL DEFAULT FALSE,
  `esta_esterilizado` BOOLEAN      NOT NULL DEFAULT FALSE,
  `esta_vacunado`     BOOLEAN      NOT NULL DEFAULT FALSE,
  `creado_por_id`     VARCHAR(30)  NOT NULL,
  `creado_en`         DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en`    DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mascotas_creado_por_id` (`creado_por_id`),
  CONSTRAINT `fk_mascotas_creado_por`
    FOREIGN KEY (`creado_por_id`) REFERENCES `USUARIOS` (`id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Mascotas disponibles para adopción, publicadas por usuarios de la plataforma.';


-- ============================================================================
--  3. SOLICITUDES_ADOPCION
--     Solicitudes de adopción sobre una mascota. Depende de MASCOTAS (CASCADE)
--     y opcionalmente de USUARIOS (SET NULL).
-- ============================================================================
CREATE TABLE `SOLICITUDES_ADOPCION` (
  `id`             VARCHAR(30)  NOT NULL,
  `mascota_id`     VARCHAR(30)  NOT NULL,
  `usuario_id`     VARCHAR(30)  NULL,
  `nombre`         VARCHAR(255) NOT NULL,
  `correo`         VARCHAR(255) NOT NULL,
  `mensaje`        TEXT         NOT NULL,
  `estado`         ENUM('pendiente','aprovada','denegada') NOT NULL DEFAULT 'pendiente',
  `creado_en`      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_solicitudes_mascota_id` (`mascota_id`),
  KEY `idx_solicitudes_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_solicitudes_mascota`
    FOREIGN KEY (`mascota_id`) REFERENCES `MASCOTAS` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_solicitudes_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `USUARIOS` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Solicitudes de adopción realizadas por usuarios para una mascota específica.';


-- ============================================================================
--  4. MENSAJES_CONTACTO
--     Mensajes del formulario de contacto público. Depende opcionalmente de
--     USUARIOS (SET NULL).
-- ============================================================================
CREATE TABLE `MENSAJES_CONTACTO` (
  `id`              VARCHAR(30)  NOT NULL,
  `nombre`          VARCHAR(255) NOT NULL,
  `correo`          VARCHAR(255) NOT NULL,
  `mensaje`         TEXT         NOT NULL,
  `asunto`          ENUM('general','adopcion','voluntariado','maltrato','emergencia') NOT NULL,
  `usuario_id`      VARCHAR(30)  NULL,
  `estado`          ENUM('nuevo','leído','contestado') NOT NULL DEFAULT 'nuevo',
  `respuesta_admin` TEXT         NULL,
  `creado_en`       DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en`  DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mensajes_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_mensajes_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `USUARIOS` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Mensajes enviados desde el formulario de contacto público de la plataforma.';


-- ============================================================================
--  5. SUSCRIPTORES_NEWSLETTER
--     Suscriptores al newsletter. Depende opcionalmente de USUARIOS (SET NULL).
--     No tiene `actualizado_en` según el modelo (solo `creado_en`).
-- ============================================================================
CREATE TABLE `SUSCRIPTORES_NEWSLETTER` (
  `id`         VARCHAR(30)  NOT NULL,
  `correo`     VARCHAR(255) NOT NULL,
  `usuario_id` VARCHAR(30)  NULL,
  `estado`     ENUM('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
  `creado_en`  DATETIME     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_suscriptores_correo` (`correo`),
  KEY `idx_suscriptores_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_suscriptores_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `USUARIOS` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Suscriptores al newsletter de Miauguau (pueden estar o no vinculados a un usuario).';


-- ============================================================================
--  6. FAVORITOS
--     Mascotas marcadas como favoritas por los usuarios (lista de deseados).
--     Depende de USUARIOS (CASCADE) y MASCOTAS (CASCADE).
--     Restricción UNIQUE (usuario_id, mascota_id) para evitar duplicados.
-- ============================================================================
CREATE TABLE `FAVORITOS` (
  `id`         VARCHAR(30) NOT NULL,
  `usuario_id` VARCHAR(30) NOT NULL,
  `mascota_id` VARCHAR(30) NOT NULL,
  `creado_en`  DATETIME    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favoritos_usuario_mascota` (`usuario_id`, `mascota_id`),
  KEY `idx_favoritos_usuario_id` (`usuario_id`),
  KEY `idx_favoritos_mascota_id` (`mascota_id`),
  CONSTRAINT `fk_favoritos_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `USUARIOS` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_favoritos_mascota`
    FOREIGN KEY (`mascota_id`) REFERENCES `MASCOTAS` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Mascotas marcadas como favoritas por los usuarios (lista de deseados).';


-- ============================================================================
--  7. INTENCIONES_CHATBOT
--     Configuración de intenciones (intents) del chatbot de Miauguau.
--     Tabla aislada: NO tiene relaciones con ninguna otra tabla.
--     - condicion:      CSV de palabras clave que disparan la intención.
--     - acciones:       CSV de tríos etiqueta|tipo|valor.
--     - seguimientos:   CSV de intent_ids (intenciones siguientes sugeridas).
-- ============================================================================
CREATE TABLE `INTENCIONES_CHATBOT` (
  `id`             VARCHAR(30)  NOT NULL,
  `intent_id`      VARCHAR(255) NOT NULL,
  `condicion`      TEXT         NOT NULL,
  `respuesta`      TEXT         NOT NULL,
  `acciones`       TEXT         NOT NULL,
  `seguimientos`   TEXT         NOT NULL,
  `prioridad`      INT          NOT NULL DEFAULT 0,
  `orden`          INT          NOT NULL DEFAULT 0,
  `etiqueta`       VARCHAR(255) NOT NULL,
  `creado_en`      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_intenciones_intent_id` (`intent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Configuración de intenciones (intents) del chatbot de Miauguau; tabla aislada sin relaciones.';


-- ============================================================================
--  RESUMEN
--  --------
--  Tablas (7):
--    1. USUARIOS              - Usuarios registrados de la plataforma.
--    2. MASCOTAS              - Mascotas publicadas para adopción.
--    3. SOLICITUDES_ADOPCION  - Solicitudes de adopción sobre mascotas.
--    4. MENSAJES_CONTACTO     - Mensajes del formulario de contacto público.
--    5. SUSCRIPTORES_NEWSLETTER - Suscriptores al newsletter.
--    6. FAVORITOS             - Mascotas favoritas por usuario.
--    7. INTENCIONES_CHATBOT   - Intenciones del chatbot (tabla aislada).
--
--  Relaciones (7, sin contar INTENCIONES_CHATBOT que queda aislada):
--    1. USUARIOS  (1)     — (N) MASCOTAS                ON DELETE RESTRICT
--    2. MASCOTAS  (1)     — (N) SOLICITUDES_ADOPCION    ON DELETE CASCADE
--    3. USUARIOS  (0..1)  — (N) SOLICITUDES_ADOPCION    ON DELETE SET NULL
--    4. USUARIOS  (0..1)  — (N) MENSAJES_CONTACTO       ON DELETE SET NULL
--    5. USUARIOS  (0..1)  — (N) SUSCRIPTORES_NEWSLETTER ON DELETE SET NULL
--    6. USUARIOS  (1)     — (N) FAVORITOS               ON DELETE CASCADE
--    7. MASCOTAS  (1)     — (N) FAVORITOS               ON DELETE CASCADE
-- ============================================================================
