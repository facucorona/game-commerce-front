---
name: GamE-Commerc
description: Sala de recreativas oscura para descubrir y comprar videojuegos.
colors:
  void: "#0A0614"
  cab: "#130A28"
  panel: "#1E1140"
  line: "#3A2470"
  magenta: "#FF2E93"
  neon: "#00F0FF"
  bulb: "#FFD400"
  credit: "#B6FF3C"
  ink: "#F2EEFF"
  dim: "#9A8EC8"
  destructive: "#FF4D5E"
  coin-deep: "#7B2FFF"
typography:
  display:
    fontFamily: "Anton, Arial Black, sans-serif"
    fontSize: "clamp(2.5rem, 9vw, 7.5rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Anton, Arial Black, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
  title:
    fontFamily: "Anton, Arial Black, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "0.01em"
  body:
    fontFamily: "Space Grotesk, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Press Start 2P', monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.02em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "12px"
  sm: "16px"
  md: "20px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.magenta}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-primary-hover:
    backgroundColor: "{colors.magenta}"
    textColor: "#FFFFFF"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.neon}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 20px"
  button-coin:
    backgroundColor: "{colors.magenta}"
    textColor: "#FFFFFF"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "44px"
    padding: "12px 20px"
  input-field:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "12px 16px"
  card-cabinet:
    backgroundColor: "{colors.cab}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

# Design System: GamE-Commerc

## Overview

**Creative North Star: "La Sala Encendida"**

La tienda es una sala de recreativas a oscuras vista de noche: fondo violeta casi negro, rejilla de 42px, viñeta y scanlines CRT siempre encendidos, marquesina de bombillas arriba y cabinas en fila. Todo emite luz en puntos contados — rótulo magenta, pantalla cian, bombilla ámbar, precio lima — sobre superficies planas violetas. La compra se narra como echar una moneda: `INSERT COIN`, `1 CRÉDITO = 1 JUEGO`, `GAME OVER` en errores, `PLAYER 1 CLEAR` en éxito.

Es un sistema nocturno y eléctrico antes que minimalista: tipografía de cabina condensada y gigante (Anton en mayúsculas), etiquetas bitmap (Press Start 2P a 9–12px) y botones de 44px con glow que se sienten como hardware que responde con luz. La densidad comercial se preserva — grilla de catálogo, tablas de récords en admin, formularios de arranque centrados — sin diluir la metáfora. El neón es abundante y ruidoso: marquesina, focos, hovers, títulos y estados activos emiten luz; el violeta plano queda solo para superficies de descanso.

**Key Characteristics:**
- Sala oscura permanente: rejilla + viñeta + scanlines detrás de todo el contenido.
- Rótulo de cabina gigante en mayúsculas + etiqueta pixel pequeña como segunda voz.
- CTA moneda con degradado magenta→violeta, 44px de alto y halo; precio siempre en lima.
- Superficies planas void→cab→panel separadas por bisel violeta de 2px; el brillo responde a la interacción.
- Iconos bootstrap-icons únicamente; nunca emojis.

## Colors

Sala violeta casi negra con cuatro neones funcionales escasos sobre texto marfil/apagado.

