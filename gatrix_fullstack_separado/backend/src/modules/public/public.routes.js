import { Router } from 'express'
import { z } from 'zod'
import { db } from '../../config/db.js'
import { asyncHandler, AppError } from '../../lib/http.js'

const router = Router()

router.get('/services', asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT s.id_servicio, s.nombre, s.precio, s.duracion_min, s.descripcion,
           c.nombre AS categoria
    FROM servicio s
    JOIN categoria_servicio c ON c.id_categoria = s.id_categoria
    WHERE s.activo = TRUE AND c.activo = TRUE
    ORDER BY c.nombre, s.nombre
  `)
  res.json({ items: rows })
}))

router.get('/products', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1)
  const pageSize = Math.min(24, Math.max(1, Number(req.query.pageSize) || 8))
  const search = String(req.query.q || '').trim()
  const category = Number(req.query.category) || null
  const values = [`%${search}%`, category]

  const where = `
    p.activo = TRUE
    AND p.visible_tienda = TRUE
    AND ($1 = '%%' OR p.descripcion ILIKE $1 OR p.codigo ILIKE $1)
    AND ($2::int IS NULL OR dp.id_categoria = $2)
  `

  const count = (await db.query(`
    SELECT COUNT(*)::int AS total
    FROM producto p
    LEFT JOIN detalle_producto dp ON dp.id_producto = p.id_producto
    WHERE ${where}
  `, values)).rows[0].total

  values.push(pageSize, (page - 1) * pageSize)

  const items = (await db.query(`
    SELECT p.id_producto, p.codigo, p.descripcion, p.precio_unitario,
           p.unidad_medida, p.imagen_url, p.visible_tienda,
           COALESCE(dp.stock_actual, 0) AS stock_actual,
           cp.nombre AS categoria
    FROM producto p
    LEFT JOIN detalle_producto dp ON dp.id_producto = p.id_producto
    LEFT JOIN categoria_producto cp ON cp.id_categoria = dp.id_categoria
    WHERE ${where}
    ORDER BY p.descripcion
    LIMIT $3 OFFSET $4
  `, values)).rows

  const categories = (await db.query(`
    SELECT id_categoria, nombre
    FROM categoria_producto
    WHERE activo = TRUE
    ORDER BY nombre
  `)).rows

  res.json({
    items,
    categories,
    total: count,
    page,
    pages: Math.max(1, Math.ceil(count / pageSize))
  })
}))

const reservationSchema = z.object({
  nombres: z.string().trim().min(2).max(100),
  apellidos: z.string().trim().min(2).max(100),
  dni: z.string().trim().min(8).max(15),
  telefono: z.string().trim().min(7).max(15),
  email: z.string().trim().email().optional().or(z.literal('')),
  placa: z.string().trim().min(5).max(10),
  marca: z.string().trim().min(2).max(100),
  color: z.string().trim().max(50).optional().or(z.literal('')),
  id_servicio: z.coerce.number().int().positive(),
  fecha: z.string().min(10).max(10),
  hora: z.string().min(5).max(8)
})

router.post('/reservations', asyncHandler(async (req, res) => {
  const parsed = reservationSchema.safeParse(req.body)
  if (!parsed.success) throw new AppError(400, 'Revisa los datos de la reserva.', parsed.error.flatten())

  const data = parsed.data
  const client = await db.connect()

  try {
    await client.query('BEGIN')

    const service = (await client.query(
      `SELECT id_servicio, precio FROM servicio WHERE id_servicio = $1 AND activo = TRUE`,
      [data.id_servicio]
    )).rows[0]
    if (!service) throw new AppError(404, 'El servicio seleccionado no está disponible.')

    const employee = (await client.query(
      `SELECT id_empleado FROM empleado WHERE activo = TRUE ORDER BY id_empleado LIMIT 1`
    )).rows[0]
    if (!employee) throw new AppError(409, 'No hay personal activo configurado para recibir reservas.')

    let customer = (await client.query(
      `SELECT id_cliente FROM cliente WHERE dni = $1`,
      [data.dni]
    )).rows[0]

    if (!customer) {
      customer = (await client.query(`
        INSERT INTO cliente(nombres, apellidos, telefono, email, dni)
        VALUES($1, $2, $3, NULLIF($4, ''), $5)
        RETURNING id_cliente
      `, [data.nombres, data.apellidos, data.telefono, data.email, data.dni])).rows[0]
    } else {
      await client.query(`
        UPDATE cliente
        SET nombres = $1, apellidos = $2, telefono = $3, email = NULLIF($4, ''), activo = TRUE
        WHERE id_cliente = $5
      `, [data.nombres, data.apellidos, data.telefono, data.email, customer.id_cliente])
    }

    let vehicle = (await client.query(
      `SELECT id_vehiculo FROM vehiculo WHERE placa = $1`,
      [data.placa.toUpperCase()]
    )).rows[0]

    if (!vehicle) {
      vehicle = (await client.query(`
        INSERT INTO vehiculo(placa, marca, color, id_cliente)
        VALUES($1, $2, NULLIF($3, ''), $4)
        RETURNING id_vehiculo
      `, [data.placa.toUpperCase(), data.marca, data.color, customer.id_cliente])).rows[0]
    }

    const subtotal = Number(service.precio)
    const igv = Number((subtotal * 0.18).toFixed(2))
    const total = Number((subtotal + igv).toFixed(2))

    const order = (await client.query(`
      INSERT INTO orden_atencion(
        id_empleado, id_vehiculo, fecha, hora, subtotal, igv, total, estado
      ) VALUES($1, $2, $3, $4, $5, $6, $7, 'PROGRAMADA')
      RETURNING id_atencion
    `, [employee.id_empleado, vehicle.id_vehiculo, data.fecha, data.hora, subtotal, igv, total])).rows[0]

    await client.query(
      `INSERT INTO detalle_orden(id_atencion, id_servicio) VALUES($1, $2)`,
      [order.id_atencion, data.id_servicio]
    )

    await client.query('COMMIT')
    res.status(201).json(order)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}))

export default router
