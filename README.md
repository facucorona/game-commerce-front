# GamE-Commerc · Front (ARCADE)

Tienda de videojuegos con estética de sala recreativa. React 17 + Redux + Tailwind 3 (compilado por CLI, sin preflight).

## Stack

| Qué | Versión / nota |
|---|---|
| React + react-router-dom | 17 / rutas v5 |
| Redux + redux-thunk | Estado global (`products`, `searchered`, carrito, usuario) |
| axios | Con interceptor que agrega `?tkn=` (ver `src/index.js`) |
| Tailwind CSS | v3 por CLI: `npm run build-css` → `public/styles.css`. Preflight apagado + mini-preflight propio |
| sweetalert2 | Modales con `customClass` arcade |
| bootstrap-icons | Solo iconos (`<i className="bi …" />`). Bootstrap CSS/JS fue removido |

## Arranque

```powershell
# API primero (puerto 3001), después el front (puerto 3000)
$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start
```

`NODE_OPTIONS` es obligatorio: CRA4 no compila con el OpenSSL de Node moderno.

## Variables de entorno (`.env`)

| Var | Ejemplo | Para qué |
|---|---|---|
| `REACT_APP_URL` | `http://localhost:3001/` | Base del API. El front la concatena en cada thunk (`${REACT_APP_URL}videogames`) |
| `REACT_APP_KEY_SALT` | — | Salt para hashes del lado cliente |

## Estructura

```
src/
  Components/   # Home, NavBar, SearchBar, Cards, Cart, Login, Admin, Chatbot…
  redux/        # actions.js (thunks), reducer.js, store
  images/       # flyers y assets locales
  index.js      # interceptor axios (agrega ?tkn= salvo en rutas públicas)
  index.css     # INPUT de Tailwind: tokens HSL + mini-preflight + clases gc-*
```

## Flujos clave

- **Búsqueda en vivo**: `SearchBar` (solo en el header) dispara `searchProduct` con debounce 350 ms. Llena `searchered`; input vacío = `clear()` = catálogo completo. Home muestra `searchered` si tiene elementos, si no `products`. 12 juegos por página.
- **Auth**: el JWT vive en `sessionStorage` (`token`). El interceptor lo manda como `?tkn=` en toda request no pública. Credenciales de prueba: `admin@admin.com / Admin123!`, `shopper@shopper.com / Shopper123!`.
- **Checkout**: si el API no tiene `ACCESS_TOKEN` de MercadoPago, `/payment` responde 503 (ver README del API).
- **Detalle (`/detail/:id`)**: no hace fetch propio, lee del redux cargado en `/home`. Entrar siempre desde el catálogo, no por URL directa ni F5.

## Sistema visual

La dirección arcade está documentada en `./DESIGN_SYSTEM.md` (tokens, recetas, reglas duras) y `./DESIGN.md` (spec de diseño). Contexto de producto: `./PRODUCT.md`. Reglas que no se negocian: `className=` siempre, cero dependencias nuevas (CRA4 no compila ESM), lógica intocable (solo markup/clases), iconos `bi`, nada de emojis, y `npm run build-css` tras agregar clases nuevas.

## Scripts

| Comando | Qué hace |
|---|---|
| `npm start` | Dev en puerto 3000 |
| `npm run build-css` | Compila `src/index.css` → `public/styles.css` (una vez) |
| `npm run watch-css` | Recompila al guardar |
| `npm test` / `npm run build` | Estándar CRA |

## Deploy (Vercel)

Dos cosas obligatorias, ambas por el toolchain CRA4/webpack4:

1. **Variable de entorno `NODE_OPTIONS=--openssl-legacy-provider`.** Sin ella, webpack4
   usa un hash de OpenSSL que Node 17+ ya no soporta y el build muere con
   `ERR_OSSL_EVP_UNSUPPORTED`.
2. **El build necesita `public/styles.css` compilado.** `styles.css` está
   versionado (Tailwind corre por CLI, no por CRA), así que el build de Vercel lo
   toma como está. Si tocás clases, corré `npm run build-css` y commiteá el
   resultado.

Además `REACT_APP_URL` debe apuntar al backend desplegado (con la barra final,
los thunks concatenan `${REACT_APP_URL}videogames`).

### Trampas de dependencias (resueltas, no las toques sin leer)

- **`.npmrc` con `legacy-peer-deps=true`**: `react-reveal@1.2.2` declara peers de
  React 15/16 y nunca publicó versión para 17. npm 7+ corta el install por eso.
- **`overrides.babel-preset-react-app = 10.0.0` en `package.json`**:
  `react-scripts@4.0.3` pinea `@babel/core` en `7.12.3` exacto, pero su
  `babel-preset-react-app@^10.0.0` resolvería a `10.1.0`, que exige `^7.16.0`.
  El build falla con `[BABEL] Requires Babel "^7.16.0", but was loaded with "7.12.3"`.
  Fijando `10.0.0` (que pide `7.12.3` exacto) el árbol queda consistente.

Los dos van comentados en `.npmrc`. Si `npm run build` vuelve a romper, empezá por ahí.
