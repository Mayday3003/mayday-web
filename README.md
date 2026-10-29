# Mayday Web

Frontend de **Mayday**: mis intereses, mis proyectos de investigación y un muro de recuerdos con las personas que amo. Es la migración a Next.js de la Entrega 1, conectada a la API REST de la Entrega 2.

| | |
|---|---|
| Frontend en producción | https://www.mayday3003.world |
| Repo del frontend | https://github.com/Mayday3003/mayday-web |
| API en producción | https://mayday-api-v9ls.onrender.com ([`/health`](https://mayday-api-v9ls.onrender.com/health)) |
| Repo de la API | https://github.com/Mayday3003/mayday-api |

> La API está en el plan gratuito de Render: después de 15 minutos sin uso se duerme y la primera petición tarda unos 50 segundos. Mientras tanto la página muestra "La API está despertando" con un botón para reintentar.

## Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| admin | `admin@mayday3003.world` | `AdminMayday2026*` |
| user | `evaluador@mayday3003.world` | `UserMayday2026*` |

También puedes crear una cuenta en `/registro` (siempre queda con rol `user`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS v4 · desplegado en Vercel con auto-deploy desde `main`.

## Correrlo localmente

```bash
git clone https://github.com/Mayday3003/mayday-web.git
cd mayday-web
npm install
cp .env.example .env.local   # y ajusta la URL de la API si corres el backend local
npm run dev                  # http://localhost:3000
```

Otros scripts: `npm run build` (build de producción) y `npm run lint`.

## Variables de entorno

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_API_HOST` | URL base de la API, sin `/` final. En producción: `https://mayday-api-v9ls.onrender.com`. Para desarrollo con el backend local: `http://localhost:4000` |

`.env.local` no se sube al repo; `.env.example` sí.

## Páginas

| Ruta | Acceso | Qué hace |
|---|---|---|
| `/` | público | Inicio: lo que amo, últimas fotos (desde la API) y canciones |
| `/proyectos` | público | Proyectos de investigación (contenido fijo de la Entrega 1) |
| `/muro` | público | Catálogo: búsqueda, filtros combinados (tipo, persona, fechas) y paginación en la URL (`?page=2&type=viaje…`) |
| `/muro/[id]` | público | Detalle del recuerdo con sus comentarios; comentar requiere sesión |
| `/muro/nuevo` | con sesión | Proponer un recuerdo (el formulario de la Entrega 1), con foto desde el dispositivo o por enlace |
| `/mis-recuerdos` | con sesión | Mis propuestas con su estado y mis comentarios |
| `/admin` | solo admin | CRUD de experiencias con subida de imagen y confirmación al eliminar, revisión de propuestas y todos los comentarios |
| `/login` · `/registro` | solo sin sesión | Formularios con errores debajo de cada campo |
| cualquier otra | — | 404 propia |

Cada pantalla que pide datos tiene sus tres estados: cargando, vacío y error (con reintentar).

## Estructura

```
app/                        # rutas (App Router); cada page.tsx solo arma la pantalla
proxy.ts                    # redirecciones en el servidor según la cookie (ver abajo)
src/features/
  common/                   # http.ts, session.ts, config.ts, componentes base, guards
  auth/                     # login, registro, useAuth
  experiencias/             # catálogo, detalle y admin de experiencias
  interacciones/            # comentarios
  propuestas/               # proponer recuerdos, mis recuerdos, revisión del admin
  proyectos/ · musica/      # contenido fijo de la Entrega 1
```

Cada feature separa `domain/` (tipos), `services/` (llamadas a la API), `hooks/` y `components/`. El único `fetch` del proyecto está en `src/features/common/http.ts`.

## Protección de rutas

Hay dos capas, y ninguna de las dos es la seguridad real:

1. **`proxy.ts` (servidor):** lee la cookie `mayday_token` y redirige antes de pintar la página (`/admin` sin rol admin → `/`; rutas privadas sin sesión → `/login?next=…`; `/login` y `/registro` con sesión → `/`). Lee el rol del payload del JWT **sin verificar la firma**, porque el secreto solo existe en la API.
2. **Guards en el cliente** (`PrivateRoute`, `AdminRoute`, `GuestRoute`): hacen lo mismo cuando se navega dentro de la app, y no muestran el contenido hasta saber si hay sesión.

La seguridad real está en la API: cualquier petición sin token responde **401** y con un rol sin permiso responde **403**, aunque alguien se salte el frontend.

## Captura de Network

Petición protegida `GET /api/propuestas/mias` con el header `Authorization: Bearer …` (token tapado):

![Petición con el header Authorization](docs/network.png)

## Decisiones técnicas


### Flujo del login

Cuando se escribe el correo y la contraseña, `LoginForm` llama a `useAuth.login`, que a su vez usa `authService` para hacer la petición a la API a través de `http.ts`. Si las credenciales son correctas, la API responde con `{ token, user }`. Entonces `saveSession` guarda el token en una cookie y el usuario en la sesión del cliente. La navbar está suscrita a esa sesión con `useSyncExternalStore`, así que se actualiza sola y muestra el saludo sin recargar la página.

### Dónde se guarda el token

El token se guarda en la cookie `mayday_token`. No es `httpOnly` porque el código del cliente necesita leerla para armar el header `Authorization`. Además, `proxy.ts` también la lee en el servidor para decidir si deja entrar a las rutas privadas o redirige al login.

### Riesgo y mitigación

El riesgo principal es un ataque XSS: si alguien lograra ejecutar JavaScript en la página, podría leer la cookie. Para reducirlo, React escapa el HTML que se muestra y en el proyecto no se usa `dangerouslySetInnerHTML`. La cookie además tiene `SameSite=Lax`, se marca `Secure` cuando el sitio va por https y expira en un día, así que un token robado deja de servir pronto.

### Cómo sabe cada petición quién soy

`http.ts` agrega automáticamente el header `Authorization: Bearer <token>` a cada petición. La API verifica ese JWT y saca de él la identidad del usuario. En la captura de Network de arriba se ve el header en la petición `GET /api/propuestas/mias`.

### 401 vs 403

- **401**: el token no es válido o ya expiró. Si había token, la app cierra la sesión y redirige a `/login?expirado=1` para que el usuario vuelva a entrar.
- **403**: la API sabe quién soy, pero no tengo permiso para esa acción. La app no cierra la sesión; solo muestra el mensaje de error.

### Ocultar un botón no es proteger una ruta

Esconder un botón o redirigir con `proxy.ts` y los guards solo mejora la experiencia de usuario. Cualquiera podría llamar a la API directamente con herramientas como curl o Postman. La protección real está en el backend, que valida el token y los permisos en cada petición.

### Por qué el formulario ya no pide "correo de contacto"

El autor de una propuesta ahora sale del token, no de un campo que llena el usuario. Así nadie puede publicar a nombre de otra persona escribiendo un correo ajeno.

### Uso de IA

Se usó claude code en una parte considerable del proyecto, siempre revisando, aprobando y corrigiendo para que cumpliera con las decisiones técnicas que se pedían en la entrega y en cómo quería que quedara la app.

Por ejemplo, después de que claude terminaba cualquier tarea, revisé y comprobé que si funcionara bien, de hecho en algunos momentos tuve que corregir varios problemas de seguridad que dejaba expuestos, por lo que aunque fue muy útil, también se realizó parte de trabajo manual para evitar vulnerabilidades.