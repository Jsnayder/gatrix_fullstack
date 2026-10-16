import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { AppError } from '../lib/http.js'

export function requireAuth(req, res, next) {
  const token = req.cookies.gatrix_session
  if (!token) return next(new AppError(401, 'Debes iniciar sesión.'))

  try {
    req.user = jwt.verify(token, env.jwtSecret)
    next()
  } catch {
    next(new AppError(401, 'La sesión expiró.'))
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(new AppError(401, 'Debes iniciar sesión.'))
    if (!allowedRoles.includes(req.user.rol)) {
      return next(new AppError(403, 'No tienes permisos para realizar esta acción.'))
    }
    next()
  }
}
