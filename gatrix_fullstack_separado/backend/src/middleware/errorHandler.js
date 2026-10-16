export function notFound(req, res) {
  res.status(404).json({ message: 'Ruta no encontrada.' })
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error)
  const status = error.status || 500
  if (status >= 500) console.error(error)
  res.status(status).json({
    message: status === 500 ? 'Error interno del servidor.' : error.message,
    details: error.details
  })
}
