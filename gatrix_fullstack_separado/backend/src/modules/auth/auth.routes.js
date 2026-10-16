import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { db } from '../../config/db.js'
import { env } from '../../config/env.js'
import { asyncHandler, AppError } from '../../lib/http.js'

const router = Router()
const loginSchema = z.object({
  username: z.string().trim().min(3).max(50),
  password: z.string().min(4).max(100)
})
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 25, standardHeaders: true, legacyHeaders: false })

function sessionUser(req, res) {
  const token = req.cookies.gatrix_session
  if (!token) return null
  try {
    return jwt.verify(token, env.jwtSecret)
  } catch {
    res.clearCookie('gatrix_session')
    return null
  }
}

router.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) throw new AppError(400, 'Credenciales inválidas.')

  const { username, password } = parsed.data
  const { rows } = await db.query(`
    SELECT u.id_usuario, u.username, u.password_hash, u.activo, r.nombre AS rol
    FROM usuario u
    JOIN rol r ON r.id_rol = u.id_rol
    WHERE u.username = $1
    LIMIT 1
  `, [username])

  const user = rows[0]
  if (!user || !user.activo || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError(401, 'Usuario o contraseña incorrectos.')
  }

  const token = jwt.sign(
    { id: user.id_usuario, username: user.username, rol: user.rol },
    env.jwtSecret,
    { expiresIn: '8h' }
  )

  res.cookie('gatrix_session', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 8 * 60 * 60 * 1000
  })

  await db.query(
    `UPDATE usuario SET ultimo_acceso = NOW(), intentos_fallidos = 0 WHERE id_usuario = $1`,
    [user.id_usuario]
  )
  await db.query(
    `INSERT INTO bitacora_acceso(id_usuario, accion, ip, detalles)
     VALUES($1, 'LOGIN', $2, $3)`,
    [user.id_usuario, req.ip, 'Inicio de sesión exitoso']
  )

  res.json({ user: { id: user.id_usuario, username: user.username, rol: user.rol } })
}))

// Consulta de sesión: no responde 401 cuando el visitante todavía no inició sesión.
router.get('/me', (req, res) => {
  const user = sessionUser(req, res)
  res.json({ user })
})

// Cierre idempotente: si no hay sesión, simplemente limpia la cookie y responde OK.
router.post('/logout', asyncHandler(async (req, res) => {
  const user = sessionUser(req, res)
  if (user) {
    await db.query(
      `INSERT INTO bitacora_acceso(id_usuario, accion, ip, detalles)
       VALUES($1, 'LOGOUT', $2, $3)`,
      [user.id, req.ip, 'Cierre de sesión']
    )
  }
  res.clearCookie('gatrix_session')
  res.json({ ok: true })
}))

export default router
