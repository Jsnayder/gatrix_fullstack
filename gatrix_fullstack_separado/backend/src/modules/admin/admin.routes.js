import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { db } from '../../config/db.js'
import { asyncHandler, AppError } from '../../lib/http.js'
import { requireAuth, requireRole } from '../../middleware/auth.js'

const router = Router()
router.use(requireAuth)

router.get('/dashboard', asyncHandler(async (req, res) => {
  const [attention, lowStock, income, reservations, activity] = await Promise.all([
    db.query(`SELECT COUNT(*)::int AS n FROM orden_atencion WHERE activo = TRUE AND fecha = CURRENT_DATE`),
    db.query(`SELECT COUNT(*)::int AS n
              FROM detalle_producto dp
              JOIN producto p ON p.id_producto = dp.id_producto
              WHERE p.activo = TRUE AND dp.stock_actual <= dp.stock_minimo`),
    db.query(`SELECT COALESCE(SUM(importe_total), 0)::numeric AS n
              FROM comprobante_venta
              WHERE activo = TRUE AND fecha_emision = CURRENT_DATE`),
    db.query(`SELECT COUNT(*)::int AS n
              FROM orden_atencion
              WHERE activo = TRUE AND fecha = CURRENT_DATE AND estado = 'PROGRAMADA'`),
    db.query(`SELECT id_bitacora, fecha_hora, tabla_afectada, operacion, registro_id
              FROM bitacora_operacion
              ORDER BY fecha_hora DESC
              LIMIT 8`)
  ])

  res.json({
    atenciones_hoy: attention.rows[0].n,
    stock_bajo: lowStock.rows[0].n,
    ingresos_hoy: income.rows[0].n,
    reservas_hoy: reservations.rows[0].n,
    actividad: activity.rows
  })
}))

router.get('/clients', asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT id_cliente, nombres, apellidos, telefono, email, dni, fecha_registro
    FROM cliente
    WHERE activo = TRUE
    ORDER BY fecha_registro DESC
    LIMIT 200
  `)
  res.json({ items: rows })
}))

const clientSchema = z.object({
  nombres: z.string().trim().min(2).max(100),
  apellidos: z.string().trim().min(2).max(100),
  telefono: z.string().trim().min(7).max(15),
  email: z.string().trim().email().optional().or(z.literal('')),
  dni: z.string().trim().min(8).max(15)
})

router.post('/clients', asyncHandler(async (req, res) => {
  const parsed = clientSchema.safeParse(req.body)
  if (!parsed.success) throw new AppError(400, 'Datos de cliente inválidos.', parsed.error.flatten())

  const data = parsed.data
  const { rows } = await db.query(`
    INSERT INTO cliente(nombres, apellidos, telefono, email, dni)
    VALUES($1, $2, $3, NULLIF($4, ''), $5)
    RETURNING id_cliente
  `, [data.nombres, data.apellidos, data.telefono, data.email, data.dni])

  res.status(201).json(rows[0])
}))

router.get('/services', asyncHandler(async (req, res) => {
  const [services, categories] = await Promise.all([
    db.query(`
      SELECT s.id_servicio, s.nombre, s.precio, s.duracion_min, s.descripcion,
             c.id_categoria, c.nombre AS categoria
      FROM servicio s
      JOIN categoria_servicio c ON c.id_categoria = s.id_categoria
      WHERE s.activo = TRUE
      ORDER BY s.nombre
    `),
    db.query(`
      SELECT id_categoria, nombre
      FROM categoria_servicio
      WHERE activo = TRUE
      ORDER BY nombre
    `)
  ])

  res.json({ items: services.rows, categories: categories.rows })
}))

const serviceSchema = z.object({
  nombre: z.string().trim().min(2).max(150),
  precio: z.coerce.number().min(0),
  duracion_min: z.coerce.number().int().positive(),
  descripcion: z.string().trim().min(2).max(255),
  id_categoria: z.coerce.number().int().positive()
})

router.post('/services', asyncHandler(async (req, res) => {
  const parsed = serviceSchema.safeParse(req.body)
  if (!parsed.success) throw new AppError(400, 'Datos de servicio inválidos.', parsed.error.flatten())

  const data = parsed.data
  const category = (await db.query(
    `SELECT id_categoria FROM categoria_servicio WHERE id_categoria = $1 AND activo = TRUE`,
    [data.id_categoria]
  )).rows[0]
  if (!category) throw new AppError(400, 'La categoría seleccionada no existe o está inactiva.')

  const { rows } = await db.query(`
    INSERT INTO servicio(nombre, precio, duracion_min, descripcion, id_categoria)
    VALUES($1, $2, $3, $4, $5)
    RETURNING id_servicio
  `, [data.nombre, data.precio, data.duracion_min, data.descripcion, data.id_categoria])

  res.status(201).json(rows[0])
}))

router.get('/attention', asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT oa.id_atencion, oa.fecha, oa.hora, oa.total, oa.estado,
           c.nombres || ' ' || c.apellidos AS cliente,
           v.placa, v.marca,
           STRING_AGG(s.nombre, ', ' ORDER BY s.nombre) AS servicios
    FROM orden_atencion oa
    JOIN vehiculo v ON v.id_vehiculo = oa.id_vehiculo
    JOIN cliente c ON c.id_cliente = v.id_cliente
    LEFT JOIN detalle_orden d ON d.id_atencion = oa.id_atencion AND d.activo = TRUE
    LEFT JOIN servicio s ON s.id_servicio = d.id_servicio
    WHERE oa.activo = TRUE
    GROUP BY oa.id_atencion, c.nombres, c.apellidos, v.placa, v.marca
    ORDER BY oa.fecha DESC, oa.hora DESC
    LIMIT 300
  `)
  res.json({ items: rows })
}))

