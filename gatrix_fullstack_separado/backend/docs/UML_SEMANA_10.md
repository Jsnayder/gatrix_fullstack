# UML y modelado — Semana 10

## Diagrama de clases / entidades principales
```mermaid
classDiagram
  class Cliente {
    +id_cliente
    +nombres
    +apellidos
    +telefono
    +email
    +dni
  }
  class Vehiculo {
    +id_vehiculo
    +placa
    +marca
    +color
  }
  class OrdenAtencion {
    +id_atencion
    +fecha
    +hora
    +subtotal
    +igv
    +total
    +estado
  }
  class Servicio {
    +id_servicio
    +nombre
    +precio
    +duracion_min
  }
  class Producto {
    +id_producto
    +codigo
    +descripcion
    +precio_unitario
    +imagen_url
    +visible_tienda
  }
  class DetalleProducto {
    +stock_minimo
    +stock_actual
  }
  class Usuario {
    +id_usuario
    +username
    +password_hash
  }
  class Rol {
    +id_rol
    +nombre
  }
  Cliente "1" --> "0..*" Vehiculo
  Vehiculo "1" --> "0..*" OrdenAtencion
  OrdenAtencion "*" --> "*" Servicio : detalle_orden
  Producto "1" --> "1" DetalleProducto
  Usuario "*" --> "1" Rol
```

## Diagrama de secuencia — inicio de sesión
```mermaid
sequenceDiagram
  actor Admin
  participant React
  participant API as Express API
  participant DB as PostgreSQL
  React->>API: GET /api/auth/me
  API-->>React: user o null (200)
  Admin->>React: usuario + contraseña
  React->>API: POST /api/auth/login
  API->>DB: buscar usuario
  DB-->>API: hash + rol
  API->>API: bcrypt.compare()
  API-->>React: cookie HttpOnly + usuario
  React->>API: GET /api/admin/dashboard
  API->>DB: consultas agregadas
  DB-->>API: indicadores
  API-->>React: JSON
```

## Diagrama de actividad — reserva pública
```mermaid
flowchart TD
  A[Cliente abre Reservas] --> B[Completa datos]
  B --> C{Datos válidos?}
  C -- No --> D[Mostrar validación]
  C -- Sí --> E[Buscar/crear cliente]
  E --> F[Buscar/crear vehículo]
  F --> G[Validar servicio y empleado activo]
  G --> H{Configuración disponible?}
  H -- No --> I[Respuesta 409]
  H -- Sí --> J[Crear orden PROGRAMADA]
  J --> K[Crear detalle_orden]
  K --> L[Confirmar transacción]
  L --> M[Mostrar código de reserva]
```

## Diagrama de componentes
```mermaid
flowchart LR
  subgraph Frontend[ZIP Frontend - React + Vite]
    Pages[Páginas]
    Layouts[Layouts]
    Context[Context API]
    ApiClient[services/api.js]
  end
  subgraph Backend[ZIP Backend - Express]
    Auth[Auth]
    Public[Public]
    Admin[Admin]
    Middleware[Middleware]
  end
  DB[(PostgreSQL)]
  Pages --> Layouts
  Pages --> Context
  Pages --> ApiClient
  ApiClient --> Auth
  ApiClient --> Public
  ApiClient --> Admin
  Auth --> DB
  Public --> DB
  Admin --> DB
```

## Diagrama de despliegue
```mermaid
flowchart LR
  Browser[Navegador] -->|HTTPS| Frontend[Build Vite]
  Frontend -->|HTTPS JSON| API[Node.js + Express]
  API -->|TCP 5432| Pg[(PostgreSQL)]
```
