CREATE TYPE estado_orden AS ENUM (
    'PROGRAMADA',
    'EN_PROCESO',
    'COMPLETADA',
    'EN_ESPERA'
);

CREATE TYPE tipo_comprobante AS ENUM (
    'FACTURA',
    'BOLETA'
);

CREATE TYPE estado_sunat AS ENUM (
    'PENDIENTE',
    'ACEPTADA',
    'OBSERVADA',
    'RECHAZADA'
);

CREATE TYPE tipo_movimiento AS ENUM (
    'ENTRADA',
    'SALIDA'
);

CREATE TABLE categoria_servicio (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_categoria_servicio
        PRIMARY KEY (id_categoria),

    CONSTRAINT uq_categoria_servicio_nombre
        UNIQUE (nombre)
);

CREATE TABLE servicio (
    id_servicio INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(150) NOT NULL,
    precio NUMERIC(12,2) NOT NULL,
    duracion_min INTEGER NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    id_categoria INTEGER NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	
    CONSTRAINT pk_servicio PRIMARY KEY (id_servicio),
	
    CONSTRAINT fk_servicio_categoria FOREIGN KEY (id_categoria) 
        REFERENCES categoria_servicio(id_categoria),
		
    CONSTRAINT chk_servicio_precio CHECK (precio >= 0),
	
    CONSTRAINT chk_servicio_duracion CHECK (duracion_min > 0)
);

CREATE TABLE cliente (
    id_cliente INTEGER GENERATED ALWAYS AS IDENTITY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100),
    dni VARCHAR(15) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	
    CONSTRAINT pk_cliente PRIMARY KEY (id_cliente),
	
    CONSTRAINT uq_cliente_dni UNIQUE (dni),
	
    CONSTRAINT uq_cliente_email UNIQUE (email)
);

CREATE TABLE vehiculo (
    id_vehiculo INTEGER GENERATED ALWAYS AS IDENTITY,
    placa VARCHAR(10) NOT NULL,
    marca VARCHAR(100) NOT NULL,
    color VARCHAR(50),
	activo BOOLEAN NOT NULL DEFAULT TRUE,
    id_cliente INTEGER NOT NULL,

    CONSTRAINT pk_vehiculo
        PRIMARY KEY (id_vehiculo),

    CONSTRAINT uq_vehiculo_placa
        UNIQUE (placa),

    CONSTRAINT fk_vehiculo_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
);

CREATE TABLE descuento (
    id_descuento INTEGER GENERATED ALWAYS AS IDENTITY,
    porcentaje NUMERIC(5,2) NOT NULL,
    motivo VARCHAR(200),
    id_cliente INTEGER NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	requiere_aprobacion BOOLEAN NOT NULL DEFAULT FALSE,
    aprobado BOOLEAN NULL,
    aprobado_por INTEGER NULL,
    fecha_aprobacion TIMESTAMP NULL,
	
    CONSTRAINT pk_descuento
        PRIMARY KEY (id_descuento),

    CONSTRAINT fk_descuento_cliente
        FOREIGN KEY (id_cliente)
        REFERENCES cliente(id_cliente)
        ON DELETE SET NULL,

    CONSTRAINT chk_descuento_porcentaje
        CHECK (
            porcentaje >= 0
            AND porcentaje <= 100
        )
);

CREATE TABLE empleado (
    id_empleado INTEGER GENERATED ALWAYS AS IDENTITY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    telefono VARCHAR(15),
    activo BOOLEAN NOT NULL DEFAULT TRUE,
	fecha_contrato DATE NULL,
    salario_base NUMERIC(12,2) NULL,
    tipo_contrato VARCHAR(50) NULL,
	
    CONSTRAINT pk_empleado
        PRIMARY KEY (id_empleado)
);

CREATE TABLE turno (
    id_turno INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_turno
        PRIMARY KEY (id_turno),

    CONSTRAINT uq_turno_nombre
        UNIQUE (nombre)
);

CREATE TABLE empleado_turno (
    id_empleado INTEGER NOT NULL,
    id_turno INTEGER NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_empleado_turno
        PRIMARY KEY (
            id_empleado,
            id_turno,
            fecha_inicio
        ),

    CONSTRAINT fk_empleado_turno_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado),

    CONSTRAINT fk_empleado_turno_turno
        FOREIGN KEY (id_turno)
        REFERENCES turno(id_turno),

    CONSTRAINT chk_empleado_turno_fechas
        CHECK (
            fecha_fin IS NULL
            OR fecha_fin >= fecha_inicio
        )
);

