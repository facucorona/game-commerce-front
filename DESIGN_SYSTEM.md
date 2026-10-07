# Sistema de diseño — GamE-Commerc (ARCADE)

**Dirección visual: sala de recreativas / sintetizador.** Referencia: la maqueta **"E · Arcade"** dibujada en pen.dev (frames 1280×900: marquesina de bombillos, tres cabinas en modo atracción, panel de ranura con juego al azar y ranking).

Todo el front está construido con **primitivas propias + Tailwind 3 compilado por CLI**. Bootstrap (CSS + JS + Popper) fue **removido**: sus utilidades (`.btn`, `.card`, `.rounded`, `.shadow`) chocaban con las nuestras. Solo queda **bootstrap-icons** (`<i className="bi bi-xxx" />`).

> **Leé esto antes de tocar cualquier pantalla.** Si algo no está acá, primero preguntá.

---

## 1. Tokens de color

Definidos como variables HSL en `src/index.css` y mapeados a clases en `tailwind.config.js`. Los nombres **no** son genéricos a propósito: cada uno describe su rol dentro de la metáfora, para que al leer una pantalla se entienda la intención sin abrir el CSS.

| Token | Clases | Color | Qué representa |
|---|---|---|---|
| `void` | `bg-void` | `#0A0614` | La sala a oscuras. Fondo general. |
| `cab` | `bg-cab` | `#130A28` | La máquina: tarjetas, paneles, cajas. |
| `panel` | `bg-panel` | `#1E1140` | Un paso más claro: inputs, filas, hovers. |
| `line` | `border-line` | `#3A2470` | El bisel violeta que separa las piezas. |
| `magenta` | `bg-magenta` `text-magenta` | `#FF2E93` | El neón de la marquesina. CTA principal. |
| `neon` | `text-neon` `border-neon` | `#00F0FF` | La pantalla encendida. Enlaces, íconos activos, foco. |
| `bulb` | `text-bulb` `bg-bulb` | `#FFD400` | Las bombillas del marco. Acentos y alertas. |
| `credit` | `text-credit` `bg-credit` | `#B6FF3C` | Créditos. **SE USA SOLO PARA PRECIOS.** |
| `ink` | `text-ink` | `#F2EEFF` | Texto principal. |
| `dim` | `text-dim` | `#9A8EC8` | Texto secundario. |
| `destructive` | `text-destructive` | rojo | Errores y acciones destructivas. |

⚠️ Todos aceptan opacidad (`bg-cab/80`, `border-line/60`) porque el config usa `<alpha-value>`.
⚠️ **`credit` es exclusivo de precios.** Si aparece en un título o un botón, está mal: el color significa "créditos gastables".

### La "cama" de la sala (fija, siempre presente)

Declarada en `index.css` con pseudo-elementos del `body`, así que **ninguna pantalla tiene que pedirla**:

- `body::before` → rejilla violeta de 42px + viñeta (centro iluminado, bordes oscuros).
- `body::after` → **scanlines** (líneas horizontales cada 4px).

> El fondo real está en `<html>` y el `<body>` queda **transparente a propósito**: si el body tuviera color propio, taparía estos overlays.

---

## 2. Tipografía

| Rol | Clase | Fuente | Uso |
|---|---|---|---|
| Rótulo de cabina | `font-display` | **Anton** | `h1`/`h2`/`h3`, logo, cifras grandes. Always `uppercase`. |
| Etiqueta de máquina | `font-pixel` (o `gc-pixel`) | **Press Start 2P** | Precios, botones, "INSERT COIN", estados, navegación. |
| Texto corrido | `font-body` (default) | **Space Grotesk** | Párrafos, formularios, descripciones. |

- Los titulares ya salen en Anton por el `@layer base` de `index.css`.
- `gc-pixel` = `font-pixel` + `line-height` y `letter-spacing` corretos para texto chico (`text-[9px]` a `text-xs`).

---

## 3. Utilidades arcade

Definidas **fuera de `@layer`** en `src/index.css` (a propósito: Tailwind depura del layer `components` las reglas cuyo selector todavía no aparece en el código).

| Clase | Qué hace |
|---|---|
| `gc-bulbs` | Fila de bombillas (fondo repetido del marquee). |
| `gc-attract` | Degradado diagonal magenta→violeta→negro: la placa chica de cada cabina. |
| `gc-coin` | Botón de créditos ("INSERT COIN"): degradado #FF2E93→#7B2FFF, radio 8px, alto 44px, glow 24px. Va como clase y no con utilidades porque `#7B2FFF` no es token y con `from-magenta` solo el degradado se cae a transparente. |
| `gc-pixel` | Texto con la fuente bitmap. |
| `gc-glow-magenta` / `gc-glow-cyan` / `gc-glow-bulb` | El halo de neón (bordes y botones, no texto). |
| `gc-blink` | Parpadeo tipo LED. |
| `gc-drop-in` | Aparición con desplazamiento. |
| `gc-grid` / `gc-scanlines` / `gc-vignette` | Cama de la sala, por si hay que replicarla en un bloque. |

