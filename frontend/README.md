# DesoftSantiago Platform

Plataforma web para la gestión de proyectos de software, tareas, usuarios, roles, permisos, desempeño y métricas operativas.

El repositorio está organizado como un monorepo simple, pensado para evolucionar hacia una solución full-stack con frontend Angular y backend NestJS.

```text
desoft-santiago-platform/
├── frontend/   Aplicación web Angular
└── backend/    Backend previsto para la siguiente etapa
```

> Estado actual: el desarrollo funcional se encuentra en `frontend/`.

---

## 1. Descripción general

**DesoftSantiago Platform** es una aplicación orientada a equipos de desarrollo de software. Su propósito es centralizar la operación básica de proyectos, tareas, usuarios y desempeño en una interfaz profesional, moderna y preparada para integrarse posteriormente con un backend real.

La aplicación está construida como un MVP funcional, con enfoque académico/profesional, priorizando claridad arquitectónica, experiencia de usuario, mantenibilidad y posibilidad de crecimiento.

---

## 2. Funcionalidades principales

### Autenticación y acceso

- Pantalla de inicio de sesión.
- Pantalla de registro.
- Manejo de sesión en frontend.
- Cierre de sesión con confirmación.
- Control visual de permisos según el rol del usuario.
- Preparación para autenticación real mediante backend.

### Dashboard

- Resumen general de métricas.
- Indicadores de proyectos, tareas y desempeño.
- Accesos rápidos a módulos principales.

### Proyectos

- Listado de proyectos.
- Creación de proyectos.
- Edición de proyectos.
- Detalle de proyecto.
- Validaciones de formulario.
- Acciones visibles según permisos.

### Tareas

- Tablero Kanban.
- Creación de tareas.
- Edición de tareas.
- Cambio de estado de tareas.
- Eliminación con confirmación.
- Filtros y búsqueda.

### Usuarios y equipo

- Listado de miembros del equipo.
- Creación y edición de usuarios.
- Gestión de estado del usuario.
- Separación entre rol de acceso y rol funcional.
- Simulación de invitación/restablecimiento para el MVP.

### Roles y permisos

- Matriz visual de permisos.
- Protección de rutas.
- Filtrado del menú lateral por rol.
- Ocultamiento de acciones no permitidas.

### Desempeño

- Vista de evaluación básica.
- Métricas de productividad y participación del equipo.

---

## 3. Stack tecnológico

### Frontend

- Angular 21
- Angular Material
- Angular Signals
- SCSS
- CASL para permisos
- SweetAlert2 para confirmaciones y mensajes
- ESLint con angular-eslint
- Prettier
- Fuentes autoalojadas
- Material Symbols autoalojado
- Assets servidos desde `public/`

### Backend previsto

- NestJS
- TypeORM
- PostgreSQL
- JWT y refresh tokens
- Arquitectura multi-tenant con `Organization`
- Módulos previstos:
  - Auth
  - Users
  - Projects
  - Tasks

---

## 4. Arquitectura del frontend

La aplicación está organizada por capas y por funcionalidades.

```text
frontend/src/app/
├── core/
│   ├── auth/
│   ├── layout/
│   ├── models/
│   ├── notifications/
│   └── permissions/
│
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── performance/
│   ├── projects/
│   ├── roles-permissions/
│   ├── tasks/
│   └── users/
│
└── shared/
    └── ui/
```

### `core/`

Contiene piezas transversales del sistema:

- Autenticación.
- Guards.
- Interceptores.
- Layout principal.
- Sidebar y topbar.
- Servicio global de notificaciones.
- Configuración de permisos.

### `features/`

Agrupa las funcionalidades principales por dominio:

- Auth.
- Dashboard.
- Projects.
- Tasks.
- Users.
- Performance.
- Roles and permissions.

### `shared/`

Contiene componentes reutilizables de interfaz.

---

## 5. Diseño de interfaz

El diseño sigue una línea visual SaaS institucional:

- Paleta azul corporativa.
- Login con estilo glassmorphism.
- Fondo tecnológico institucional.
- Cards limpias.
- Sidebar y topbar responsivos.
- Tipografía moderna.
- Iconografía local.
- Formularios con validación clara.
- Estados visuales para botones habilitados/deshabilitados.
- Confirmaciones profesionales para acciones sensibles.

Las fuentes y los iconos están autoalojados para reducir dependencias externas y mejorar la estabilidad del entorno de ejecución.

---

## 6. Gestión de permisos

La aplicación usa CASL para gestionar permisos en frontend.

Roles principales:

