import React from "react";
// NOTA ARCADE: la paginación es el SELECTOR DE CRÉDITOS del catálogo →
// "◀ 1 2 3 ▶" en pixel; la página activa se enciende en magenta con borde y
// halo, las demás en panel con texto apagado. Se eliminó `Pagination.css`:
// los handlers (previous / next / paginado) y el `disabled` quedan idénticos.

export default function Pagination({ gamesPerPage, games, paginado, currentPage }) {
    const pageNums = [];

    for (let i = 1; i <= Math.ceil(games / gamesPerPage); i++) {
        pageNums.push(i)
    }
    function previous() {
        paginado(currentPage - 1)
        setTimeout(()=> window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
          }),500)
    }
    function next() {
        paginado(currentPage + 1)
        setTimeout(()=> window.scroll({top: 0}),500)
    }

    // Tecla de avance/retroceso del selector.
    const arrow = "gc-pixel rounded-md border border-neon/70 px-4 py-2 text-[10px] uppercase text-neon transition hover:bg-neon/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    // Crédito apagado / crédito encendido (la página actual).
    const credit = "gc-pixel flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-line bg-panel text-[10px] uppercase text-dim transition hover:border-neon hover:text-neon"
    const creditOn = "gc-pixel flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border-2 border-magenta bg-magenta text-[10px] uppercase text-white gc-glow-magenta"

    return (
        <nav className="mt-8 flex justify-center" aria-label="Selector de créditos">
            <ul className="list-none flex flex-wrap items-center justify-center gap-2">
                <li>
                    <button onClick={previous} className={arrow} disabled={currentPage === pageNums[0] ? true : false} aria-label="Créditos anteriores">{"◀"}</button>
                </li>
                {
                    pageNums && pageNums.map(e => {
                        return (
                            <li key={e} className={currentPage === e ? "text-magenta" : "text-dim"}>
                                <span onClick={() => paginado(e) } className={currentPage === e ? creditOn : credit}>{e}</span>
                            </li>
                        )
                    })
                }
                <li>
                    <button className={arrow} onClick={next} disabled={currentPage === pageNums.length ? true : false} aria-label="Créditos siguientes">{"▶"}</button>
                </li>
            </ul>
        </nav>
    )
}
