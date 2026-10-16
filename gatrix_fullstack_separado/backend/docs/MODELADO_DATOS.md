# Modelado de datos — Gatrix

La fuente de verdad del sistema es PostgreSQL. El esquema base se conserva en `database/schema.sql` y se complementa con una extensión mínima para la tienda pública.

## Entidades principales
- `cliente` y `vehiculo`: identificación del cliente y sus vehículos.
- `empleado`, `turno`, `empleado_turno`: personal y organización de turnos.
- `rol`, `permiso`, `rol_permiso`, `usuario`: seguridad y control de acceso.
- `categoria_servicio`, `servicio`: catálogo de servicios.
- `orden_atencion`, `detalle_orden`: reservas y atenciones.
- `categoria_producto`, `producto`, `detalle_producto`: inventario y catálogo público.
- `proveedor`, `movimiento_almacen`: abastecimiento y trazabilidad de stock.
- `comprobante_venta`, `detalle_comprobante_venta`: ventas.
- `comprobante_reabastecimiento`, `detalle_comprobante_reabastecimiento`: compras/reabastecimiento.
- `bitacora_acceso`, `bitacora_operacion`, `sesion_activa`: auditoría y seguridad.

## ENUM PostgreSQL
El modelo conserva cuatro tipos nativos:
- `estado_orden`: PROGRAMADA, EN_PROCESO, COMPLETADA, EN_ESPERA.
- `tipo_comprobante`: FACTURA, BOLETA.
- `estado_sunat`: PENDIENTE, ACEPTADA, OBSERVADA, RECHAZADA.
- `tipo_movimiento`: ENTRADA, SALIDA.

## Dos campos necesarios para la tienda
La tabla `producto` incorpora únicamente estos dos campos técnicos adicionales:

| Campo | Tipo | Nulo | Uso |
|---|---|---:|---|
| `imagen_url` | `TEXT` | Sí | URL de una imagen propia o con derechos de uso confirmados para mostrar el producto. |
| `visible_tienda` | `BOOLEAN` | No | Controla si el producto puede publicarse en la tienda pública. Valor por defecto: `FALSE`. |

Para una base ya creada se aplica `database/store_extension.sql`. Para una base nueva ambos campos ya están incluidos en `database/schema.sql`.

## Imágenes de servicios
Las imágenes incluidas en el frontend provienen de las vistas entregadas en `gatrix_sistema_completo.zip` y se usan como recursos visuales estáticos por categoría. **No se guardan en PostgreSQL**, porque el modelo actual de `servicio` no contiene un campo de imagen y el requerimiento de datos solo solicita los dos campos anteriores para `producto`.

Si en una siguiente versión el administrador debe cambiar la imagen de cada servicio desde el panel, entonces sí conviene agregar un campo `imagen_url` a `servicio`. En esta versión no se altera esa tabla para evitar cambios no solicitados en el modelo.

## Catálogos
`database/catalogs.sql` inserta únicamente catálogos técnicos compatibles con el modelo: categorías de productos, categorías de servicios, métodos de pago, roles y permisos. No crea ventas, reservas, clientes, productos o servicios ficticios.
