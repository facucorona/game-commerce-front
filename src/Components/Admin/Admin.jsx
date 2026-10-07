import React from 'react'
import Options from './src/Options/Options.jsx'
import InfoContainter from './src/infoContainter/infoContainter.jsx'
import { useState, useEffect } from "react";
import BulbRow from '../ui/BulbRow';

// Usar localStorage o coockies para que al 
// actualizar se quede en el componente acutal

// PATRÓN ARCADE: shell de "sala de máquinas" → riel de pestañas (Options) a la
// izquierda dentro de un <aside> tipo cabina, y el panel que muestra la pestaña
// activa a la derecha (<main> centrado). Cama de la sala ya la pone el body.

export default function Admin() {

  /*  const [items, setItems] = useState({});

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
  }, [items]); */

  const [render, setRender] = useState({dash: true});

  return (
    <div className="flex min-h-screen">
        {/* BARRA LATERAL DE PESTAÑAS: el "selector de máquina" del admin */}
        <aside className="w-60 shrink-0 border-r-2 border-line bg-cab/90 p-4">
          <BulbRow />
          <p className="gc-pixel mt-4 text-[9px] uppercase text-magenta">Game-Commerce</p>
          <h1 className="font-display text-2xl uppercase tracking-wide text-ink">Control</h1>
          <Options setRender={setRender}/>
        </aside>
        {/* CONTENIDO DE LA PESTAÑA ACTIVA */}
        <main className="mx-auto w-full max-w-[1200px] px-6 py-8">
          <InfoContainter render={render} setRender={setRender}/>
        </main>
    </div>
  )
}