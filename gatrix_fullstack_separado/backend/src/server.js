import { createApp } from './app.js'
import { db } from './config/db.js'
import { env } from './config/env.js'

const app = createApp()

async function start() {
  try {
    await db.query('SELECT 1')
    app.listen(env.port, () => {
      console.log(`Gatrix API: http://localhost:${env.port}`)
    })
  } catch (error) {
    console.error('No se pudo conectar a PostgreSQL:', error.message)
    process.exit(1)
  }
}

start()
