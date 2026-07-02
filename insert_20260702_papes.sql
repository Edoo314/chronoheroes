-- ============================================================
-- INSERT PERSONS — Papes (5 personnages)
-- ChronoHeroes | 2026-07-02
-- ============================================================

INSERT INTO persons (name, birthdate_raw, deathdate_raw, country, geo, period, tags, wikipedia_slug, importance, gender)
VALUES
  ('Paul VI',       '1897-09-26', '1978-08-06', 'IT', 'histoire-monde', 'xxe',         'spirituel', 'Paul_VI',       5, 'M'),
  ('Jean-Paul Ier', '1912-10-17', '1978-09-28', 'IT', 'histoire-monde', 'xxe',         'spirituel', 'Jean-Paul_Ier', 5, 'M'),
  ('Jean-Paul II',  '1920-05-18', '2005-04-02', 'PL', 'histoire-monde', 'xxe',         'spirituel', 'Jean-Paul_II',  5, 'M'),
  ('Benoît XVI',    '1927-04-16', '2022-12-31', 'DE', 'histoire-monde', 'contemporain','spirituel', 'Benoît_XVI',    5, 'M'),
  ('Léon XIV',      '1955-09-14', NULL,          'US', 'histoire-monde', 'contemporain','spirituel', 'Léon_XIV',      5, 'M');

SELECT id, name FROM persons
WHERE name IN ('Paul VI','Jean-Paul Ier','Jean-Paul II','Benoît XVI','Léon XIV')
ORDER BY name;
