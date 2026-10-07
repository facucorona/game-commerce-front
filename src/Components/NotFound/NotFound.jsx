import React from 'react'
import BulbRow from '../ui/BulbRow';
// NOTA ARCADE: el 404 es la pantalla GAME OVER de la recreativa → rótulo
// gigante en Anton con halo magenta, código "404" en pixel amarillo (bulb) y
// el botón INSERT COIN que devuelve al home.
// Se eliminó `NotFound.css` (y con él las estrellas, la lámpara y los overlays
// decorativos) porque sus clases no existen más. El <a href="/home"> del
// original se conserva tal cual, ahora con su rótulo "INSERT COIN" en markup
// en lugar del pseudo-elemento `:after` del CSS viejo.

const NotFound = () => {

  return (
    <div className="relative mx-auto flex min-h-[70vh] w-full max-w-[1400px] flex-col items-center justify-center px-4 py-16 md:px-8">

      {/* Filete de bombillas del marco */}
      <BulbRow className="mb-10" />

      <section className="gc-drop-in flex w-full max-w-[720px] flex-col items-center gap-6 rounded-2xl border-2 border-line bg-cab/80 p-8 text-center gc-glow-magenta">
        <span className="gc-pixel gc-blink rounded-md border border-bulb/70 bg-bulb/10 px-3 py-2 text-[10px] uppercase text-bulb">
          Código 404
        </span>

        <h1 className="font-display text-6xl uppercase leading-none tracking-wide text-magenta [text-shadow:0_0_28px_rgba(255,46,147,0.75)] md:text-8xl">
          Game Over
        </h1>

        <p className="max-w-md text-sm leading-relaxed text-dim">
          No encontramos esta sala. El enlace que seguiste puede estar roto o
          directamente ya no existe. Volvé al inicio e insertá una moneda.
        </p>

        <div className="mt-2">
          <a
            href="/home"
            target="_blanck"
            className="gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110"
          >
            Insert coin
          </a>
        </div>
      </section>

      <BulbRow className="mt-10" />
    </div>
  )
}

export default NotFound
