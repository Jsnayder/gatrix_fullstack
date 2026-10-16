# ADR-001 — Separación Frontend / Backend con stack PERN

## Decisión
Separar el sistema en dos aplicaciones independientes:
- **Frontend:** React + Vite + React Router + CSS Modules.
- **Backend:** Node.js + Express + API REST + PostgreSQL.

## Motivos
- separa claramente interfaz, lógica HTTP y persistencia;
- facilita entregar y desplegar frontend y backend por separado;
- coincide con el enfoque de React, Fetch/API REST, Node, Express y SQL trabajado en el curso;
- PostgreSQL reutiliza el modelo del proyecto;
- CSS Modules reduce colisiones y permite adaptar las vistas HTML/CSS originales sin introducir código basura.

## Interfaz visual
Las vistas públicas toman como referencia directa el diseño y las imágenes del archivo `gatrix_sistema_completo.zip`. El HTML se convirtió a componentes React y el CSS se reorganizó para funcionar sin Bootstrap ni JavaScript duplicado de la versión estática.

## Alternativas descartadas
- HTML multipágina estático: no cubre SPA, Context, hooks ni rutas React.
- mezclar Express dentro de Vite: dificulta despliegue y separación de responsabilidades.
- ORM pesado: se mantiene SQL visible y auditable.
- datos simulados en dashboard o catálogos: se priorizan datos reales de PostgreSQL.
