import React from 'react'
import LineChart from "../InfoSales/LineChart.jsx";

// PATRÓN ARCADE: rejilla de métricas (contadores de récord). Cada caja es
// "rounded-xl border-2 border-line bg-cab p-5" con etiqueta pixel; las cifras
// van en font-display y, cuando son importes, en verde de CRÉDITOS.

export default function InfoSales({ items }) {


    const cantofProducts = items.products.length

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <div className="rounded-xl border-2 border-line bg-cab p-5">
                <p className="gc-pixel text-[9px] uppercase text-dim">Quantity of products</p>
                <p className="font-display mt-2 text-4xl text-credit">{cantofProducts}</p>
            </div>

            <div className="rounded-xl border-2 border-line bg-cab p-5">
                <p className="gc-pixel text-[9px] uppercase text-dim">Daily sales</p>
                <p className="font-display mt-2 text-4xl text-credit">15.004 u$d</p>
            </div>

            <div className="rounded-xl border-2 border-line bg-cab p-5">
                <p className="gc-pixel text-[9px] uppercase text-dim">Monthly sales</p>
                <p className="font-display mt-2 text-4xl text-credit">150.584 u$d</p>
            </div>

            <div className="rounded-xl border-2 border-line bg-cab p-5">
                <p className="gc-pixel text-[9px] uppercase text-dim">Best selling game</p>
                <p className="font-display mt-2 text-2xl leading-tight text-ink">The Witcher 3: Wild Hunt</p>
            </div>

</div>
)
};