DESOFTSANTIAGO PLATFORM
========================

Plataforma MVP profesional/académica para la gestión de proyectos de software, tareas, usuarios, roles, permisos, desempeño y dashboard ejecutivo.

Este repositorio está organizado como monorepo simple:

desoft-santiago-platform/
  frontend/   Aplicación Angular moderna
  backend/    Backend NestJS previsto para la siguiente etapa

Actualmente el desarrollo funcional está concentrado en la carpeta frontend/.

------------------------------------------------------------
1. OBJETIVO DEL PROYECTO
------------------------------------------------------------

DesoftSantiago ProjectOps es una plataforma orientada a equipos de desarrollo de software. Su objetivo es centralizar en una misma aplicación:

- Gestión de proyectos.
- Gestión de tareas.
- Tablero Kanban.
- Gestión de usuarios/equipo.
- Roles y permisos.
- Evaluación básica de desempeño.
- Dashboard con métricas operativas.
- Flujo de autenticación preparado para integración con backend.

El proyecto está pensado como un MVP defendible en contexto académico y profesional, siguiendo buenas prácticas reales de arquitectura frontend.

------------------------------------------------------------
2. STACK TECNOLÓGICO ACTUAL
------------------------------------------------------------

Frontend:

- Angular 21.
- Angular Material.
- SCSS.
- Angular Signals.
- Arquitectura standalone.
- CASL para permisos frontend.
- SweetAlert2 para confirmaciones, alertas y mensajes humanizados.
- ESLint con angular-eslint.
- Prettier.
- Husky, commitlint y lint-staged preparados para control de calidad.
- Fuentes autoalojadas.
- Material Symbols autoalojado.
- Assets servidos desde public/.

Backend previsto:

- NestJS.
- TypeORM.
- PostgreSQL.
- JWT + refresh tokens.
- Multi-tenant con Organization.
- Módulos previstos: Auth, Users, Projects y Tasks.

------------------------------------------------------------
3. ESTRUCTURA GENERAL DEL FRONTEND
------------------------------------------------------------

frontend/src/app/
  core/
    auth/                 Estado de sesión, guards e interceptor.
    layout/               Shell principal, sidebar y topbar.
    models/               Modelos globales.
    notifications/        NotificationService con SweetAlert2.
    permissions/          CASL, AbilityService y permissionGuard.

  features/
    auth/                 Login y registro.
    dashboard/            Métricas principales.
    projects/             Listado, detalle y formulario de proyectos.
    tasks/                Tablero Kanban y formulario de tareas.
    users/                Gestión del equipo y usuarios.
    performance/          Evaluación básica de desempeño.
    roles-permissions/    Vista de matriz de roles y permisos.

  shared/
    ui/                   Componentes reutilizables de interfaz.

frontend/src/styles/
  _fonts.scss             Fuentes locales.
  _tokens.scss            Tokens visuales del sistema.
  _global.scss            Estilos base globales.
  _material-theme.scss    Ajustes para Angular Material.

frontend/public/
  fonts/                  Inter, Manrope y Material Symbols.
  images/                 Logo, fondos y recursos visuales.

------------------------------------------------------------
4. DISEÑO Y UX
------------------------------------------------------------

El diseño está inspirado en una propuesta generada con Stitch, adaptada de forma coherente a Angular Material y al sistema visual del proyecto.

Principios visuales aplicados:

- Estilo SaaS institucional.
- Paleta azul corporativa.
- Fondo tecnológico para autenticación.
- Login con glassmorphism refinado.
- Cards blancas y superficies suaves para el área interna.
- Sidebar y topbar responsivos.
- Iconografía local con Material Symbols.
- Fuentes locales Inter y Manrope.
- Mensajes humanizados con SweetAlert2.
- Confirmaciones antes de acciones sensibles.
- Formularios con validación y botones deshabilitados según estado.

------------------------------------------------------------
5. FUNCIONALIDADES IMPLEMENTADAS EN EL FRONTEND
------------------------------------------------------------

Autenticación demo:

- Login funcional.
- Registro funcional de usuarios demo.
- Contraseña demo: 123456.
- Login validado contra usuarios almacenados en memoria/localStorage.
- Diferenciación de permisos por rol.
- Cierre de sesión con confirmación.

