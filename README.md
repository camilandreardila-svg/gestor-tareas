# Gestor de Tareas

Proyecto de la actividad de desarrollo frontend. Es una aplicación web para registrar y organizar tareas, hecha con React.

Demo: https://gestor-tareas-g5qn.onrender.com

## Funcionalidades

- Registro e inicio de sesión de usuarios
- Crear tareas con título, descripción, fecha de vencimiento y prioridad
- Ver las tareas organizadas por estado (pendiente, en progreso, completada)
- Editar y eliminar tareas
- Marcar tareas como completadas
- Buscar por título o descripción y filtrar por estado o prioridad

## Tecnologías

- Frontend: React 18, React Router y Vite
- Backend: Node.js con Express
- Base de datos: PostgreSQL
- Autenticación con JWT y contraseñas cifradas con bcrypt
- Despliegue en Render

## Cómo correrlo

Se necesita Node 20 o superior y PostgreSQL.

```
npm install
cp .env.example .env
npm run dev
```

El frontend queda en http://localhost:5173 y la API en el puerto 3000.

## Carpetas

- `client/src`: código de React (páginas, componentes, hooks y contexto de autenticación)
- `server`: API en Express (rutas de auth y de tareas)
- `render.yaml`: configuración para desplegar en Render
