# porra-casablanca

Webapp mobile-first para gestionar una porra del Mundial con login por credenciales, panel de admin, edición de resultados y clasificación automática a partir de las predicciones guardadas.

## Stack

- `Next.js 16`
- `React 19`
- `Prisma`
- `PostgreSQL`
- `NextAuth/Auth.js`
- `Tailwind CSS 4`

## Funcionalidades actuales

- Registro e inicio de sesión por usuario y contraseña
- Home con próximos partidos y estado del usuario
- Jornadas y detalle de partidos
- Guardado de porras por partido
- Clasificación calculada automáticamente desde las predicciones
- Panel de admin para:
  - jornadas
  - partidos
  - resultados
  - contraseña de usuarios
  - ajustes
- Gestión manual de resultados con recálculo de puntos
- Selección de retransmisión `DAZN` / `RTVE`

## Variables de entorno

Crea un `.env.local` a partir de `.env.example`:

```bash
cp .env.example .env.local
```

Variables mínimas:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="un-secreto-largo-y-aleatorio"
```

## Desarrollo local

Instalación:

```bash
npm install
```

Generar cliente Prisma:

```bash
npm run prisma:generate
```

Aplicar esquema a la base de datos:

```bash
npm run prisma:push
```

Opcional: cargar el torneo base en una base local o de staging:

```bash
SEED_ADMIN_EMAIL="..." SEED_ADMIN_USERNAME="..." SEED_ADMIN_PASSWORD="..." \
SEED_USER_EMAIL="..." SEED_USER_USERNAME="..." SEED_USER_PASSWORD="..." \
npm run prisma:seed
```

Arrancar en local:

```bash
npm run dev
```

## Scripts útiles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run prisma:generate
npm run prisma:push
npm run prisma:migrate
npm run prisma:seed
```

## Usuarios de seed

El seed recrea equipos, jornadas y partidos. No se ejecuta con `NODE_ENV=production`.
Si lo ejecutas, crea un administrador y un usuario normal con los emails, usuarios y contraseñas que definas en las variables `SEED_*`.

No hay credenciales de seed por defecto en el código.

## Despliegue

La app se puede desplegar en Vercel conectando el repositorio y configurando las variables `DATABASE_URL` y `AUTH_SECRET`.

La clasificación no se persiste como tabla separada: se reconstruye desde usuarios y predicciones. Cuando un admin guarda un resultado, la app recalcula automáticamente los puntos de las porras de ese partido.

## Preparación para producción

- Configura `DATABASE_URL` y `AUTH_SECRET` en el proveedor de despliegue.
- No ejecutes `npm run prisma:seed` contra producción; el seed elimina predicciones, partidos, jornadas y equipos antes de cargar el calendario base.
- Revisa que no queden usuarios de seed como `admin@porra.local` en la base productiva antes de abrir el acceso.
