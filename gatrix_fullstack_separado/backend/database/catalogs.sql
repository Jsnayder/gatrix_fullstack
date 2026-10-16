-- ============================================================
-- GATRIX CAR WASH - CATÁLOGOS TÉCNICOS
-- Adaptado sobre la base original entregada.
-- No crea clientes, productos, servicios, ventas ni reservas ficticias.
-- ============================================================

-- Roles del sistema
INSERT INTO rol (nombre, descripcion, nivel_prioridad, activo)
SELECT 'Administrador', 'Control total del sistema Gatrix', 100, TRUE
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'Administrador');

INSERT INTO rol (nombre, descripcion, nivel_prioridad, activo)
SELECT 'Usuario', 'Usuario común del sistema', 1, TRUE
WHERE NOT EXISTS (SELECT 1 FROM rol WHERE nombre = 'Usuario');

-- Categorías de servicio
INSERT INTO categoria_servicio (nombre, activo)
SELECT v.nombre, TRUE
FROM (VALUES
    ('Lavado'),
    ('Detallado'),
    ('Protección'),
    ('Interior'),
    ('Mantenimiento')
) AS v(nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM categoria_servicio c WHERE LOWER(c.nombre) = LOWER(v.nombre)
);

-- Categorías de producto visibles en el módulo de tienda/almacén
INSERT INTO categoria_producto (nombre, activo)
SELECT v.nombre, TRUE
FROM (VALUES
    ('Ceras y selladores'),
    ('Shampoos'),
    ('Interior'),
    ('Ambientadores'),
    ('Kits'),
    ('Accesorios'),
    ('Químicos')
) AS v(nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM categoria_producto c WHERE LOWER(c.nombre) = LOWER(v.nombre)
);

-- Métodos de pago
INSERT INTO metodo_pago (nombre, activo)
SELECT v.nombre, TRUE
FROM (VALUES
    ('Efectivo'),
    ('Tarjeta'),
    ('Yape'),
    ('Plin'),
    ('Transferencia')
) AS v(nombre)
WHERE NOT EXISTS (
    SELECT 1 FROM metodo_pago m WHERE LOWER(m.nombre) = LOWER(v.nombre)
);

-- Permisos base
INSERT INTO permiso (nombre, descripcion, modulo, activo)
SELECT v.nombre, v.descripcion, v.modulo, TRUE
FROM (VALUES
    ('DASHBOARD_VER', 'Visualizar panel principal', 'DASHBOARD'),
    ('CLIENTES_GESTIONAR', 'Gestionar clientes', 'CLIENTES'),
    ('ATENCION_GESTIONAR', 'Gestionar servicios y atenciones', 'ATENCION'),
    ('RESERVAS_GESTIONAR', 'Gestionar reservas', 'RESERVAS'),
    ('ALMACEN_GESTIONAR', 'Gestionar productos, stock y movimientos', 'ALMACEN'),
    ('FINANZAS_GESTIONAR', 'Consultar movimientos financieros', 'FINANZAS'),
    ('USUARIOS_GESTIONAR', 'Crear y consultar usuarios del sistema', 'USUARIOS')
) AS v(nombre, descripcion, modulo)
WHERE NOT EXISTS (
    SELECT 1 FROM permiso p WHERE p.nombre = v.nombre
);

-- El administrador recibe todos los permisos disponibles.
INSERT INTO rol_permiso (id_rol, id_permiso, activo)
SELECT r.id_rol, p.id_permiso, TRUE
FROM rol r
CROSS JOIN permiso p
WHERE r.nombre = 'Administrador'
  AND NOT EXISTS (
      SELECT 1
      FROM rol_permiso rp
      WHERE rp.id_rol = r.id_rol
        AND rp.id_permiso = p.id_permiso
  );