Usuarios demo disponibles:

- admin@desoft.cu / 123456
- manager@desoft.cu / 123456
- member@desoft.cu / 123456
- backend@desoft.cu / 123456
- qa@desoft.cu / 123456

Proyectos:

- Listado de proyectos.
- Crear proyecto.
- Editar proyecto.
- Ver detalle.
- Filtrar y buscar.
- Validación de fechas.
- Botones según permisos.

Tareas:

- Tablero Kanban.
- Crear tarea.
- Editar tarea.
- Mover tarea entre estados.
- Eliminar tarea.
- Búsqueda.
- Validación de formularios.
- Acciones según permisos.

Equipo/Usuarios:

- Listado de miembros.
- Crear miembro.
- Editar miembro.
- Eliminar miembro.
- Enviar invitación simulada.
- Restablecer acceso simulado.
- Activar/desactivar usuario.
- Separación profesional entre:
  - Rol de acceso: ADMIN, MANAGER, MEMBER.
  - Rol funcional: PROJECT_MANAGER, DEVELOPER, QA, ANALYST, DESIGNER, ARCHITECT.

Roles y permisos:

- Vista de matriz de permisos.
- Protección de rutas con CASL.
- Sidebar filtrado por permisos.
- Acciones visibles u ocultas según rol.

Dashboard:

- Métricas principales.
- Actividad reciente.
- Resumen de proyectos y tareas.
- Acceso rápido a acciones según permisos.

------------------------------------------------------------
6. ROLES DEL SISTEMA
------------------------------------------------------------

ADMIN:

- Acceso total.
- Puede crear, editar y eliminar proyectos.
- Puede crear, editar y eliminar tareas.
- Puede gestionar usuarios.
- Puede ver roles y permisos.
- Puede ver desempeño.

MANAGER:

- Puede ver dashboard, proyectos, tareas, equipo, desempeño y roles/permisos.
- Puede gestionar proyectos.
- Puede gestionar tareas.
- No puede administrar usuarios.

MEMBER:

- Puede ver dashboard, proyectos, tareas y desempeño.
- Puede actualizar/mover tareas.
- No puede crear proyectos.
- No puede eliminar proyectos.
- No puede crear ni eliminar tareas.
- No ve Equipo.
- No ve Roles y permisos.

------------------------------------------------------------
7. COMANDOS DEL FRONTEND
------------------------------------------------------------

Todos estos comandos se ejecutan dentro de la carpeta frontend/.

Instalar dependencias:

  cd frontend
  npm install

Ejecutar en desarrollo:

  npm start

Compilar producción:

  npm run build

Ejecutar lint:

  npm run lint

Formatear código, si el script está configurado:

  npm run format

------------------------------------------------------------
8. FLUJO GIT RECOMENDADO
------------------------------------------------------------

El control de versiones está en la carpeta raíz:

desoft-santiago-platform/

No dentro de frontend/.

Estado actual reportado:

  On branch main
  No commits yet
  Untracked files:
    frontend/

Eso significa que Git ve el frontend como carpeta nueva pendiente de confirmar.

Primer commit recomendado:

  git status
  git add frontend .gitignore README.txt package.json package-lock.json commitlint.config.cjs .lintstagedrc.json .husky
  git commit -m "chore(repo): iniciar monorepo desoft santiago platform"

Si todavía no tienes remoto:

  git remote add origin https://github.com/TU_USUARIO/desoft-santiago-platform.git
  git branch -M main
  git push -u origin main

Si el remoto ya existe:

  git remote -v
  git push -u origin main

------------------------------------------------------------
9. CONVENCIONES DE COMMITS
------------------------------------------------------------

Se recomienda usar Conventional Commits:

Formato:

  tipo(alcance): descripcion corta

Ejemplos:

  feat(auth): implementar login demo con roles
  feat(projects): agregar gestion de proyectos
  feat(tasks): agregar tablero kanban
  feat(users): administrar usuarios y roles
  feat(permissions): integrar casl en rutas y acciones
  fix(auth): corregir visibilidad de password
  fix(forms): validar fechas y estados de botones
  style(login): ajustar glassmorphism del formulario
  chore(repo): configurar eslint husky y commitlint
  docs(readme): documentar arquitectura del proyecto

