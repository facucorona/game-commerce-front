import React, { useState } from 'react'
import { Link } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · LA RANURA DE MONEDAS
 * Panel de máquina: ranura oscura con boca cian y glow, rótulo pixel "RANURA",
 * la leyenda "UNA MONEDA = UN JUEGO AL AZAR", el juego sorteado en font-display
 * y el botón "TIRAR LA MONEDA" (cian, texto oscuro).
 * ────────────────────────────────────────────────────────────────────────── */

/* BUG ARREGLADO (el original reventaba la app):
 *   `Math.floor(Math.random() * 100)` sortea un índice entre 0 y 99 sobre un
 *   catálogo que casi nunca tiene 100 elementos (y al principio tiene ~0-5),
 *   así que `games.games[number]` llegaba en `undefined` y la desestructuración
 *   `{ id, name, ... }` lanzaba "Cannot destructure property of undefined".
 *   Ahora el índice se sortea dentro del rango real y se clampa como red de
 *   seguridad para que NUNCA quede fuera del array. */
export function RandomHelper({ games }) {

    const pool = (games && games.games) || [];
    const [game, setGame] = useState(null);
    const [spinning, setSpinning] = useState(false);

    function pullLever() {
        if (pool.length < 1) return;

        const index = Math.floor(Math.random() * pool.length);
        // clamp: aunque el índice ya nazca dentro del rango, queda garantizado
        // que nunca supere el último índice real del catálogo.
        const safeIndex = Math.min(Math.max(index, 0), pool.length - 1);

        setSpinning(true);
        setGame(pool[safeIndex]);
        setTimeout(() => setSpinning(false), 600);
    }

    return (
        <div className="gc-drop-in w-full max-w-[520px] rounded-xl border-2 border-line bg-cab/80 p-5">

            {/* Rótulo de la máquina */}
            <div className="flex items-center justify-center gap-3">
                <span className="gc-pixel text-[10px] uppercase text-magenta">Ranura</span>
                <span className="h-px flex-1 bg-line"></span>
                <i className="bi bi-cash-coin text-credit" aria-hidden="true" />
            </div>

            {/* ── LA RANURA ─────────────────────────────────────────────── */}
            <div className="relative mx-auto mt-5 h-16 w-full max-w-[260px] overflow-hidden rounded-lg border-2 border-neon/60 bg-void gc-glow-cyan">
                <div className="gc-grid absolute inset-0 opacity-50" aria-hidden="true" />

                {/* Reel girando: tres líneas pixel */}
                {spinning ? (
                    <div className="gc-pixel gc-blink absolute inset-0 flex items-center justify-center text-[9px] uppercase text-neon">
                        Girando...
                    </div>
                ) : null}

                {/* Monedas apiladas dentro de la ranura */}
                <div className="absolute inset-x-3 bottom-2 flex flex-col-reverse gap-1" aria-hidden="true">
                    {[0, 1, 2, 3].map((n) => (
                        <span
                            key={n}
                            className="mx-auto h-1.5 w-16 rounded-full bg-neon/70 shadow-[0_0_8px_rgba(0,240,255,0.7)]"
                        ></span>
                    ))}
                </div>

                {/* La boca de la ranura: el borde cian que "agarra" la moneda */}
                <div className="absolute inset-x-0 bottom-0 h-1.5 bg-neon gc-glow-cyan" aria-hidden="true"></div>
            </div>

            {/* Leyenda del panel */}
            <p className="gc-pixel mt-5 text-center text-[9px] uppercase text-dim">
                Una moneda = un juego al azar
            </p>

            {/* ── EL RESULTADO DEL SORTEO ───────────────────────────────── */}
            <div className="mt-4 flex min-h-[5.5rem] items-center justify-center border-y border-line/60 py-4">
                {game ? (
                    <Link
                        to={`/detail/${game.id}`}
                        className="group flex flex-col items-center gap-2 text-center"
                    >
                        <span className="gc-pixel text-[9px] uppercase text-neon">Juego sorteado</span>
                        <span className="font-display text-4xl uppercase leading-none tracking-wide text-ink transition group-hover:text-neon">
                            {game.name}
                        </span>
                        <span className="gc-pixel text-[10px] text-credit">ARS$ {game.price}</span>
                    </Link>
                ) : (
                    <span className="gc-pixel text-center text-[9px] uppercase text-dim">
                        <i className="bi bi-question-circle mb-2 block text-2xl text-line" aria-hidden="true" />
                        Insert coin
                    </span>
                )}
            </div>

            {/* ── EL BOTÓN DE LA MONEDA ─────────────────────────────────── */}
            <button
                type="button"
                onClick={pullLever}
                disabled={pool.length < 1}
                className="gc-pixel mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-neon px-5 py-3 text-[10px] uppercase text-void gc-glow-cyan transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <i className="bi bi-coin" aria-hidden="true" />
                Tirar la moneda
            </button>
        </div>
    )
}