- `ADMIN`
- `MANAGER`
- `MEMBER`

Los permisos afectan:

- Rutas disponibles.
- Opciones del sidebar.
- Botones visibles.
- Acciones permitidas en proyectos, tareas y usuarios.

> Nota: el control de permisos en frontend mejora la experiencia de usuario, pero en producción debe complementarse con validaciones obligatorias en backend.

---

## 7. Seguridad y datos sensibles

Este repositorio no debe incluir:

- Contraseñas reales.
- Tokens personales.
- Variables de entorno privadas.
- Credenciales de servicios externos.
- Datos sensibles de usuarios reales.

El flujo actual de autenticación es de demostración para el MVP. La autenticación definitiva debe implementarse desde el backend utilizando hash seguro de contraseñas, tokens de acceso, refresh tokens y validación server-side de permisos.

---

## 8. Requisitos previos

- Node.js compatible con Angular 21.
- npm.
- Git.

---

## 9. Instalación y ejecución

Desde la raíz del repositorio:

```bash
cd frontend
npm install
npm start
```

La aplicación quedará disponible normalmente en:

```text
http://localhost:4200
```

---

## 10. Comandos útiles

Ejecutar en desarrollo:

```bash
cd frontend
npm start
```

Compilar para producción:

```bash
cd frontend
npm run build
```

Ejecutar lint:

```bash
cd frontend
npm run lint
```

Instalar dependencias:

```bash
cd frontend
npm install
```

---

## 11. Flujo Git recomendado

El control de versiones se maneja desde la raíz del monorepo:

```text
desoft-santiago-platform/
```

Primer commit recomendado:

```bash
git status
git add .
git commit -m "chore(repo): iniciar monorepo desoft santiago platform"
```

Agregar remoto:

```bash
git remote add origin https://github.com/USUARIO/desoft-santiago-platform.git
git branch -M main
git push -u origin main
```

Si el remoto ya existe:

```bash
git remote -v
git push -u origin main
```

---

## 12. Convención de commits

El proyecto recomienda usar Conventional Commits.

Formato:

```text
tipo(scope): descripción
```

Ejemplos:

```bash
feat(auth): implementar flujo de autenticación
feat(projects): agregar gestión de proyectos
feat(tasks): implementar tablero kanban
feat(users): agregar gestión de usuarios
feat(permissions): integrar roles y permisos
fix(forms): corregir validaciones de formularios
style(login): ajustar diseño de autenticación
docs(readme): actualizar documentación del proyecto
chore(repo): configurar herramientas del repositorio
```

Tipos sugeridos:

- `feat`: nueva funcionalidad.
- `fix`: corrección de errores.
- `docs`: documentación.
- `style`: cambios visuales o de formato.
- `refactor`: mejora interna sin cambiar comportamiento.
- `chore`: configuración o mantenimiento.
- `test`: pruebas.
- `build`: cambios de build.
- `ci`: integración continua.

---

## 13. Despliegue en Netlify

Para desplegar el frontend en Netlify:

```text
Base directory: frontend
Build command: npm run build
Publish directory: dist/desoft-santiago-frontend/browser
```

Antes de desplegar:

```bash
cd frontend
npm run lint
npm run build
```

Si la carpeta de salida cambia, revisar el resultado generado dentro de `frontend/dist/`.

---

## 14. Buenas prácticas del proyecto

- Mantener la separación entre `core`, `features` y `shared`.
- Evitar lógica de negocio compleja dentro de templates.
- Usar servicios/stores para estado compartido.
- Mantener componentes de UI lo más simples posible.
- Validar formularios antes de ejecutar acciones.
- Confirmar acciones destructivas.
- No exponer datos sensibles en documentación ni código.
- Mantener assets y fuentes locales organizados en `public/`.
- Documentar decisiones importantes de arquitectura.

---

## 15. Próximas etapas

- Crear backend NestJS.
- Implementar autenticación real.
- Conectar frontend con API REST.
- Reemplazar persistencia local por base de datos.
- Implementar refresh tokens.
- Implementar invitaciones reales por correo.
- Implementar recuperación segura de contraseña.
- Agregar auditoría de cambios sensibles.
- Agregar pruebas unitarias e integración.
- Configurar despliegue continuo.

---

## 16. Estado del proyecto

El proyecto se encuentra en fase MVP frontend, con módulos principales funcionales y preparado para evolucionar hacia una solución full-stack.

---

## 17. Licencia

Proyecto desarrollado con fines académicos/profesionales. Definir la licencia final antes de publicar o distribuir en producción.
