import { db } from '../config/db.js'
import { ensureInitialAdmin, runSqlFile } from './helpers.js'

try {
  await runSqlFile('schema.sql')
  await runSqlFile('store_extension.sql')
  await runSqlFile('catalogs.sql')
  await runSqlFile('indexes.sql')
  await ensureInitialAdmin()
  console.log('Base de datos Gatrix inicializada correctamente.')
} catch (error) {
  console.error('Error inicializando BD:', error.message)
  process.exitCode = 1
} finally {
  await db.end()
}
