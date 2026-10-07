// ARCADE · PANTALLA DE ARRANQUE: ficha de cuenta del jugador. El componente es
// un stub sin datos todavía, así que sólo se estiliza la cabina.
import React from 'react'
import BulbRow from '../ui/BulbRow';

function Account() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
      <BulbRow className="mb-6" />

      <p className="gc-pixel text-[10px] uppercase text-magenta">Insert coin</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">ACCOUNT</h1>

      <div className="mt-6 w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 gc-glow-magenta gc-drop-in">
        <p className="gc-pixel text-[10px] uppercase text-dim">Player data slot</p>
        <p className="mt-3 text-sm text-dim">Próximamente: tus créditos, tus récords y tus ajustes de cabina.</p>
      </div>
    </div>
  )
}

export default Account