Tipos recomendados:

- feat: nueva funcionalidad.
- fix: corrección de error.
- docs: documentación.
- style: cambios visuales o de formato sin afectar lógica.
- refactor: mejora interna sin cambiar comportamiento.
- chore: configuración, dependencias o tareas del repo.
- test: pruebas.
- build: cambios de build o despliegue.
- ci: integración continua.

------------------------------------------------------------
10. CONFIGURACIÓN DE HOOKS EN MONOREPO
------------------------------------------------------------

Como el control de versiones está en la raíz, los hooks deben vivir en:

desoft-santiago-platform/.husky/

Los hooks deben ejecutar comandos entrando a frontend.

pre-commit recomendado:

  cd frontend
  npm run lint

commit-msg recomendado:

  npx --no -- commitlint --edit "$1"

Para monorepo simple, una opción práctica es tener en la raíz:

- package.json
- commitlint.config.cjs
- .lintstagedrc.json
- .husky/pre-commit
- .husky/commit-msg

Y mantener el frontend como aplicación dentro de frontend/.

------------------------------------------------------------
11. .GITIGNORE RECOMENDADO
------------------------------------------------------------

En la raíz del monorepo debe existir un .gitignore que ignore:

- node_modules/
- dist/
- .angular/
- .cache/
- coverage/
- .env
- .env.*
- logs
- archivos temporales del sistema operativo
- archivos temporales de editores

No se debe ignorar:

- frontend/src/
- frontend/public/
- frontend/angular.json
- frontend/package.json
- frontend/package-lock.json

------------------------------------------------------------
12. NETLIFY
------------------------------------------------------------

Para desplegar el frontend en Netlify desde GitHub:

Base directory:

  frontend

Build command:

  npm run build

Publish directory:

  dist/desoft-santiago-frontend/browser

Si Netlify detecta otra carpeta de salida, revisar el resultado de:

  npm run build

y confirmar dónde queda el index.html dentro de dist/.

Variables de entorno:

Actualmente no son obligatorias para la demo frontend. Cuando se conecte backend, se podrá agregar:

  API_URL=https://api.ejemplo.com

------------------------------------------------------------
13. DECISIONES TÉCNICAS IMPORTANTES
------------------------------------------------------------

- El frontend simula persistencia con localStorage para la demo.
- No se guardan contraseñas reales.
- La contraseña demo es 123456.
- En producción, las contraseñas se manejarán en backend con hash seguro.
- Los permisos se calculan en frontend con CASL según el rol del usuario.
- El backend futuro deberá emitir el rol real en el token o perfil del usuario.
- Las fuentes y los iconos están autoalojados para reducir dependencia externa.
- El diseño de login fue adaptado desde Stitch, pero integrado al sistema real con SCSS y Angular Material.

------------------------------------------------------------
14. SIGUIENTES PASOS
------------------------------------------------------------

1. Confirmar el frontend estable en GitHub.
2. Configurar hooks de calidad: Husky, commitlint y lint-staged.
3. Desplegar el frontend en Netlify.
4. Crear backend NestJS.
5. Conectar login real.
6. Reemplazar localStorage por API REST.
7. Implementar refresh tokens.
8. Implementar invitación y restablecimiento real de contraseña.
9. Agregar auditoría de cambios sensibles.
10. Agregar pruebas unitarias y de integración.

------------------------------------------------------------
15. DEFENSA ACADÉMICA
------------------------------------------------------------

Durante la presentación se puede explicar:

- Arquitectura por features.
- Separación core/shared/features.
- Uso de Signals para estado simple.
- Uso de CASL para permisos.
- Uso de SweetAlert2 para experiencia de usuario.
- Diseño SaaS institucional adaptado desde Stitch.
- Preparación para backend NestJS.
- Simulación segura de usuarios sin guardar contraseñas reales.
- Despliegue frontend en Netlify.
- Control de calidad con ESLint y convenciones de commits.

Fin del documento.
