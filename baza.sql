PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS transakcje;
DROP TABLE IF EXISTS produkty;
DROP TABLE IF EXISTS kategorie;


CREATE TABLE kategorie (
    id INTEGER PRIMARY KEY,
    nazwa TEXT NOT NULL
);


CREATE TABLE produkty (
    id INTEGER PRIMARY KEY,
    nazwa TEXT NOT NULL,
    cena REAL NOT NULL,
    kod_kreskowy TEXT UNIQUE NOT NULL,
    kategoria_id INTEGER NOT NULL,

    FOREIGN KEY (kategoria_id)
        REFERENCES kategorie(id)
);


CREATE TABLE transakcje (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    suma REAL NOT NULL
);


INSERT INTO kategorie
(id, nazwa)
VALUES
    (1, 'Napoje'),
    (2, 'Przekąski'),
    (3, 'Nabiał'),
    (4, 'Pieczywo'),
    (5, 'Chemia'),
    (6, 'Owoce i warzywa');


INSERT INTO produkty
(id, nazwa, cena, kod_kreskowy, kategoria_id)
VALUES

    (1, 'Woda 0,5 l', 2.49, '5900000000011', 1),

    (2, 'Cola 0,5 l', 4.99, '5900000000028', 1),

    (3, 'Sok pomarańczowy', 5.49, '5900000000035', 1),

    (4, 'Chipsy solone', 6.99, '5900000000042', 2),

    (5, 'Paluszki', 3.49, '5900000000059', 2),

    (6, 'Czekolada mleczna', 4.79, '5900000000066', 2),

    (7, 'Mleko 2%', 3.99, '5900000000073', 3),

    (8, 'Jogurt naturalny', 2.89, '5900000000080', 3),

    (9, 'Masło 200 g', 7.49, '5900000000097', 3),

    (10, 'Chleb pszenny', 4.50, '5900000000103', 4),

    (11, 'Bułka', 1.20, '5900000000110', 4),

    (12, 'Płyn do naczyń', 8.99, '5900000000127', 5),

    (13, 'Jabłka 1 kg', 5.99, '5900000000134', 6),

    (14, 'Banany 1 kg', 6.49, '5900000000141', 6),

    (15, 'Pomidor', 2.49, '5900000000158', 6),

    (16, 'Ogórek', 2.99, '5900000000165', 6);


INSERT INTO transakcje
(data, suma)
VALUES
    (datetime('now','localtime'), 18.47),

    (datetime('now','localtime'), 32.90);