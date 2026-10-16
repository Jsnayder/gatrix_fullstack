import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { env } from './config/env.js'
import authRoutes from './modules/auth/auth.routes.js'
import publicRoutes from './modules/public/public.routes.js'
import adminRoutes from './modules/admin/admin.routes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  app.use(helmet())
  app.use(cors({ origin: env.clientOrigin, credentials: true }))
  app.use(express.json({ limit: '1mb' }))
  app.use(cookieParser())

  app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
  app.use('/api/auth', authRoutes)
  app.use('/api/public', publicRoutes)
  app.use('/api/admin', adminRoutes)
  app.use(notFound)
  app.use(errorHandler)

  return app
}
