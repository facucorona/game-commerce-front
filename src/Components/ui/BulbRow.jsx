import React from "react";

/**
 * BULB ROW — la fila de bombillas del marquee.
 *
 * Copia exacta del frame "E · Arcade" de pen.dev (exportado a HTML), no una
 * aproximación: en la maqueta cada bombilla es un CÍRCULO de 16px con halo
 * propio, separados 16px y ciclando tres colores.
 *
 * Lo que había antes (`.gc-bulbs`) era un `background-image` de radial-gradient
 * repetido: pattern de puntitos planos, sin halo y con los colores mal
 * escalonados. Por eso la línea de puntos se veía fea.
 *
 * Valores del original:
 *   bulb  → 16x16px, border-radius 50%, box-shadow 0 0 18px <color>AA
 *   row   → display:flex, gap:16px, justify-content:center, align-items:center
 *   cycle → #FFD400 → #FF2E93 → #00F0FF
 */
const COLORS = ["#FFD400", "#FF2E93", "#00F0FF"];

export default function BulbRow({ count = 18, className = "", ...props }) {
  return (
    <div
      className={`gc-bulb-row pointer-events-none flex w-full items-center justify-center gap-4 ${className}`}
      aria-hidden="true"
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => {
        const color = COLORS[i % COLORS.length];
        return (
          <span
            key={i}
            className="gc-bulb"
            // El color se pasa como variable CSS para que el hover pueda usar
            // el MISMO color en un halo más fuerte (ver .gc-bulb en index.css)
            style={{ "--bulb-color": color }}
          />
        );
      })}
    </div>
  );
}
