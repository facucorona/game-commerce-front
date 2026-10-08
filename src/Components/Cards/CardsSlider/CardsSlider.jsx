import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'
import CardLanding from '../../CardLanding/CardLanding.jsx'


// Cuántas tarjetas entran por slide según el ancho de la ventana. Antes era un
// `window.screen.width > X` evaluado en render (y `screen`, no `innerWidth`, así
// que no reacciona a redimensionar); ahora se calcula una vez por render con el
// ancho real del viewport.
function visibles() {
  if (typeof window === 'undefined') return 1
  if (window.innerWidth > 1200) return 3
  if (window.innerWidth > 720) return 2
  return 1
}

function CardSlider({ platforms, i }) {
  // ARCADE: carrusel de "cabinas en fila" — estado de React + translateX en el
  // track (antes dependía del JS de Bootstrap). Puntos = selectores de cabina.
  //
  // DEDUPLICADO: el catálogo viene con inclusiones de plataformas y géneros, así
  // que el MISMO juego puede aparecer dos veces en `platforms` (cumplía dos
  // criterios). Antes eso se veía literal en pantalla: "Risk of Rain 2" repetido
  // en dos tarjetas del mismo slide. Se uniquifica por id conservando el orden.
  const unicos = (platforms || []).filter(
    (p, idx, arr) => arr.findIndex((q) => q && p && q.id === p.id) === idx
  )
  const porSlide = visibles()

  // Se agrupan en páginas de tamaño `porSlide` (sin resto: una página con menos
  // tarjetas que las demás dejaba huecos y hacía que el último slide se viera
  // vacío al avanzar).
  const slides = []
  for (let s = 0; s < unicos.length; s += porSlide) {
    slides.push(unicos.slice(s, s + porSlide))
  }
  const [active, setActive] = useState(0)

  const goTo = (n) => {
    if (slides.length === 0) return
    setActive((n + slides.length) % slides.length)
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-[1000px]">
      <div className="flex flex-row items-center justify-center gap-3">

        <div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-neon/70 text-neon transition hover:bg-neon/10"
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous"
          >
            <i className="bi bi-chevron-left" aria-hidden="true" />
          </button>
        </div>

        <div className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {slides.map((grupo, idx) => (
              <div key={idx} className="flex w-full shrink-0 items-stretch justify-center gap-6 px-2">
                {grupo.map((producto) => (
                  <div key={producto.id} className="mx-5 my-2">
                    <CardLanding
                      id={producto.id}
                      name={producto.name}
                      img={producto.background_image}
                      rating={producto.rating}
                      price={producto.price}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-neon/70 text-neon transition hover:bg-neon/10"
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next"
          >
            <i className="bi bi-chevron-right" aria-hidden="true" />
          </button>
        </div>

      </div>

      <div className="mt-4 flex items-center justify-center gap-2">
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

export default CardSlider
