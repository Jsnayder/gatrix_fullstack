# Gatrix Frontend

Frontend independiente de Gatrix Car Wash.

## Stack
- Vite
- React
- React Router
- CSS Modules
- Fetch API
- Lucide React

## Ejecutar
```powershell
npm install
npm run dev
```

Abrir: `http://localhost:5173`

El backend debe estar disponible en `http://localhost:4000`. En desarrollo Vite redirige `/api` automáticamente. Para otro dominio, copia `.env.example` a `.env` y configura `VITE_API_URL`.

## Diseño
Las vistas públicas fueron adaptadas de los HTML/CSS de `gatrix_sistema_completo.zip`. Las imágenes de servicios se incluyen como assets locales en `public/img`.
