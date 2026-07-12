CREATE DATABASE miauguau
USE miauguau;

CREATE TABLE `USUARIOS` (
  `id`             VARCHAR(30)  NOT NULL,
  `correo`         VARCHAR(255) NOT NULL,
  `nombre`         VARCHAR(255) NULL,
  `creado_en`      DATETIME     DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_correo` (`correo`)
);


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
);


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
);


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
);


CREATE TABLE `SUSCRIPTORES_DIARIO` (
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
);


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
);


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
);
