import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import { db } from '../config/db.js'

const here = path.dirname(fileURLToPath(import.meta.url))
const databaseDir = path.resolve(here, '../../database')

export async function runSqlFile(name) {
  const sql = await fs.readFile(path.join(databaseDir, name), 'utf8')
  await db.query(sql)
  console.log(`Aplicado: ${name}`)
}

export async function ensureInitialAdmin() {
  const client = await db.connect()
  try {
    await client.query('BEGIN')

    let role = (await client.query(
      `SELECT id_rol FROM rol WHERE nombre = 'Administrador' LIMIT 1`
    )).rows[0]

    if (!role) {
      role = (await client.query(
        `INSERT INTO rol(nombre, descripcion, nivel_prioridad, activo)
         VALUES('Administrador', 'Control total del sistema Gatrix', 100, TRUE)
         RETURNING id_rol`
      )).rows[0]
    }

    let employee = (await client.query(
      `SELECT id_empleado
       FROM empleado
       WHERE nombres = 'Administrador' AND apellidos = 'Sistema'
       ORDER BY id_empleado
       LIMIT 1`
    )).rows[0]

    if (!employee) {
      employee = (await client.query(
        `INSERT INTO empleado(nombres, apellidos, telefono, activo, tipo_contrato)
         VALUES('Administrador', 'Sistema', NULL, TRUE, 'SISTEMA')
         RETURNING id_empleado`
      )).rows[0]
    }

    const existing = (await client.query(
      `SELECT id_usuario FROM usuario WHERE username = 'admin' LIMIT 1`
    )).rows[0]

    if (!existing) {
      const passwordHash = await bcrypt.hash('1234', 12)
      await client.query(
        `INSERT INTO usuario(id_empleado, username, password_hash, id_rol, activo)
         VALUES($1, 'admin', $2, $3, TRUE)`,
        [employee.id_empleado, passwordHash, role.id_rol]
      )
    }

    await client.query('COMMIT')
    console.log('Usuario inicial disponible: admin / 1234')
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
