import React from 'react'
import { clearCart, getUserOrders } from '../../redux/actions'
import { useDispatch } from "react-redux";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import BulbRow from '../ui/BulbRow';

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · PANTALLA DE COMPRA EXITOSA
 * "PLAYER 1 CLEAR" en font-display con glow magenta, como el cartel de fin de
 * partida de una recreativa: resumen de lo que pasó y la salida de la sala.
 * Los dispatch y el href de /home quedan intactos.
 * ────────────────────────────────────────────────────────────────────────── */

const Success = () => {
  let dispatch = useDispatch();
  const { user } = useSelector(state => state.users);
  useEffect(() => {
    user && dispatch(getUserOrders(user.id));
    dispatch(clearCart());
  }, [user]);
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[1400px] flex-col items-center justify-center overflow-hidden px-4 py-16 md:px-8">

      <BulbRow />

      <div className="gc-drop-in mt-6 w-full max-w-[680px] rounded-xl border-2 border-magenta/70 bg-cab/80 p-8 text-center gc-glow-magenta">

        {/* Titular de fin de partida */}
        <p className="gc-pixel text-[10px] uppercase text-neon">Partida completada</p>
        <h1 className="mt-4 font-display text-6xl uppercase leading-none tracking-wide text-magenta [text-shadow:0_0_24px_rgba(255,46,147,0.65)] md:text-7xl">
          Player 1 Clear
        </h1>

        {/* Resumen */}
        <div className="mx-auto mt-8 max-w-[420px]">
          <div className="flex items-center justify-between gap-4 border-b border-line/60 py-3">
            <span className="gc-pixel text-[9px] uppercase text-dim">Transaccion</span>
            <span className="gc-pixel text-[10px] uppercase text-credit">Aprobada</span>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-line/60 py-3">
            <span className="gc-pixel text-[9px] uppercase text-dim">Creditos usados</span>
            <span className="gc-pixel text-[10px] uppercase text-credit">Cargados</span>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <span className="gc-pixel text-[9px] uppercase text-dim">Biblioteca</span>
            <span className="gc-pixel text-[10px] uppercase text-ink">Actualizada</span>
          </div>
        </div>

        <p className="gc-pixel mt-8 text-[9px] uppercase leading-relaxed text-dim">
          Tus juegos ya estan en tu arcade
        </p>

        {/* Salida de la sala */}
        <a href="/home" className="mt-8 inline-block">
          <button className="gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110">
            <i className="bi bi-house-door mr-2" aria-hidden="true" />
            Go Back Home
          </button>
        </a>
      </div>
    </div>
  )
}

export default Success
