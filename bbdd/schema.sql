-- =====================================================
-- DND Builder - Database Schema (Expanded)
-- Database: db_tib (The Iris of The Beholder)
-- Execute this script in MySQL Workbench to create
-- the database and all required tables.
-- =====================================================

CREATE DATABASE IF NOT EXISTS db_tib
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_tib;

-- -----------------------------------------
-- Table: users_
-- Stores registered user accounts
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS users_ (
  id   INT          NOT NULL AUTO_INCREMENT,
  nick VARCHAR(100) NOT NULL,
  mail VARCHAR(255) NOT NULL,
  pass VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_nick (nick),
  UNIQUE KEY uk_mail (mail)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------
-- Table: tabla_pj
-- Stores character sheets created by users
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS tabla_pj (
  id           INT          NOT NULL AUTO_INCREMENT,
  asociadoa    VARCHAR(100) NOT NULL,
  nombre       VARCHAR(200) DEFAULT NULL,
  raza         VARCHAR(100) DEFAULT NULL,
  subraza      VARCHAR(100) DEFAULT NULL,
  clase        VARCHAR(100) DEFAULT NULL,
  armorClass   INT          DEFAULT NULL,
  nivel        INT          DEFAULT NULL,
  hitPoints    INT          DEFAULT NULL,
  hitDice      VARCHAR(50)  DEFAULT NULL,
  speed        INT          DEFAULT NULL,
  spells       TEXT         DEFAULT NULL,
  invent       TEXT         DEFAULT NULL,
  trasfondo    TEXT         DEFAULT NULL,
  alineamiento VARCHAR(100) DEFAULT NULL,
  competencias TEXT         DEFAULT NULL,
  monedas_oro  INT          DEFAULT 0,
  arma         VARCHAR(200) DEFAULT NULL,
  armadura     VARCHAR(200) DEFAULT NULL,
  xp           INT          DEFAULT 0,
  classList    JSON         DEFAULT NULL,
  fuerza       INT          DEFAULT 10,
  destreza     INT          DEFAULT 10,
  constitucion INT          DEFAULT 10,
  inteligencia INT          DEFAULT 10,
  sabiduria    INT          DEFAULT 10,
  carisma      INT          DEFAULT 10,
  PRIMARY KEY (id),
  KEY idx_asociadoa (asociadoa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------
-- Table: reg_uspj
-- Audit log of character creation/edits
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS reg_uspj (
  id        INT          NOT NULL AUTO_INCREMENT,
  asociadoa VARCHAR(100) NOT NULL,
  nombre    VARCHAR(200) DEFAULT NULL,
  raza      VARCHAR(100) DEFAULT NULL,
  clase     VARCHAR(100) DEFAULT NULL,
  nivel     INT          DEFAULT NULL,
  fecha     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_asociadoa (asociadoa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------
-- Table: dice_rolls
-- Stores roll history per user
-- -----------------------------------------
CREATE TABLE IF NOT EXISTS dice_rolls (
  id        INT          NOT NULL AUTO_INCREMENT,
  user_nick VARCHAR(100) NOT NULL,
  dice_type INT          NOT NULL,
  result    INT          NOT NULL,
  timestamp TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_user_nick (user_nick)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------
-- Default admin user (password: root)
-- In production, this should use password_hash.
-- -----------------------------------------
INSERT IGNORE INTO users_ (nick, mail, pass)
VALUES ('root', 'admin@dndbuilder.local', '$2y$10$YourHashedPasswordHere');
