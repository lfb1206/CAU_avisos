-- 005_edicion_changes.sql
-- Remove year/semester from ediciones (name already encodes this),
-- add max_ayudantes so coordinador can set how many ayudantes are needed per edicion.

ALTER TABLE ediciones_taller ADD COLUMN IF NOT EXISTS max_ayudantes INT DEFAULT 0;
ALTER TABLE ediciones_taller DROP COLUMN IF EXISTS year;
ALTER TABLE ediciones_taller DROP COLUMN IF EXISTS semester;
