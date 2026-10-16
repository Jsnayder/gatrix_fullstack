# Gatrix Backend API REST

Backend independiente de Gatrix Car Wash.

## Stack
- Node.js
- Express
- PostgreSQL / node-postgres
- Zod
- JWT en cookie HttpOnly
- bcrypt

## Configuración
Copia `.env.example` a `.env` y confirma usuario, contraseña y base PostgreSQL.

```powershell
Copy-Item .env.example .env
npm install
```

### Base nueva
```powershell
npm run db:init
```

### Base existente
Agrega/verifica los campos de tienda, catálogos, índices y administrador:
```powershell
npm run db:bootstrap
```

### Iniciar API
```powershell
npm run dev
```

API: `http://localhost:4000/api/health`

Credencial inicial de desarrollo: `admin / 1234`.

## Cambio de tienda
`producto` incluye:
- `imagen_url TEXT NULL`
- `visible_tienda BOOLEAN NOT NULL DEFAULT FALSE`

`database/store_extension.sql` permite aplicar ambos campos a una base que ya existe.

## Sesión
`GET /api/auth/me` devuelve HTTP 200 con `user: null` cuando no hay sesión. Esto evita que una visita pública genere un 401 esperado y, junto con un único chequeo inicial del frontend, corrige el llamado duplicado a inicio de sesión observado en desarrollo.