Para glow en texto se usa text-shadow arbitrario: `[text-shadow:0_0_18px_rgba(255,46,147,0.6)]`.

---

## 4. Recetas (patrones del proyecto)

**Contenedor de página**
```jsx
<div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
```

**Cabina (tarjeta de juego)** — el patrón más repetido del proyecto

La pantalla grande es **la portada del juego** (`object-cover`, 196px). El
degradado `gc-attract` quedó como **placa de 56×56 junto al nombre**, con las
iniciales del juego y el contador de valor. El rótulo "Attract mode" ya no se
usa: a 56px sería ilegible y el degradado solo ya lo identifica.

```jsx
<article className="group flex flex-col overflow-hidden rounded-xl border-2 border-line bg-cab transition hover:-translate-y-1 hover:border-neon">
  {/* 1 · pantalla: la portada */}
  <Link to={`/detail/${id}`} className="block no-underline">
    <div className="relative h-[196px] w-full overflow-hidden rounded-[10px] border border-line shadow-[0_0_34px_rgba(255,46,147,0.33)]">
      <img src={img} alt={name} className="h-full w-full object-cover" />
    </div>
  </Link>
  <div className="flex flex-1 flex-col gap-2 p-4">
    {/* 2 · placa attract + nombre + estrellas */}
    <div className="flex items-center gap-3">
      <div className="gc-attract relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border-2 border-line">
        <span className="font-display text-2xl leading-none text-void/55">{iniciales}</span>
        <span className="gc-pixel absolute bottom-1 right-1 rounded bg-bulb px-1 py-0.5 text-[7px] leading-none text-void">{rating}/6</span>
      </div>
      <h3 className="font-display text-lg leading-tight text-ink">{name}</h3>
    </div>
    <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
      <span className="gc-pixel text-xs text-credit">ARS$ {price}</span>
      <button className="gc-coin gc-pixel text-[12px] uppercase">Insert coin</button>
    </div>
  </div>
</article>
```

**Botones**

| Variante | Clases |
|---|---|
| Primario (CTA) | `gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110` |
| Secundario | `gc-pixel rounded-md border border-neon/70 px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10` |
| Destructivo | `gc-pixel rounded-md bg-destructive px-5 py-3 text-[10px] uppercase text-white` |

**Inputs**
```jsx
<label htmlFor="x" className="gc-pixel text-[9px] uppercase text-dim">Usuario</label>
<input id="x" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" />
```

**Tabla de récords** (órdenes, usuarios, ventas)
```jsx
<div className="overflow-hidden rounded-xl border-2 border-line">
  <div className="gc-pixel bg-panel px-4 py-3 text-[9px] uppercase text-dim">{columna}</div>
  <div className="flex items-center gap-4 border-b border-line px-4 py-3 text-sm text-ink hover:bg-panel">{celda}</div>
</div>
```

**Métrica / contador**
```jsx
<div className="rounded-xl border-2 border-line bg-cab p-5">
  <p className="gc-pixel text-[9px] uppercase text-dim">Ventas</p>
  <p className="font-display text-4xl text-credit">12.480</p>
</div>
```

**Encabezado de sección**
```jsx
<p className="gc-pixel text-[10px] uppercase text-magenta">Catálogo</p>
<h1 className="font-display text-4xl uppercase tracking-wide text-ink">HOME</h1>
```

**Marquesina** (cabecera con bombillas)
```jsx
<div className="gc-bulbs pointer-events-none h-2 w-full opacity-80" aria-hidden="true" />
<nav className="sticky top-0 z-40 border-b-2 border-line bg-cab/95 backdrop-blur"> ... </nav>
```

**Pantalla de arranque** (formularios de auth): panel centrado `max-w-[460px]`, rótulo `INSERT COIN` y submit con el texto `INSERT COIN`.

**GAME OVER** (404, errores): `font-display` gigante con glow magenta + código pixel en `bulb`.

**Paginación = selector de créditos**: `◀ 1/2/3 ▶` en pixel, activa con `bg-magenta`.

---

## 5. Reglas duras

