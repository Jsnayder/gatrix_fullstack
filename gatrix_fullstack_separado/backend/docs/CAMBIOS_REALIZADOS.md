# Cambios realizados

1. Frontend y backend separados en proyectos independientes.
2. Se revisaron los documentos de `/docs` y se actualizaron para reflejar la arquitectura final.
3. `producto` incorpora `imagen_url` y `visible_tienda`; también existe `store_extension.sql` para bases existentes.
4. El chequeo de sesión ya no genera 401 si el visitante no ha iniciado sesión y el frontend realiza un solo chequeo inicial.
5. Las vistas públicas React reutilizan la composición visual y recursos del antiguo `gatrix_sistema_completo.zip`.
6. Las imágenes de servicios son assets del frontend asociados por categoría. No se almacenan en PostgreSQL en esta versión. Las imágenes de productos sí pueden configurarse mediante `producto.imagen_url`.
