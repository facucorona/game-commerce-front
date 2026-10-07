import React from 'react'
// NOTA ARCADE: la carga es el rótulo de la cabina parpadeando → cabina
// centrada con bisel violeta, ícono de crédito y "CARGANDO..." en pixel con
// gc-blink. Se conserva `role="status"` (lectores de pantalla) y el texto
// visible reemplaza al `visually-hidden` de Bootstrap.

function Spinner() {
  return (
    <div className="col-span-full flex w-full items-center justify-center py-8">
      <div
        role="status"
        className="gc-drop-in flex flex-col items-center gap-4 rounded-xl border-2 border-line bg-cab/80 px-8 py-6 gc-glow-cyan"
      >
        <i className="bi bi-coin text-2xl text-bulb" aria-hidden="true" />
        <span className="gc-pixel gc-blink text-[10px] uppercase text-neon">Cargando...</span>
      </div>
    </div>
  )
}

export default Spinner
