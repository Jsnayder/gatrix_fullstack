# Diseño y desarrollo — Semana 10

## Arquitectura

```text
Usuario
  ↓
Frontend React + Vite
  ↓ Fetch / JSON / cookies HttpOnly
Backend Express + Node.js / API REST
  ↓ pg + consultas parametrizadas
PostgreSQL
```

Frontend y backend se entregan como proyectos separados y se comunican únicamente mediante HTTP.

## Frontend
- `components`: elementos reutilizables.
- `pages`: pantallas públicas, login y administración.
- `layouts`: layout público y layout administrativo.
- `services`: cliente HTTP.
- `context`: sesión y carrito.
- `hooks`: lógica reutilizable.
- `routes`: rutas protegidas.
- `utils`: utilidades visuales, como asociación de imágenes por categoría de servicio.
- `public/img`: imágenes reutilizadas de las vistas HTML/CSS entregadas.

Las vistas de Inicio, Nosotros, Servicios, Adicionales, Precios, Reservas y Ubicación se adaptaron desde `gatrix_sistema_completo.zip` a componentes React, eliminando dependencias y scripts que no son necesarios en la SPA.

## Backend
- `config`: entorno y conexión PostgreSQL.
- `db`: inicialización, bootstrap y ejecución de SQL.
- `middleware`: autenticación, roles y errores.
- `modules`: rutas REST por dominio.
- `lib`: utilidades HTTP.

## Base de datos
El esquema conserva ENUM, claves foráneas, CHECK y relaciones del modelo entregado. Se agregan únicamente `producto.imagen_url` y `producto.visible_tienda`, documentados en `MODELADO_DATOS.md`.

## Inicio de sesión
El flujo se corrigió para que:
1. la consulta inicial `/api/auth/me` no sea un error cuando el visitante todavía no inició sesión;
2. el frontend haga un único chequeo inicial en desarrollo;
3. las rutas `/api/admin/*` sigan requiriendo autenticación real.

## Buenas prácticas
- frontend/backend separados;
- React Router y rutas protegidas;
- CSS Modules;
- consultas parametrizadas;
- validación con Zod;
- transacciones en operaciones compuestas;
- contraseñas con bcrypt;
- cookies HttpOnly;
- `.env` fuera del repositorio;
- sin datos de negocio ficticios por defecto.
