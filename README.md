# NaturaVida

NaturaVida es una aplicación de tienda virtual enfocada en la comercialización de productos naturales, orgánicos y saludables. El sistema está diseñado para ofrecer una experiencia de usuario fluida en la navegación y compra de productos, facilitando la gestión tanto para los clientes como para los administradores de la plataforma.

## Características Principales

* **Catálogo de Productos:** Visualización detallada de productos organizados por categorías.
* **Carrito de Compras:** Gestión dinámica de productos y cálculo de totales en tiempo real con soporte para invitados y sincronización al iniciar sesión.
* **Gestión de Usuarios:** Registro, inicio de sesión y perfiles de usuario.
* **Dashboard Administrativo:** Gestión completa de operaciones CRUD para productos y vista general de carritos activos.

## Arquitectura y Tecnologías

El proyecto está desarrollado utilizando una arquitectura frontend moderna conectada a una API REST simulada para el desarrollo ágil:

* **Frontend:** Desarrollado con React 19, Vite, Tailwind CSS v3 y Axios para peticiones HTTP.
* **Backend (Simulado):** Configurado mediante JSON Server, que proporciona una API REST completa a partir de un archivo de origen en formato JSON.

## Requisitos Previos

Para ejecutar este proyecto de forma local, asegúrese de tener instalado:

* Node.js (Versión LTS recomendada)
* Un entorno de desarrollo (IDE) como VS Code o similar

## Configuración e Instalación

### 1. Clonación e Instalación de Dependencias

Navegue al directorio de la aplicación e instale las dependencias del proyecto:

```bash
cd naturavida-react
npm install
```

### 2. Iniciar el Servidor de Datos (JSON Server)

Inicie el servidor simulado que correrá por defecto en el puerto 3000:

```bash
npm run server
```

### 3. Iniciar el Servidor de Desarrollo (Vite)

En una nueva terminal, inicie el servidor de desarrollo para el frontend:

```bash
npm run dev
```

Abra su navegador web e ingrese a la dirección `http://localhost:5173/`.

## Estructura del Repositorio

* `/src/components`: Componentes reutilizables e independientes.
* `/src/context`: Contextos globales de la aplicación (Autenticación y Carrito).
* `/src/pages`: Páginas y vistas principales.
* `/src/services`: Módulos de comunicación con la API (Axios).
* `/db`: Directorio que contiene el archivo `db.json` con la base de datos simulada.

## Contribuciones

1. Realice un Fork del repositorio.
2. Cree una nueva rama para su funcionalidad: `git checkout -b feature/NuevaFuncionalidad`.
3. Realice sus cambios y haga un commit: `git commit -m 'Añadir nueva funcionalidad'`.
4. Suba los cambios a su rama: `git push origin feature/NuevaFuncionalidad`.
5. Abra un Pull Request detallando los cambios realizados.
