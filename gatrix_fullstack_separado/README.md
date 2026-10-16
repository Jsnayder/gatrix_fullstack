# Gatrix Car Wash

Proyecto organizado en dos carpetas principales:

- `frontend/`: sitio público, tienda, reservas, login y panel administrativo.
- `backend/`: servidor, seguridad, reglas de negocio y conexión con la base de datos.

## Ejecución

### Backend

```powershell
cd backend
Copy-Item .env.example .env
npm install
npm run db:bootstrap
npm run dev
```

### Frontend

Abre una segunda terminal:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Abre el sistema en:

`http://localhost:5173`

## Diseño

Las vistas HTML/CSS del proyecto visual anterior fueron trasladadas a componentes reutilizables para conservar la identidad de Gatrix sin mantener archivos HTML duplicados.
