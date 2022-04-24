--
-- PostgreSQL database Proman
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';

SET default_with_oids = false;

---
--- drop tables
---

DROP TABLE IF EXISTS columns CASCADE;
DROP TABLE IF EXISTS boards CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cards CASCADE;
DROP TABLE IF EXISTS proman_users CASCADE;
DROP TABLE IF EXISTS user_activity CASCADE;
---
--- create tables
---

CREATE TABLE columns (
    id       SERIAL PRIMARY KEY     NOT NULL,
    title    VARCHAR(200)           NOT NULL,
    board_id INTEGER                NOT NULL,
    active   BOOLEAN    default 'true' NOT NULL
);

CREATE TABLE boards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    title       VARCHAR(200)        NOT NULL,
    type   BOOLEAN default 'true',
    user_id   INTEGER,
    active   BOOLEAN    default 'true' NOT NULL
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY  NOT NULL,
    board_id    INTEGER             NOT NULL,
    columns_id   INTEGER             NOT NULL,
    title       VARCHAR (200)       NOT NULL,
    card_order  INTEGER             NOT NULL,
    user_id   INTEGER             NOT NULL,
    active   BOOLEAN    default 'true' NOT NULL
);

CREATE TABLE  proman_users(
    id          SERIAL PRIMARY KEY  NOT NULL,
    name       VARCHAR (200)     NOT NULL unique,
    email       VARCHAR (200)     NOT NULL unique,
    password       VARCHAR (200)     NOT NULL
);

CREATE TABLE  last_activity(
    id          SERIAL PRIMARY KEY  NOT NULL,
    user_id       VARCHAR (200)     NOT NULL,
    board_id       VARCHAR (200)     NOT NULL,
    modification_time        bigint     NOT NULL unique);

---
--- add constraints
---

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_boards_id FOREIGN KEY (board_id) REFERENCES boards(id) on delete cascade;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_user_id FOREIGN KEY (user_id) REFERENCES proman_users(id) on delete cascade;

ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_columns_id FOREIGN KEY (columns_id) REFERENCES columns(id) on delete cascade;

ALTER TABLE ONLY boards
    ADD CONSTRAINT fk_boards_user_id FOREIGN KEY (user_id) REFERENCES proman_users(id) on delete cascade;

ALTER TABLE ONLY columns
    ADD CONSTRAINT fk_columns_board_id FOREIGN KEY (board_id) REFERENCES boards(id) on delete cascade;


---
--- insert data
---

INSERT INTO proman_users(name, email, password) VALUES ('Test', 'test@.pl', '1234');


INSERT INTO boards(title, user_id) VALUES ('Board 1', 1);
INSERT INTO boards(title, user_id) VALUES ('Board 2', 1);

INSERT INTO columns(title, board_id) VALUES ('new', 1);
INSERT INTO columns(title, board_id) VALUES ('in progress', 1);
INSERT INTO columns(title, board_id) VALUES ('testing', 1);
INSERT INTO columns(title, board_id) VALUES ('done', 1);
INSERT INTO columns(title, board_id) VALUES ('new', 2);
INSERT INTO columns(title, board_id) VALUES ('in progress', 2);
INSERT INTO columns(title, board_id) VALUES ('testing', 2);
INSERT INTO columns(title, board_id) VALUES ('done', 2);


INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 1', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 1, 'new card 2', 2, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 2, 'in progress card', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 3, 'planning', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 1, 4, 'done card 1', 2, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 1', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 1, 'new card 2', 2, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 2, 'in progress card', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 3, 'planning', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 1, 1);
INSERT INTO cards VALUES (nextval('cards_id_seq'), 2, 4, 'done card 1', 2, 1);