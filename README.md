# Ollama UI 🤖

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

Una interfaz web moderna para interactuar con modelos de Ollama, construida con React, TypeScript y MongoDB.

## 🚀 Características

- 💬 Chat en tiempo real con modelos de Ollama
- 📁 Historial de chats persistente
- 🎨 Interfaz moderna con Tailwind CSS
- 🔄 Integración con MongoDB
- 🛠️ Panel de administración con Mongo Express

## 📋 Prerrequisitos

- Node.js (v18 o superior)
- Bun
- Docker y Docker Compose
- Ollama instalado localmente

## 🔧 Configuración del Entorno

1. Clonar el repositorio:

```sh
git clone https://github.com/sandovaldavid/ollama-ui.git
cd ollama-ui
```

2. Copiar el archivo de variables de entorno:

```sh
cp .env.example .env
```

3. Configurar las variables de entorno del [`.env.example`](.env.example):

## 🗄️ Configuración de la Base de Datos

Iniciar MongoDB usando Docker Compose:

```sh
docker-compose -f docker-compose.db.yml up -d
```

Esto creará:

- 🗃️ Contenedor de MongoDB en el puerto 27017
- 🖥️ Interfaz Mongo Express en el puerto 8081

## 💻 Desarrollo Local

1. Instalar dependencias:

```sh
bun install
```

2. Iniciar el servidor de desarrollo:

```sh
bun run dev
```

## 📜 Scripts Disponibles

| Comando              | Descripción                                        |
| -------------------- | -------------------------------------------------- |
| `bun run dev`        | 🚀 Inicia el frontend y backend en modo desarrollo |
| `bun run dev:client` | 🌐 Inicia solo el frontend                         |
| `bun run dev:server` | ⚙️ Inicia solo el backend                          |
| `bun run build`      | 📦 Construye el proyecto para producción           |
| `bun run preview`    | 👀 Vista previa de la build de producción          |
| `bun run lint`       | 🔍 Ejecuta ESLint                                  |
| `bun run lint:fix`   | 🔧 Corrige errores de ESLint automáticamente       |
| `bun run format`     | ✨ Formatea el código usando Prettier              |

## 🌐 URLs de Desarrollo

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Ollama API: http://localhost:11434
- MongoDB: mongodb://localhost:27017
- Mongo Express UI: http://localhost:8081
    - Usuario: deepseek
    - Contraseña: deepseek

## 📁 Estructura del Proyecto

```
├── server/           # Servidor backend
│   ├── db/          # Configuración de base de datos
│   └── routes/      # Rutas de API
├── shared/          # Tipos y esquemas compartidos
├── src/            # Código fuente frontend
│   ├── components/ # Componentes React
│   ├── hooks/      # Hooks personalizados
│   ├── lib/        # Utilidades
│   └── pages/      # Componentes de página
```

## 🛠️ Tecnologías Utilizadas

- Frontend:

    - ⚛️ React
    - 📘 TypeScript
    - 🎨 Tailwind CSS
    - 🎯 Tanstack Query
    - 🔄 Wouter (enrutamiento)

- Backend:
    - 🚀 Express
    - 🍃 MongoDB con Mongoose
    - 📘 TypeScript

## 📄 Licencia

Este proyecto está bajo la Licencia MIT
