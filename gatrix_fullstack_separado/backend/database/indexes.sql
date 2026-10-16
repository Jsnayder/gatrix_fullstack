-- Índices complementarios. No alteran el modelo lógico entregado.
CREATE INDEX IF NOT EXISTS idx_cliente_activo ON cliente(activo);
CREATE INDEX IF NOT EXISTS idx_cliente_dni ON cliente(dni);
CREATE INDEX IF NOT EXISTS idx_vehiculo_cliente ON vehiculo(id_cliente);
CREATE INDEX IF NOT EXISTS idx_orden_fecha_estado ON orden_atencion(fecha, estado);
CREATE INDEX IF NOT EXISTS idx_orden_vehiculo ON orden_atencion(id_vehiculo);
CREATE INDEX IF NOT EXISTS idx_producto_activo ON producto(activo);
CREATE INDEX IF NOT EXISTS idx_detalle_producto_categoria ON detalle_producto(id_categoria);
CREATE INDEX IF NOT EXISTS idx_movimiento_producto_fecha ON movimiento_almacen(id_producto, fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_usuario_rol ON usuario(id_rol);
