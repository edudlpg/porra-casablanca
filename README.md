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

Opcional: cargar datos de ejemplo / torneo:

```bash
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
npm run prisma:backfill:broadcasts
```

## Usuarios de seed

Si ejecutas `npm run prisma:seed`, se crean estos usuarios:

- `admin` / `admin1234`
- `maria` / `usuario1234`

## Despliegue

La app se puede desplegar en Vercel conectando el repositorio y configurando las variables `DATABASE_URL` y `AUTH_SECRET`.

La clasificación no se persiste como tabla separada: se reconstruye desde usuarios y predicciones. Cuando un admin guarda un resultado, la app recalcula automáticamente los puntos de las porras de ese partido.

## Notas

- Esta versión sigue siendo iterativa y mantiene código de pruebas y decisiones temporales.
- No se ha hecho todavía la refactorización general ni la limpieza de flujos antiguos de demo.
