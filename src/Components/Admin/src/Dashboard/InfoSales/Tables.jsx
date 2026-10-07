import React from 'react'

// PATRÓN ARCADE: tablas de récords → contenedor "overflow-hidden rounded-xl
// border-2 border-line", cabecera pixel sobre bg-panel y filas con bisel violeta.
// Los importes van en verde de CRÉDITOS. Los datos (y sus valores) no cambian.

export default function Tables() {
  return (
    <div className="grid gap-6 md:grid-cols-2">

      {/* TOTAL SALES GENRES */}
      <div>
        <h4 className="gc-pixel mb-3 text-[9px] uppercase text-dim">Total sales genres</h4>
        <div className="overflow-hidden rounded-xl border-2 border-line">
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="gc-pixel bg-panel text-[9px] uppercase text-dim">
                <th className="w-1/2 px-4 py-3" scope="col">Genre</th>
                <th className="px-4 py-3" scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">Adventure</td>
                <td className="gc-pixel px-4 py-3 text-credit">580 u$s</td>
              </tr>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">Action</td>
                <td className="gc-pixel px-4 py-3 text-credit">350 u$d</td>
              </tr>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">Indie</td>
                <td className="gc-pixel px-4 py-3 text-credit">150 u$d</td>
              </tr>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">others</td>
                <td className="gc-pixel px-4 py-3 text-credit">150 u$d</td>
              </tr>
              <tr className="bg-panel text-sm text-ink">
                <td className="gc-pixel px-4 py-3 text-[9px] uppercase text-bulb">TOTAL:</td>
                <td className="font-display px-4 py-3 text-lg text-credit">1.230 u$d</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* TOTAL SALES PLATFORMS */}
      <div>
        <h4 className="gc-pixel mb-3 text-[9px] uppercase text-dim">Total sales platforms</h4>
        <div className="overflow-hidden rounded-xl border-2 border-line">
          <table className="w-full table-fixed text-left">
            <thead>
              <tr className="gc-pixel bg-panel text-[9px] uppercase text-dim">
                <th className="w-1/2 px-4 py-3" scope="col">Genre</th>
                <th className="px-4 py-3" scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">Xbox</td>
                <td className="gc-pixel px-4 py-3 text-credit">803 u$d</td>
              </tr>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">Pc</td>
                <td className="gc-pixel px-4 py-3 text-credit">450 u$d</td>
              </tr>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">PS 5</td>
                <td className="gc-pixel px-4 py-3 text-credit">688 u$d</td>
              </tr>
              <tr className="border-b border-line text-sm text-ink hover:bg-panel">
                <td className="px-4 py-3">others</td>
                <td className="gc-pixel px-4 py-3 text-credit">688 u$d</td>
              </tr>
              <tr className="bg-panel text-sm text-ink">
                <td className="gc-pixel px-4 py-3 text-[9px] uppercase text-bulb">TOTAL:</td>
                <td className="font-display px-4 py-3 text-lg text-credit">2.629 u$d</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}