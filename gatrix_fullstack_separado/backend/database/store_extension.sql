-- Extensión mínima para la tienda pública.
-- Permite aplicar los dos campos también sobre una base ya creada.
ALTER TABLE producto
  ADD COLUMN IF NOT EXISTS imagen_url TEXT NULL,
  ADD COLUMN IF NOT EXISTS visible_tienda BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_producto_tienda
  ON producto(visible_tienda, activo);