### Primary
- **Neón Rosa** (#FF2E93): CTA principal, marquesina activa, paginación activa, foco de marca. Fondo de botón primario con texto blanco, glow magenta.
- **Coin Deep** (#7B2FFF): Segundo extremo del degradado moneda/attract. Solo aparece dentro de degradados, nunca como superficie plana.

### Secondary
- **Neón Cian** (#00F0FF): Enlaces, iconos activos, borde de foco, hover de tarjeta y títulos secundarios. Tratamiento de foco estándar en inputs.

### Tertiary
- **Bulb Amber** (#FFD400): Bombillas del marquee, alertas, códigos pixel en pantallas GAME OVER, pastilla de rating sobre la placa attract.
- **Price Lime** (#B6FF3C): Precios y contadores de créditos. Exclusivo de valores gastables.

### Neutral
- **Room Void** (#0A0614): Fondo general de la sala (elemento html).
- **Cabinet** (#130A28): Máquina: tarjetas, paneles, nav, cajas.
- **Panel Step** (#1E1140): Un paso más claro: inputs, filas, hovers, cabeceras de tabla.
- **Bevel Violet** (#3A2470): Bisel que separa piezas; color de borde por defecto.
- **Cabinet Ink** (#F2EEFF): Texto principal.
- **Machine Dim** (#9A8EC8): Texto secundario y etiquetas apagadas.
- **Game Over Red** (#FF4D5E): Errores y acciones destructivas.

### Named Rules
**The Credit-Only Rule.** El lima crédito se usa solo para precios y contadores gastables. Si aparece en un título o botón, está mal.
**The Loud Neon Rule.** El neón no se raciona: marquesina, títulos, focos, hovers y activos emiten luz siempre. El violeta plano es solo superficie de descanso.

## Typography

**Display Font:** Anton (with Arial Black, sans-serif fallback)
**Body Font:** Space Grotesk (with system-ui, sans-serif fallback)
**Label/Mono Font:** Press Start 2P (with monospace fallback)

**Character:** Rótulo condensado y enorme para presencia de cabina, emparejado con etiqueta bitmap mínima para máquina y texto geométrico neutro para lectura corrida. Siempre mayúsculas en display y pixel.

### Hierarchy
- **Display** (400, clamp(2.5rem, 9vw, 7.5rem), 0.9): Hero de landing, GAME OVER de 404 (text-6xl a md:text-8xl con glow magenta), PLAYER 1 CLEAR de éxito. Tracking amplio (4px en landing) y uppercase.
- **Headline** (400, 2.25rem / text-4xl, 1): Títulos de sección (HOME, MY STORE, LOGIN, Operator Panel). Clase `font-display uppercase tracking-wide text-ink`.
- **Title** (400, 1.25rem / text-xl, 1.1): Nombre del juego en tarjeta, subtítulos de detalle. Placa attract de 56×56 con iniciales en display 1.5rem sobre degradado.
- **Body** (400, 0.875rem / text-sm, 1.6): Párrafos, descripciones, celdas de tabla, formularios. Longitud de línea contenida en paneles de 460px (auth) y tarjetas.
- **Label** (400, 10px pixel, 1.5, 0.02em, uppercase): Precios (`gc-pixel text-xs text-credit`), botones (`text-[10px]`), kicker de sección (`text-magenta`), cabeceras de tabla (`text-[9px] text-dim`), paginación. Variante `gc-pixel` corrige leading y tracking para texto chico (9px a xs).

### Named Rules
**The Two-Voice Rule.** Solo Anton para presencia y Press Start 2P para máquina; Space Grotesk para todo lo legible. Nunca pixel para párrafos ni body para rótulos.
**The Uppercase Machine Rule.** Display y pixel siempre en mayúsculas; el precio pixel siempre con prefijo ARS$ o $.

## Layout

Modelo de sala centrada: contenedor de página `mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8` en todas las rutas. Catálogo como grilla de cabinas (portada 196px + placa + nombre + barra de precio/coin); detalle como cabina principal + galería + tabla de récords; admin como panel con tabs + métricas + tablas; auth como pantalla de arranque centrada `max-w-[460px]`.

Densidad compacta de máquina: rellenos de superficie `p-4` / `p-5` / `p-6` (16/20/24px), separaciones `gap-3` / `gap-5` (12/20px), sin valores sueltos. Ritmo vertical de sección: kicker pixel + headline display + grilla/tabla. Responsive por compresión: la grilla colapsa a una columna, el contenedor pasa de `px-8` a `px-4`, el display escala por clamp; no hay sidebar fija que refluir. La cama de la sala (rejilla 42px + viñeta + scanlines en `body::before/::after`) es fija y no pertenece a ninguna pantalla.

## Elevation & Depth

Sistema híbrido con base tonal y respuesta luminosa: en reposo la profundidad la da la escalera void→cab→panel más viñeta y rejilla; al interactuar se suma halo de neón y elevación mínima (`hover:-translate-y-1` en tarjeta, `brightness-110/112` en botones). No hay sombras materiales difusas; el glow es la sombra.

### Shadow Vocabulary
- **Magenta button glow** (`box-shadow: 0 0 22px rgba(255,46,147,0.45)`): Botón primario y paginación activa en reposo.
- **Cyan edge glow** (`box-shadow: 0 0 22px rgba(0,240,255,0.4)`): Bordes y botones secundarios con foco cian.
- **Bulb halo** (`box-shadow: 0 0 18px rgba(255,212,0,0.55)`): Bombillas y acentos ámbar; hover intensifica a `0 0 26px + 0 0 44px`.
- **Coin press glow** (`box-shadow: 0 0 24px rgba(255,46,147,0.4)`): Botón moneda con degradado; hover `brightness(1.12)`, disabled `grayscale + brightness(0.75)`.
- **Cabinet screen glow** (`box-shadow: 0 0 34px rgba(255,46,147,0.33)`): Marco de portada 196px dentro de la tarjeta.
- **Input focus ring** (`box-shadow: 0 0 16px rgba(0,240,255,0.35)`): Input con `focus:border-neon`.
- **Marquee text glow** (`text-shadow: 0 0 18px rgba(255,46,147,0.6)` y par cian): Título GAM/E-COMMERCE; hover de grupo intensifica a `0 0 30px + 0 0 50px`. GAME OVER usa `0 0 28px rgba(255,46,147,0.75)`.

### Named Rules
**The Flat-By-Default Rule.** Las superficies son planas en reposo. El halo aparece solo como respuesta a estado (hover, foco, activo).
**The No-Size-Change Rule.** Bombillas y títulos solo intensifican halo al hover; nunca cambian de tamaño.

## Shapes

Lenguaje de bisel de máquina: bordes de 2px sólidos en violeta (`border-2 border-line`) sobre radios contenidos. Tarjetas y paneles en radio grande (12px, `rounded-xl`); imagen interior y placa attract en radio medio (10px, `rounded-[10px]`); botones y moneda en radio chico (8–10px, `rounded-md` y `gc-coin 8px`); bombillas y botón favorito en círculo total (9999px). Recorte de imagen siempre `overflow-hidden` con `object-cover` a pleno (`h-full w-full object-cover`). Sin píldoras genéricas: la única forma circular es luz (bombilla) o acción binaria (favorito). El mini-preflight exige `border-style: solid`; sin él todos los bordes calculan 0px.

## Components

### Buttons
- **Character:** Tecla eléctrica y ruidosa: se aprieta y responde con luz y brillo alto.
- **Shape:** Radio medio (10px) salvo moneda (8px); altura moneda 44px a ancho completo.
- **Primary:** Fondo magenta con texto blanco pixel 10px mayúsculas (`gc-pixel rounded-md bg-magenta px-5 py-3 uppercase text-white gc-glow-magenta`), padding 12px 20px (landing 16px 28px).
- **Hover / Focus:** `hover:brightness-110` (moneda 1.12); foco visible cian; disabled `cursor-not-allowed opacity-40` (moneda grayscale).
- **Secondary:** Borde cian sobre transparente con texto cian (`border border-neon/70 text-neon`), hover `bg-neon/10`.
- **Destructive:** Fondo rojo game-over con texto blanco pixel.
- **Coin:** Degradado `linear-gradient(0deg, #FF2E93 0%, #7B2FFF 100%)` con glow propio; texto `INSERT COIN` 12px. Va como clase porque el violeta profundo no es token.

### Cards / Cabinets
- **Character:** Cabina en modo atracción: pantalla grande arriba, placa pequeña abajo.
- **Corner Style:** Contenedor 12px, pantalla interior 10px.
- **Background:** Cabina sobre void; placa attract con degradado diagonal `linear-gradient(-118.389deg, #FF2E93 14.645%, #7B2FFF 57.071%, #0A0614 85.355%)` de 56×56 con iniciales y pastilla de rating ámbar.
- **Shadow Strategy:** Marco de pantalla con screen glow; tarjeta entera eleva `-translate-y-1` y cambia borde a cian al hover.
- **Border:** 2px bisel violeta, 1px en marco interior.
- **Internal Padding:** Cuerpo `p-4` con barra inferior `border-t border-line pt-3` para precio + moneda.

### Inputs / Fields
- **Style:** Panel con borde violeta y radio grande (`w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink`), etiqueta pixel 9px apagada encima.
- **Focus:** Borde cian + anillo `0 0 16px rgba(0,240,255,0.35)`, sin outline.
- **Error / Disabled:** Error en rojo game-over; disabled apagado sin glow.

### Navigation
- Barra pegada `sticky top-0 z-40 border-b-2 border-line bg-cab/95 backdrop-blur` con hilera de bombillas `gc-bulbs h-2` encima. Logo en display 2.25rem con glow por grupo (magenta/cian). Enlaces pixel 10px mayúsculas; activo con fondo magenta + glow. Carrito con icono moneda lima y contador lima. Móvil colapsa a fila compacta sin drawer propio.

### Tables (Record Boards)
- Contenedor `overflow-hidden rounded-xl border-2 border-line`; cabecera pixel 9px apagada sobre panel; filas `border-b border-line px-4 py-3 text-sm` con hover panel. Precio de celda en lima.

### Metrics
- Caja `rounded-xl border-2 border-line bg-cab p-5`; etiqueta pixel 9px apagada + cifra display 2.25rem en lima (o tinta según contexto).

### Marquee Bulbs (signature)
- Hilera recortada `overflow-hidden` de bombillas 16px circulares con halo 18px, color por variable `--bulb-color`, opacidad 0.85; hover intensifica halo y brillo sin cambiar tamaño. Parpadeo LED `gc-blink 1.6s step-end infinite` solo en rótulos de llamada.

### Pagination
- Selector de créditos: botones pixel 36×36 con borde 2px; activo en magenta con glow, inactivos en violeta apagado. Controles `Previous/Next` con aria-labels, dots con `Slide N`.

## Do's and Don'ts

### Do:
- **Do** usar `className=` siempre en JSX (React ignora `class=`); revisar `customClass` de SweetAlert2 con las mismas clases arcade.
- **Do** reservar el lima crédito exclusivamente para precios (`gc-pixel text-credit` con `ARS$`).
- **Do** correr `npm run build-css` tras agregar clases nuevas (Tailwind CLI compila `src/index.css` → `public/styles.css`).
- **Do** usar iconos `<i className="bi bi-xxx" aria-hidden="true" />` y nunca emojis.
- **Do** mantener imágenes en `h-full w-full object-cover` dentro de marcos con `overflow-hidden`.
- **Do** componer botones con las recetas exactas (primario magenta + glow, secundario borde cian, moneda `gc-coin`).

### Don't:
- **Don't** agregar dependencias nuevas (CRA4/webpack4 no compila ESM como Radix o cva).
- **Don't** tocar la lógica al retestar: handlers, `dispatch`, `Swal.fire`, axios, rutas/`Link`, `name=`/`value=` leídos por `e.target`.
- **Don't** usar estilos inline para lo visual; solo valores dinámicos (`backgroundImage url()`, anchos de progreso).
- **Don't** reintroducir clases Bootstrap (`.btn`, `.card`, `.rounded`, `.shadow`) ni `btn btn-*` en `customClass`; Bootstrap fue removido salvo bootstrap-icons.
- **Don't** poner color propio al `body` ni quitar `border-style: solid` del mini-preflight; ambos rompen la cama de la sala y todos los bordes.
- **Don't** inventar espaciados fuera de `p-4/p-5/p-6` y `gap-3/gap-5`.
