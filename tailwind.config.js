/** @type {import('tailwindcss').Config} */
/*
 * ============================================================================
 * TOKENS DE LA DIRECCIÓN "ARCADE" (sala de recreativas / sintetizador)
 * ----------------------------------------------------------------------------
 * Los colores NO usan nombres genéricos (primary/secondary/muted) a propósito:
 * cada nombre describe el ROL dentro de la metáfora de la recreativa, para que
 * al leer una pantalla se entienda la intención sin abrir el CSS.
 *
 *   void     → la sala a oscuras (fondo general)
 *   cab      → la máquina (tarjetas, paneles, cajas)
 *   panel    → la máquina un paso más clara (inputs, filas, hovers)
 *   line     → el bisel violeta que separa las piezas
 *   magenta  → el neón de la marquesina (CTA principal, precio destacado)
 *   neon     → el cian de la pantalla (enlaces, íconos activos, foco)
 *   bulb     → las bombillas del marco (acentos decorativos, alerts)
 *   credit   → el verde de "CRÉDITOS" (SE USA SOLO PARA PRECIOS)
 *   ink/dim  → texto principal y texto secundario
 *
 * Referencia visual: la maqueta "E · Arcade" dibujada en pen.dev.
 * Documento con las recetas: DESIGN_SYSTEM.md
 * ============================================================================
 */
module.exports = {
  // Preflight apagado: el reset lo aporta el mini-preflight de src/index.css.
  // Motivo: el preflight de Tailwind pisa estilos que aquí queremos conservar
  // (bordes, botones y medidas propias del juego).
  corePlugins: { preflight: false },
  content: [
    "./src/**/*.{js,jsx}",
    // (ya no se escanea node_modules: tw-elements fue eliminado del proyecto)
  ],
  safelist: [
    // Clases que se usan solo vía composición dinámica o se purgan por no
    // aparecer literalmente en el JSX (ej. `list-none` en <ul> de Pagination).
    'list-none',
  ],
  theme: {
    extend: {
      // <alpha-value> habilita las clases con opacidad: bg-cab/70, text-dim/60…
      colors: {
        void: "hsl(var(--void) / <alpha-value>)",
        cab: "hsl(var(--cab) / <alpha-value>)",
        panel: "hsl(var(--panel) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        magenta: "hsl(var(--magenta) / <alpha-value>)",
        neon: "hsl(var(--neon) / <alpha-value>)",
        bulb: "hsl(var(--bulb) / <alpha-value>)",
        credit: "hsl(var(--credit) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        dim: "hsl(var(--dim) / <alpha-value>)",
        destructive: "hsl(var(--destructive) / <alpha-value>)",
      },
      fontFamily: {
        // Titulares: condensadas y gigantes, como el rótulo de una cabina.
        display: ["Anton", "Arial Black", "sans-serif"],
        // Etiquetas, precios y textos de máquina: bitmap squared.
        pixel: ["'Press Start 2P'", "monospace"],
        // Texto corrido y formularios.
        body: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};
