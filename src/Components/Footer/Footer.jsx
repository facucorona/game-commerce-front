import React from "react";
import { useLocation } from "react-router-dom";
import BulbRow from '../ui/BulbRow';
// NOTA ARCADE: el pie es el "panel de créditos" de la sala → filete violeta
// arriba, fila de bombillas, rótulo de la máquina, email de contacto
// como tecla de máquina y el lema "1 CRÉDITO = 1 JUEGO".
// Se sacó el uso de Footer.module.css: todo son tokens y utilidades de index.css.

export default function About() {
    let location = useLocation();

    if (location.pathname === "/admin") {
        return null;
    }

    return (
        <nav className="w-full rounded-none border-t-2 border-line bg-cab/60">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">

                {/* Filete de bombillas: el borde de la marquesina */}
                <BulbRow className="mb-6" />

                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                    {/* Rótulo de la máquina */}
                    <div className="flex flex-col gap-1">
                        <span className="gc-title font-display text-4xl uppercase leading-none tracking-wide text-magenta"
                          onMouseEnter={(e) => { if (e.target.classList.contains('g-mag')) e.currentTarget.classList.add('hover-mag'); if (e.target.classList.contains('g-neon')) e.currentTarget.classList.add('hover-neon'); }}
                          onMouseLeave={(e) => { e.currentTarget.classList.remove('hover-mag', 'hover-neon'); }}
                        >
                            <span className="g-mag">Gam</span><span className="g-neon text-neon">e</span><span className="g-mag">-</span><span className="g-neon text-neon">Commerce</span>
                        </span>
                        <span className="gc-pixel text-[9px] uppercase text-dim">Sala de juegos</span>
                    </div>

                    {/* Contacto: solo email */}
                    <div className="flex items-center gap-3 rounded-lg border border-line bg-panel/60 px-4 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 fill-neon" aria-hidden="true">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                        </svg>
                        <div className="flex flex-col gap-1">
                            <span className="gc-pixel text-[9px] uppercase text-dim">Email</span>
                            <h6 className="m-0 font-body text-sm text-ink">contacto@korestudio.com.ar</h6>
                        </div>
                    </div>
                </div>

                {/* Lema de la sala: la unidad con la que se juega */}
                <div className="mt-6 flex items-center justify-center gap-2 border-t border-line/60 pt-5">
                    <i className="bi bi-coin text-bulb" aria-hidden="true" />
                    <span className="gc-pixel text-[10px] uppercase text-neon">1 crédito = 1 juego</span>
                    <i className="bi bi-coin text-bulb" aria-hidden="true" />
                </div>
            </div>
        </nav>
    )
}

