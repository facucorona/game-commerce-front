import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import banner from "../../../images/banner.jpg"
import banner2 from "../../../images/banner2.jpg"

function CardForSale({ forSale }) {
  // ARCADE: marquesina de ofertas — el slide activo entra con gc-drop-in como el
  // rótulo de una cabina; estado de React en vez de data-bs-* de Bootstrap.
  const slides = forSale ? forSale.slice(0, 9) : []
  const [active, setActive] = useState(0)

  const goTo = (n) => {
    if (slides.length === 0) return
    setActive((n + slides.length) % slides.length)
  }

  return (
    <div className="mx-auto mt-6 flex w-full max-w-[1200px] flex-col items-center gap-3">
      <p className="gc-pixel text-[10px] uppercase text-magenta">Ofertas de la sala</p>

      <div className="flex w-full items-center justify-center gap-3">

        {/* ARCADE: los flyers laterales se montan como CABINAS verticales
            (marco + scanlines + rótulo pixel) en vez de imágenes sueltas.
            Antes se renderizaban a su tamaño natural (3456x6912 px, 5.7 MB cada
            una) y rompían el layout; ahora se/aligeraron a 700x1400 px y se
            muestran a altura fija, como los laterales de una fila de máquinas.
            OJO: el link del primer flyer apuntaba a un id de juego inexistente
            (2aa2198c-…) que dejaba la ficha en "CARGANDO" para siempre. */}
        <div className="hidden shrink-0 xl:block">
          <Link to="/home" className="group block">
            <div className="relative h-[420px] w-[210px] overflow-hidden rounded-xl border-2 border-line bg-cab p-1 transition group-hover:border-neon">
              <img src={banner} alt="Promoción Black Friday: 50% off en juegos" className="h-full w-full rounded-lg object-cover" />
              <div className="gc-scanlines pointer-events-none absolute inset-1 rounded-lg opacity-60" aria-hidden="true" />
              <span className="gc-pixel absolute left-3 top-3 rounded bg-bulb px-2 py-1 text-[8px] uppercase text-void gc-glow-bulb">Promo</span>
            </div>
            <p className="gc-pixel mt-2 text-center text-[9px] uppercase text-dim">Black Friday · -50%</p>
          </Link>
        </div>

        <div className="shrink-0">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-neon/70 text-neon transition hover:bg-neon/10"
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous"
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
        </div>

        <div className="w-3/4 overflow-hidden rounded-xl border-2 border-line bg-cab">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {
              slides.map((e, i) => {
                return (
                  <div key={i} className="gc-drop-in relative w-full shrink-0">
                    <Link className="block" to={`/detail/${e.id}`}>
                      <img className="max-h-[40rem] w-full rounded object-cover" src={e?.background_image} alt="..." />
                    </Link>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden gap-2 bg-gradient-to-t from-void/90 to-transparent p-5 md:flex md:items-center md:justify-between">
                      <h4 className="font-display text-2xl uppercase text-ink">{e.name}</h4>
                      <span className="gc-pixel rounded bg-magenta px-3 py-2 text-[10px] uppercase text-white gc-glow-magenta">On Sale! 50% off</span>
                    </div>
                  </div>

                )
              })
            }
          </div>
        </div>

        <div className="shrink-0">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-neon/70 text-neon transition hover:bg-neon/10"
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next"
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>

        <div className="hidden shrink-0 xl:block">
          <Link to="/login" className="group block">
            <div className="relative h-[420px] w-[210px] overflow-hidden rounded-xl border-2 border-line bg-cab p-1 transition group-hover:border-neon">
              <img src={banner2} alt="Promoción de registro: ganá juegos" className="h-full w-full rounded-lg object-cover" />
              <div className="gc-scanlines pointer-events-none absolute inset-1 rounded-lg opacity-60" aria-hidden="true" />
              <span className="gc-pixel absolute left-3 top-3 rounded bg-bulb px-2 py-1 text-[8px] uppercase text-void gc-glow-bulb">Promo</span>
            </div>
            <p className="gc-pixel mt-2 text-center text-[9px] uppercase text-dim">Registrate · Ganá</p>
          </Link>
        </div>

      </div>

      <div className="flex items-center justify-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
            aria-current={idx === active ? "true" : undefined}
            className={`h-1.5 rounded-sm transition-all duration-300 ${idx === active ? "w-10 bg-magenta gc-glow-magenta" : "w-6 bg-line/70 hover:bg-dim hover:w-8"}`}
          />
        ))}
      </div>
    </div>
  )
}

export default CardForSale
