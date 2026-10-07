import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../ProductCard/ProductCard'
import CardLanding from '../../CardLanding/CardLanding.jsx'


function CardSlider({ platforms, i }) {
  // ARCADE: carrusel de "cabinas en fila" — estado de React + translateX en el
  // track (antes dependía del JS de Bootstrap). Puntos = selectores de cabina.
  const slides = platforms ? platforms.slice(0, 3) : []
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
            {slides.map((product, idx) => (
              <div key={idx} className="flex w-full shrink-0 items-stretch justify-center gap-6 px-2">
                <div className="mx-5 my-2">
                  <CardLanding
                    key={idx}
                    id={platforms[idx]?.id}
                    name={platforms[idx].name}
                    img={platforms[idx].background_image}
                    rating={platforms[idx].rating}
                    price={platforms[idx].price}
                  />
                </div>
                {window.screen.width > 1200 && idx + 1 < platforms.length ?
                  <div className="mx-5 my-2">
                    <CardLanding
                      key={idx + 1}
                      id={platforms[idx + 1]?.id}
                      name={platforms[idx + 1].name}
                      img={platforms[idx + 1].background_image}
                      rating={platforms[idx + 1].rating}
                      price={platforms[idx + 1].price}
                    />
                  </div>
                  : ''
                }
                {window.screen.width > 720 && idx + 2 < platforms.length ?
                  <div className="mx-5 my-2">
                    <CardLanding
                      key={idx + 2}
                      id={platforms[idx + 2]?.id}
                      name={platforms[idx + 2].name}
                      img={platforms[idx + 2].background_image}
                      rating={platforms[idx + 2].rating}
                      price={platforms[idx + 2].price}
                    />
                  </div>
                  : ''
                }
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