CREATE TABLE rol (
    id_rol INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    nivel_prioridad INTEGER DEFAULT 0,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	
    CONSTRAINT pk_rol PRIMARY KEY (id_rol),
    CONSTRAINT uq_rol_nombre UNIQUE (nombre)
);

CREATE TABLE permiso (
    id_permiso INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    modulo VARCHAR(50) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	
    CONSTRAINT pk_permiso PRIMARY KEY (id_permiso),
    CONSTRAINT uq_permiso_nombre UNIQUE (nombre)
);

CREATE TABLE rol_permiso (
    id_rol INTEGER NOT NULL,
    id_permiso INTEGER NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	
    CONSTRAINT pk_rol_permiso PRIMARY KEY (id_rol, id_permiso),
    CONSTRAINT fk_rol_permiso_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
    CONSTRAINT fk_rol_permiso_permiso FOREIGN KEY (id_permiso) REFERENCES permiso(id_permiso)
);

CREATE TABLE usuario (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY,
    id_empleado INTEGER NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    id_rol INTEGER NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT uq_usuario_username UNIQUE (username),
    CONSTRAINT uq_usuario_empleado UNIQUE (id_empleado),
    CONSTRAINT fk_usuario_empleado FOREIGN KEY (id_empleado) 
        REFERENCES empleado(id_empleado),
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE bitacora_acceso (
    id_bitacora INTEGER GENERATED ALWAYS AS IDENTITY,
    id_usuario INTEGER NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accion VARCHAR(50) NOT NULL,
    ip VARCHAR(45) NULL,
    detalles TEXT NULL,
    CONSTRAINT pk_bitacora_acceso PRIMARY KEY (id_bitacora),
    CONSTRAINT fk_bitacora_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE bitacora_operacion (
    id_bitacora INTEGER GENERATED ALWAYS AS IDENTITY,
    id_usuario INTEGER NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    tabla_afectada VARCHAR(50) NOT NULL,
    operacion VARCHAR(20) NOT NULL,
    registro_id INTEGER NOT NULL,
    datos_anteriores JSONB NULL,
    datos_nuevos JSONB NULL,
    CONSTRAINT pk_bitacora_operacion PRIMARY KEY (id_bitacora),
    CONSTRAINT fk_bitacora_operacion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE sesion_activa (
    id_sesion INTEGER GENERATED ALWAYS AS IDENTITY,
    id_usuario INTEGER NOT NULL,
    token VARCHAR(255) NOT NULL,
    ip VARCHAR(45) NULL,
    user_agent TEXT NULL,
    fecha_inicio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    activa BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT pk_sesion_activa PRIMARY KEY (id_sesion),
    CONSTRAINT fk_sesion_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE orden_atencion (
    id_atencion INTEGER GENERATED ALWAYS AS IDENTITY,
    id_empleado INTEGER NOT NULL,
    id_vehiculo INTEGER NOT NULL,
    id_descuento INTEGER NULL,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    subtotal NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    igv NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    total NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    tiempo_estimado_min INTEGER NULL,
    estado estado_orden NOT NULL
        DEFAULT 'PROGRAMADA',
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	creado_por INTEGER NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_por INTEGER NULL,
    modificado_en TIMESTAMP NULL,

    CONSTRAINT pk_orden_atencion
        PRIMARY KEY (id_atencion),

    CONSTRAINT fk_orden_empleado
        FOREIGN KEY (id_empleado)
        REFERENCES empleado(id_empleado),

    CONSTRAINT fk_orden_vehiculo
        FOREIGN KEY (id_vehiculo)
        REFERENCES vehiculo(id_vehiculo),

    CONSTRAINT fk_orden_descuento
        FOREIGN KEY (id_descuento)
        REFERENCES descuento(id_descuento)
        ON DELETE SET NULL,
		
	CONSTRAINT fk_orden_creado_por 
		FOREIGN KEY (creado_por) 
		REFERENCES usuario(id_usuario),
		
    CONSTRAINT fk_orden_modificado_por 
		FOREIGN KEY (modificado_por) 
		REFERENCES usuario(id_usuario),
	
    CONSTRAINT chk_orden_subtotal
        CHECK (subtotal >= 0),

    CONSTRAINT chk_orden_igv
        CHECK (igv >= 0),

    CONSTRAINT chk_orden_total
        CHECK (total >= 0),

    CONSTRAINT chk_orden_tiempo
        CHECK (
            tiempo_estimado_min IS NULL
            OR tiempo_estimado_min >= 0
        )
);

CREATE TABLE detalle_orden (
    id_atencion INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    recomendacion TEXT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	
    CONSTRAINT pk_detalle_orden
        PRIMARY KEY (
            id_atencion,
            id_servicio
        ),

    CONSTRAINT fk_detalle_orden_atencion
        FOREIGN KEY (id_atencion)
        REFERENCES orden_atencion(id_atencion)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_orden_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicio(id_servicio)
);

CREATE TABLE metodo_pago (
    id_metodo INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_metodo_pago
        PRIMARY KEY (id_metodo),

    CONSTRAINT uq_metodo_pago_nombre
        UNIQUE (nombre)
);

CREATE TABLE proveedor (
    id_proveedor INTEGER GENERATED ALWAYS AS IDENTITY,
    razon_social VARCHAR(150) NOT NULL,
    ruc VARCHAR(11) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    direccion VARCHAR(200),
    email VARCHAR(100),
	activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_proveedor
        PRIMARY KEY (id_proveedor),

    CONSTRAINT uq_proveedor_ruc
        UNIQUE (ruc)
);

CREATE TABLE categoria_producto (
    id_categoria INTEGER GENERATED ALWAYS AS IDENTITY,
    nombre VARCHAR(100) NOT NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT pk_categoria_producto
        PRIMARY KEY (id_categoria),

    CONSTRAINT uq_categoria_producto_nombre
        UNIQUE (nombre)
);

CREATE TABLE producto (
    id_producto INTEGER GENERATED ALWAYS AS IDENTITY,
    codigo VARCHAR(25) NOT NULL,
    descripcion VARCHAR(200) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    precio_unitario NUMERIC(12,2) NOT NULL,
    igv_porcentaje NUMERIC(5,2)
        NOT NULL DEFAULT 18.00,
    isc_porcentaje NUMERIC(5,2)
        NOT NULL DEFAULT 0.00,
    imagen_url TEXT NULL,
    visible_tienda BOOLEAN NOT NULL DEFAULT FALSE,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	creado_por INTEGER NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modificado_por INTEGER NULL,
    modificado_en TIMESTAMP NULL,

    CONSTRAINT pk_producto
        PRIMARY KEY (id_producto),

    CONSTRAINT uq_producto_codigo
        UNIQUE (codigo),

	CONSTRAINT fk_producto_creado_por 
		FOREIGN KEY (creado_por) 
		REFERENCES usuario(id_usuario),
		
    CONSTRAINT fk_producto_modificado_por 
		FOREIGN KEY (modificado_por) 
		REFERENCES usuario(id_usuario),
	
    CONSTRAINT chk_producto_precio
        CHECK (precio_unitario >= 0),

    CONSTRAINT chk_producto_igv
        CHECK (
            igv_porcentaje >= 0
            AND igv_porcentaje <= 100
        ),

    CONSTRAINT chk_producto_isc
        CHECK (
            isc_porcentaje >= 0
            AND isc_porcentaje <= 100
        )
);

CREATE TABLE detalle_producto (
    id_producto INTEGER NOT NULL,
    id_categoria INTEGER NOT NULL,
    id_proveedor INTEGER NULL,
    ubicacion VARCHAR(100),
    stock_minimo INTEGER NOT NULL DEFAULT 0,
    stock_actual INTEGER NOT NULL DEFAULT 0,
    actualizacion TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_detalle_producto
        PRIMARY KEY (id_producto),

    CONSTRAINT fk_detalle_producto_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES categoria_producto(id_categoria),

    CONSTRAINT fk_detalle_producto_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor)
        ON DELETE SET NULL,

    CONSTRAINT chk_stock_minimo
        CHECK (stock_minimo >= 0),

    CONSTRAINT chk_stock_actual
        CHECK (stock_actual >= 0)
);

CREATE TABLE comprobante_venta (
    id_comprobante INTEGER GENERATED ALWAYS AS IDENTITY,
    id_atencion INTEGER NULL,
    id_metodo INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    serie VARCHAR(10) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NULL,
    cdr_respuesta VARCHAR(255) NULL,
    tipo_comprobante tipo_comprobante NOT NULL,
    tipo_cambio NUMERIC(10,4)
        NOT NULL DEFAULT 1.0000,
    valor_venta_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    igv_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    isc_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    otros_cargos_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    descuento_global NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    importe_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    estado_sunat estado_sunat
        NOT NULL DEFAULT 'PENDIENTE',
    cdr_codigo VARCHAR(20) NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	creado_por INTEGER NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    anulado_por INTEGER NULL,
    anulado_en TIMESTAMP NULL,
    motivo_anulacion TEXT NULL,
	
    CONSTRAINT pk_comprobante_venta
        PRIMARY KEY (id_comprobante),

    CONSTRAINT uq_comprobante_venta
        UNIQUE (serie, numero),

    CONSTRAINT fk_comprobante_venta_atencion
        FOREIGN KEY (id_atencion)
        REFERENCES orden_atencion(id_atencion)
        ON DELETE SET NULL,

    CONSTRAINT fk_comprobante_venta_metodo
        FOREIGN KEY (id_metodo)
        REFERENCES metodo_pago(id_metodo),

	CONSTRAINT fk_comprobante_venta_creado_por 
		FOREIGN KEY (creado_por) 
		REFERENCES usuario(id_usuario),
		
    CONSTRAINT fk_comprobante_venta_anulado_por 
		FOREIGN KEY (anulado_por) 
		REFERENCES usuario(id_usuario),

    CONSTRAINT chk_comprobante_venta_fechas
        CHECK (
            fecha_vencimiento IS NULL
            OR fecha_vencimiento >= fecha_emision
        ),

    CONSTRAINT chk_comprobante_venta_total
        CHECK (importe_total >= 0)
);

CREATE TABLE detalle_comprobante_venta (
    id_detalle INTEGER GENERATED ALWAYS AS IDENTITY,
    id_comprobante INTEGER NOT NULL,
    id_servicio INTEGER NULL,
    id_producto INTEGER NULL,
    id_descuento INTEGER NULL,
    cantidad INTEGER NOT NULL,
    valor_unitario NUMERIC(12,2) NOT NULL,
    igv NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    precio_venta_unitario NUMERIC(12,2) NOT NULL,

    CONSTRAINT pk_detalle_comprobante_venta
        PRIMARY KEY (id_detalle),

    CONSTRAINT fk_detalle_venta_comprobante
        FOREIGN KEY (id_comprobante)
        REFERENCES comprobante_venta(id_comprobante)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_venta_servicio
        FOREIGN KEY (id_servicio)
        REFERENCES servicio(id_servicio),

    CONSTRAINT fk_detalle_venta_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto),

    CONSTRAINT fk_detalle_venta_descuento
        FOREIGN KEY (id_descuento)
        REFERENCES descuento(id_descuento)
        ON DELETE SET NULL,

    CONSTRAINT chk_detalle_venta_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_venta_valor
        CHECK (valor_unitario >= 0),

    CONSTRAINT chk_detalle_venta_igv
        CHECK (igv >= 0),

    CONSTRAINT chk_detalle_venta_precio
        CHECK (precio_venta_unitario >= 0),

    CONSTRAINT chk_detalle_producto_servicio
        CHECK (
            num_nonnulls(
                id_producto,
                id_servicio
            ) = 1
        )
);

CREATE TABLE comprobante_reabastecimiento (
    id_comprobante INTEGER GENERATED ALWAYS AS IDENTITY,
    id_proveedor INTEGER NOT NULL,
    id_metodo INTEGER NOT NULL,
    numero INTEGER NOT NULL,
    serie VARCHAR(10) NOT NULL,
    fecha_emision DATE NOT NULL,
    fecha_vencimiento DATE NULL,
    cdr_respuesta VARCHAR(255) NULL,
    tipo_comprobante tipo_comprobante NOT NULL,
    tipo_cambio NUMERIC(10,4)
        NOT NULL DEFAULT 1.0000,
    valor_venta_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    igv_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    isc_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    otros_cargos_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    descuento_global NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    importe_total NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    estado_sunat estado_sunat
        NOT NULL DEFAULT 'PENDIENTE',
    cdr_codigo VARCHAR(20) NULL,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	creado_por INTEGER NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_comprobante_reabastecimiento
        PRIMARY KEY (id_comprobante),

    CONSTRAINT uq_comprobante_reabastecimiento
        UNIQUE (
            serie,
            numero,
            id_proveedor
        ),

    CONSTRAINT fk_reabastecimiento_proveedor
        FOREIGN KEY (id_proveedor)
        REFERENCES proveedor(id_proveedor),

    CONSTRAINT fk_reabastecimiento_metodo
        FOREIGN KEY (id_metodo)
        REFERENCES metodo_pago(id_metodo),

	CONSTRAINT fk_reab_creado_por 
		FOREIGN KEY (creado_por) 
		REFERENCES usuario(id_usuario),
	
    CONSTRAINT chk_reabastecimiento_fechas
        CHECK (
            fecha_vencimiento IS NULL
            OR fecha_vencimiento >= fecha_emision
        ),

    CONSTRAINT chk_reabastecimiento_total
        CHECK (importe_total >= 0)
);

CREATE TABLE detalle_comprobante_reabastecimiento (
    id_detalle INTEGER GENERATED ALWAYS AS IDENTITY,
    id_comprobante INTEGER NOT NULL,
    id_producto INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    valor_unitario NUMERIC(12,2) NOT NULL,
    valor_total NUMERIC(14,2)
        GENERATED ALWAYS AS (
            cantidad * valor_unitario
        ) STORED,
    igv NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    isc NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,
    descuento NUMERIC(12,2)
        NOT NULL DEFAULT 0.00,

    CONSTRAINT pk_detalle_reabastecimiento
        PRIMARY KEY (id_detalle),

    CONSTRAINT fk_detalle_reab_comprobante
        FOREIGN KEY (id_comprobante)
        REFERENCES comprobante_reabastecimiento(id_comprobante)
        ON DELETE CASCADE,

    CONSTRAINT fk_detalle_reab_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto),

    CONSTRAINT chk_detalle_reab_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_detalle_reab_valor
        CHECK (valor_unitario >= 0),

    CONSTRAINT chk_detalle_reab_igv
        CHECK (igv >= 0),

    CONSTRAINT chk_detalle_reab_isc
        CHECK (isc >= 0),

    CONSTRAINT chk_detalle_reab_descuento
        CHECK (descuento >= 0)
);

CREATE TABLE movimiento_almacen (
    id_movimiento INTEGER
        GENERATED ALWAYS AS IDENTITY,
    id_producto INTEGER NOT NULL,
    id_orden_atencion INTEGER NULL,
    id_comprobante_reab INTEGER NULL,
    id_detalle_comprobante_venta INTEGER NULL,
    cantidad INTEGER NOT NULL,
    tipo tipo_movimiento NOT NULL,
    fecha_hora TIMESTAMP
        NOT NULL DEFAULT CURRENT_TIMESTAMP,
	activo BOOLEAN NOT NULL DEFAULT TRUE,
	registrado_por INTEGER NULL,
    observacion TEXT NULL,
	
    CONSTRAINT pk_movimiento_almacen
        PRIMARY KEY (id_movimiento),

    CONSTRAINT fk_movimiento_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id_producto),

    CONSTRAINT fk_movimiento_orden
        FOREIGN KEY (id_orden_atencion)
        REFERENCES orden_atencion(id_atencion)
        ON DELETE SET NULL,

    CONSTRAINT fk_movimiento_reab
        FOREIGN KEY (id_comprobante_reab)
        REFERENCES comprobante_reabastecimiento(id_comprobante)
        ON DELETE SET NULL,

    CONSTRAINT fk_movimiento_venta
        FOREIGN KEY (id_detalle_comprobante_venta)
        REFERENCES detalle_comprobante_venta(id_detalle)
        ON DELETE SET NULL,

	CONSTRAINT fk_movimiento_registrado_por 
		FOREIGN KEY (registrado_por) 
		REFERENCES usuario(id_usuario),
	
    CONSTRAINT chk_movimiento_cantidad
        CHECK (cantidad > 0),

    CONSTRAINT chk_movimiento_origen
        CHECK (
            num_nonnulls(
                id_orden_atencion,
                id_comprobante_reab,
                id_detalle_comprobante_venta
            ) = 1
        )
);