router.get('/reservations', asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT oa.id_atencion, oa.fecha, oa.hora, oa.estado,
           c.nombres || ' ' || c.apellidos AS cliente,
           c.telefono, v.placa, v.marca,
           STRING_AGG(s.nombre, ', ' ORDER BY s.nombre) AS servicios
    FROM orden_atencion oa
    JOIN vehiculo v ON v.id_vehiculo = oa.id_vehiculo
    JOIN cliente c ON c.id_cliente = v.id_cliente
    LEFT JOIN detalle_orden d ON d.id_atencion = oa.id_atencion AND d.activo = TRUE
    LEFT JOIN servicio s ON s.id_servicio = d.id_servicio
    WHERE oa.activo = TRUE AND oa.estado = 'PROGRAMADA'
    GROUP BY oa.id_atencion, c.nombres, c.apellidos, c.telefono, v.placa, v.marca
    ORDER BY oa.fecha, oa.hora
  `)
  res.json({ items: rows })
}))

router.get('/products', asyncHandler(async (req, res) => {
  const [products, categories] = await Promise.all([
    db.query(`
      SELECT p.id_producto, p.codigo, p.descripcion, p.unidad_medida,
             p.precio_unitario, p.igv_porcentaje, p.isc_porcentaje,
             p.imagen_url, p.visible_tienda,
             COALESCE(dp.stock_minimo, 0) AS stock_minimo,
             COALESCE(dp.stock_actual, 0) AS stock_actual,
             dp.ubicacion, cp.id_categoria, cp.nombre AS categoria
      FROM producto p
      LEFT JOIN detalle_producto dp ON dp.id_producto = p.id_producto
      LEFT JOIN categoria_producto cp ON cp.id_categoria = dp.id_categoria
      WHERE p.activo = TRUE
      ORDER BY p.descripcion
    `),
    db.query(`
      SELECT id_categoria, nombre
      FROM categoria_producto
      WHERE activo = TRUE
      ORDER BY nombre
    `)
  ])

  res.json({ items: products.rows, categories: categories.rows })
}))

const productSchema = z.object({
  codigo: z.string().trim().min(2).max(25),
  descripcion: z.string().trim().min(2).max(200),
  unidad_medida: z.string().trim().min(1).max(20),
  precio_unitario: z.coerce.number().min(0),
  id_categoria: z.coerce.number().int().positive(),
  stock_minimo: z.coerce.number().int().min(0),
  stock_actual: z.coerce.number().int().min(0),
  ubicacion: z.string().trim().max(100).optional().or(z.literal('')),
  imagen_url: z.string().trim().url().optional().or(z.literal('')),
  visible_tienda: z.boolean().default(false)
})

router.post('/products', asyncHandler(async (req, res) => {
  const parsed = productSchema.safeParse(req.body)
  if (!parsed.success) throw new AppError(400, 'Datos de producto inválidos.', parsed.error.flatten())

  const data = parsed.data
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const category = (await client.query(
      `SELECT id_categoria FROM categoria_producto WHERE id_categoria = $1 AND activo = TRUE`,
      [data.id_categoria]
    )).rows[0]
    if (!category) throw new AppError(400, 'La categoría seleccionada no existe o está inactiva.')

    const product = (await client.query(`
      INSERT INTO producto(codigo, descripcion, unidad_medida, precio_unitario, imagen_url, visible_tienda, creado_por)
      VALUES($1, $2, $3, $4, NULLIF($5, ''), $6, $7)
      RETURNING id_producto
    `, [data.codigo, data.descripcion, data.unidad_medida, data.precio_unitario, data.imagen_url, data.visible_tienda, req.user.id])).rows[0]

    await client.query(`
      INSERT INTO detalle_producto(id_producto, id_categoria, ubicacion, stock_minimo, stock_actual)
      VALUES($1, $2, NULLIF($3, ''), $4, $5)
    `, [product.id_producto, data.id_categoria, data.ubicacion, data.stock_minimo, data.stock_actual])

    await client.query(`
      INSERT INTO bitacora_operacion(id_usuario, tabla_afectada, operacion, registro_id, datos_nuevos)
      VALUES($1, 'producto', 'INSERT', $2, $3::jsonb)
    `, [req.user.id, product.id_producto, JSON.stringify(data)])

    await client.query('COMMIT')
    res.status(201).json(product)
  } catch (error) {
    await client.query('ROLLBACK')
    if (error.code === '23505') throw new AppError(409, 'Ya existe un producto con ese código.')
    throw error
  } finally {
    client.release()
  }
}))

router.get('/finance', asyncHandler(async (req, res) => {
  const [summary, items] = await Promise.all([
    db.query(`
      SELECT COALESCE(SUM(importe_total), 0) AS ingresos_hoy,
             COUNT(*)::int AS comprobantes_hoy
      FROM comprobante_venta
      WHERE activo = TRUE AND fecha_emision = CURRENT_DATE
    `),
    db.query(`
      SELECT cv.id_comprobante, cv.fecha_emision, cv.tipo_comprobante,
             cv.serie, cv.numero, cv.importe_total, cv.estado_sunat,
             mp.nombre AS metodo_pago
      FROM comprobante_venta cv
      JOIN metodo_pago mp ON mp.id_metodo = cv.id_metodo
      WHERE cv.activo = TRUE
      ORDER BY cv.fecha_emision DESC, cv.id_comprobante DESC
      LIMIT 200
    `)
  ])

  res.json({ summary: summary.rows[0], items: items.rows })
}))

router.get('/users', requireRole('Administrador'), asyncHandler(async (req, res) => {
  const [users, roles] = await Promise.all([
    db.query(`
      SELECT u.id_usuario, u.username, u.activo, u.ultimo_acceso, u.fecha_creacion,
             e.id_empleado, e.nombres, e.apellidos, e.telefono, e.tipo_contrato,
             r.id_rol, r.nombre AS rol
      FROM usuario u
      JOIN empleado e ON e.id_empleado = u.id_empleado
      JOIN rol r ON r.id_rol = u.id_rol
      ORDER BY u.fecha_creacion DESC, u.id_usuario DESC
    `),
    db.query(`
      SELECT id_rol, nombre, descripcion, nivel_prioridad
      FROM rol
      WHERE activo = TRUE
      ORDER BY nivel_prioridad DESC, nombre
    `)
  ])

  res.json({ items: users.rows, roles: roles.rows })
}))

const userSchema = z.object({
  nombres: z.string().trim().min(2).max(100),
  apellidos: z.string().trim().min(2).max(100),
  telefono: z.string().trim().max(15).optional().or(z.literal('')),
  tipo_contrato: z.string().trim().max(50).optional().or(z.literal('')),
  username: z.string().trim().min(3).max(50).regex(/^[a-zA-Z0-9._-]+$/, 'Usuario inválido'),
  password: z.string().min(4).max(100),
  id_rol: z.coerce.number().int().positive()
})

router.post('/users', requireRole('Administrador'), asyncHandler(async (req, res) => {
  const parsed = userSchema.safeParse(req.body)
  if (!parsed.success) throw new AppError(400, 'Datos de usuario inválidos.', parsed.error.flatten())

  const data = parsed.data
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const role = (await client.query(
      `SELECT id_rol FROM rol WHERE id_rol = $1 AND activo = TRUE`,
      [data.id_rol]
    )).rows[0]
    if (!role) throw new AppError(400, 'El rol seleccionado no está disponible.')

    const employee = (await client.query(`
      INSERT INTO empleado(nombres, apellidos, telefono, activo, fecha_contrato, tipo_contrato)
      VALUES($1, $2, NULLIF($3, ''), TRUE, CURRENT_DATE, NULLIF($4, ''))
      RETURNING id_empleado
    `, [data.nombres, data.apellidos, data.telefono, data.tipo_contrato])).rows[0]

    const passwordHash = await bcrypt.hash(data.password, 12)
    const user = (await client.query(`
      INSERT INTO usuario(id_empleado, username, password_hash, id_rol, activo)
      VALUES($1, $2, $3, $4, TRUE)
      RETURNING id_usuario, username, activo, fecha_creacion
    `, [employee.id_empleado, data.username, passwordHash, data.id_rol])).rows[0]

    await client.query(`
      INSERT INTO bitacora_operacion(id_usuario, tabla_afectada, operacion, registro_id, datos_nuevos)
      VALUES($1, 'usuario', 'INSERT', $2, jsonb_build_object('username', $3, 'id_rol', $4))
    `, [req.user.id, user.id_usuario, user.username, data.id_rol])

    await client.query('COMMIT')
    res.status(201).json(user)
  } catch (error) {
    await client.query('ROLLBACK')
    if (error.code === '23505') throw new AppError(409, 'Ese nombre de usuario ya existe.')
    throw error
  } finally {
    client.release()
  }
}))

router.get('/catalogs', requireRole('Administrador'), asyncHandler(async (req, res) => {
  const [serviceCategories, productCategories, paymentMethods, enums] = await Promise.all([
    db.query(`SELECT id_categoria, nombre, activo FROM categoria_servicio ORDER BY nombre`),
    db.query(`SELECT id_categoria, nombre, activo FROM categoria_producto ORDER BY nombre`),
    db.query(`SELECT id_metodo, nombre, activo FROM metodo_pago ORDER BY nombre`),
    db.query(`
      SELECT t.typname AS tipo, e.enumlabel AS valor, e.enumsortorder AS orden
      FROM pg_type t
      JOIN pg_enum e ON t.oid = e.enumtypid
      WHERE t.typname IN ('estado_orden', 'tipo_comprobante', 'estado_sunat', 'tipo_movimiento')
      ORDER BY t.typname, e.enumsortorder
    `)
  ])

  const enumMap = enums.rows.reduce((acc, row) => {
    acc[row.tipo] ??= []
    acc[row.tipo].push(row.valor)
    return acc
  }, {})

  res.json({
    categoria_servicio: serviceCategories.rows,
    categoria_producto: productCategories.rows,
    metodo_pago: paymentMethods.rows,
    enums: enumMap
  })
}))

export default router