1. **`className=` siempre, nunca `class=`.** El proyecto original tenía 564 atributos `class=` que React ignora por completo: si ves algo sin estilo, es por eso.
2. **Cero dependencias nuevas.** El toolchain es CRA4/webpack4: Radix, cva y librerías ESM no compilan.
3. **La lógica es intocable**: handlers, `dispatch(...)` de redux, `Swal.fire`, llamadas axios, rutas/`Link`, y los `name=`/`value=` de los botones (**los handlers leen `e.target.name` / `e.target.value`**). Solo markup y clases.
4. **Nada de sizes inline** para lo visual. Inline solo para valores genuinamente dinámicos (`backgroundImage` con `url()`, ancho de barras de progreso).
5. **Iconos**: `<i className="bi bi-xxx" aria-hidden="true" />`. **Nunca emojis.**
6. **Imágenes**: siempre `h-full w-full object-cover`.
7. **Espaciado**: `p-4` / `p-5` / `p-6` / `gap-3` / `gap-5`. Nada de valores sueltos.
8. **`border-style: solid` es parte del mini-preflight.** Con el preflight de Tailwind apagado (`corePlugins.preflight: false`), si se saca esa línea **todos** los bordes de la app calculan `0px` y desaparecen.
9. **CSS viejo**: cuando retestes un componente y ya no use sus clases, borrá también el `import './x.css'` o `import styles from './x.module.css'`. Los archivos `.css` se borran todos al final del proyecto.
10. **Carruceles**: estado de React (`useState` + `translateX` sobre un track con `overflow-hidden`). El JS de Bootstrap fue removido, así que los `data-bs-*` ya no hacen nada. Convención: botones `aria-label="Previous"/"Next"`, dots `aria-label="Slide N"` (activo `bg-magenta`).
11. **SweetAlert2**: los botones del modal se estilizan con `customClass` (son strings dentro del código, y Tailwind los detecta igual):
```js
const arcadeButtons = Swal.mixin({
  customClass: {
    confirmButton: 'gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta',
    cancelButton:  'gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon',
  },
  buttonsStyling: false,
});
```
⚠️ Los `class=` rotos del proyecto original incluían varios `customClass: { confirmButton: 'btn btn-success' }`. Ya no existen esas clases: **nunca vuelvas a poner `btn btn-*`** en un `customClass`.

---

## 6. Toolchain

| Qué | Cómo |
|---|---|
| CSS | `npm run build-css` (una vez) · `npm run watch-css` (al developing) |
| Por qué CLI | CRA4 ignora `postcss.config.js`, así que Tailwind no compila solo |
| Tailwind | v3, tokens en `tailwind.config.js`, CSS fuente en `src/index.css` |
| Arranque | Front: `$env:NODE_OPTIONS="--openssl-legacy-provider"; npm start` · API: `node index.js` |

⚠️ **Después de editar cualquier clase nueva hay que correr `build-css`**: si no, la clase no existe en `public/styles.css`.

---

## 7. Mapa de pantallas → patrón

| Pantalla | Patrón arcade |
|---|---|
| `/` Landing | Rótulo gigante con glow + `1 CRÉDITO = 1 JUEGO` |
| `/home` Catálogo | Grilla de cabinas + marquesinas horizontales |
| `/detail/:id` | Cabina principal + galería + tabla de récords (reviews) |
| `/shopping_cart` | Contador de créditos + `RandomHelper` = **ranura de monedas** |
| `/login`, `/create_user`, `/restore`, `/changepass` | Pantalla de arranque (`INSERT COIN`) |
| `/my_store`, `/userprofile`, `/wish_list` | Biblioteca como filas de máquina |
| `/admin/*` | Panel con tabs + métricas + tablas |
| 404 / errores | `GAME OVER` |

---

## 8. Fixes de lógica (no son estilo, no los reviertas)

**Backend (`e-commerce_API-main`):**
- `src/app.js`: el guard JWT era global (`server.use(passport.authenticate(KEY_SECRET))`) y mataba también el **preflight CORS (OPTIONS)**. Con eso, sin sesión, `GET /videogames/` devolvía **401 y la tienda se veía vacía**. Ahora hay `PUBLIC_ROUTES` (`/videogames`, `/reviews`, `/user/find`) y bypass de `OPTIONS`.
- `src/controllers/loginUser.js`: el catch de la estrategia JWT decía `done(error)` y `error` no existe en ese scope → `ReferenceError` y la petición moría sin responder. Ahora `done(e)`.
- El JWT se lee **solo de la query**: `?tkn=<token>` (ver `ExtractJWT.fromUrlQueryParameter('tkn')`).

**Cliente:**
- `src/index.js` tiene un **interceptor de axios** que agrega `?tkn=<token>` a toda petición que no lo traiga. Sin él, el backend (que solo lee el JWT de la query) respondía **401** en llamadas que el código original pasaba sin token: `/order/user/:id` (biblioteca y órdenes) y `/payment` (checkout).
- **La ficha de producto (`/detail/:id`) no hace fetch propio**: lee el juego del redux que carga `/home`. Si abrís la URL directo en una pestaña nueva (o con F5), se queda en "CARGANDO..." para siempre. Es el comportamiento del proyecto original: **siempre entrá al detalle desde el catálogo**.
- `/payment` responde **503** si el `.env` del API no tiene `ACCESS_TOKEN` de MercadoPago (el checkout queda desactivado en vez de tirar el server).
- El login con Google (`/auth/google`) queda **desactivado** si el `.env` no tiene `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET`.
