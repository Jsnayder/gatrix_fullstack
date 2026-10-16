# Referencias técnicas y visuales

## Técnicas
- Vite: https://vite.dev/guide/
- React Router: https://reactrouter.com/
- Express: https://expressjs.com/
- node-postgres: https://node-postgres.com/
- Referencia pública de arquitectura React/Vite + Express + PostgreSQL: https://github.com/cloudysideup/realworld-react-express-sql

## Fuente visual del frontend
La composición del frontend React reutiliza la estructura visual, colores y recursos gráficos entregados por el usuario en `gatrix_sistema_completo.zip`. El HTML estático se convirtió a JSX y los estilos se reorganizaron para React/CSS Modules.

## Imágenes
Las imágenes `Imagen01.png`, `Imagen03.png`, `Imagen04.png`, `Imagen05.png`, `Imagen06.png`, `Imagen07.png`, `Imagen08.png` e `Imagen09.png` provienen del archivo visual entregado por el usuario y se guardan como assets del frontend.

Para servicios son imágenes estáticas asociadas por categoría y no se persisten en la base de datos. Para productos, el modelo sí incorpora `producto.imagen_url`, porque cada producto de tienda puede requerir una imagen propia administrable.
