-- =====================================================
-- DND Builder - Database Schema
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
  id         INT          NOT NULL AUTO_INCREMENT,
  asociadoa  VARCHAR(100) NOT NULL,
  nombre     VARCHAR(200) DEFAULT NULL,
  raza       VARCHAR(100) DEFAULT NULL,
  clase      VARCHAR(100) DEFAULT NULL,
  armorClass INT          DEFAULT NULL,
  nivel      INT          DEFAULT NULL,
  hitPoints  INT          DEFAULT NULL,
  hitDice    VARCHAR(50)  DEFAULT NULL,
  speed      INT          DEFAULT NULL,
  spells     TEXT         DEFAULT NULL,
  invent     TEXT         DEFAULT NULL,
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
-- Default admin user (password: root)
-- -----------------------------------------
INSERT IGNORE INTO users_ (nick, mail, pass)
VALUES ('root', 'admin@dndbuilder.local', 'root');
