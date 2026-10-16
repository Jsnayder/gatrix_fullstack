# API REST — Gatrix

Base local: `http://localhost:4000/api`

## Pública
- `GET /health`
- `GET /public/services`
- `GET /public/products?page=1&pageSize=8&q=&category=`
- `POST /public/reservations`

`GET /public/products` devuelve únicamente productos con `activo = TRUE` y `visible_tienda = TRUE`, e incluye `imagen_url`.

## Autenticación
- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`

`GET /auth/me` es una comprobación de sesión idempotente: cuando no existe cookie válida devuelve `{ "user": null }` con HTTP 200. De este modo abrir la web pública no genera un error 401 "Debes iniciar sesión". El frontend también evita el doble chequeo inicial que ocurría en desarrollo con `React.StrictMode`.

## Administración autenticada
- `GET /admin/dashboard`
- `GET|POST /admin/clients`
- `GET|POST /admin/services`
- `GET /admin/attention`
- `GET /admin/reservations`
- `GET|POST /admin/products`
- `GET /admin/finance`

## Solo rol Administrador
- `GET /admin/users`
- `POST /admin/users`
- `GET /admin/catalogs`

`POST /admin/users` crea de forma transaccional un registro en `empleado` y su registro correspondiente en `usuario`. La contraseña se almacena con bcrypt.
