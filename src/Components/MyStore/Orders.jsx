import React from 'react'
import { Link } from 'react-router-dom'

function Orders({orders, games}) {
  // ARCADE · MARCADOR DE RÉCORDS: tabla pixel dentro de un marco de cabina;
  // precio en verde créditos y enlaces al detalle en cian.
  return  (

    <div className="mt-8">

    <p className="gc-pixel text-[10px] uppercase text-magenta">High scores</p>
    <h2 className="mt-2 font-display text-3xl uppercase tracking-wide text-ink">Orders</h2>

    <div className="mt-4 overflow-hidden rounded-xl border-2 border-line">
      <table className="w-full border-collapse">
          <thead>
              <tr className="gc-pixel border-b-2 border-line bg-panel text-[9px] uppercase text-dim">
                  <th className="px-4 py-3 text-left" scope="col">Order id</th>
                  <th className="px-4 py-3 text-left" scope="col">Game</th>
                  <th className="px-4 py-3 text-left" scope="col">Date of purchase</th>
                  <th className="px-4 py-3 text-left" scope="col">Price</th>
              </tr>
          </thead>
          <tbody  >
            {
              orders&&orders.map((e,index)=>(
                <tr key={index} className="gc-pixel border-b border-line text-[10px] text-ink hover:bg-panel">
                    <td className="px-4 py-3">{e.id}</td>
                    <td className="px-4 py-3"><Link className="text-neon transition hover:text-bulb" to={`/detail/${games[index].id}`}>{e.game_name}</Link></td>
                    <td className="px-4 py-3 text-dim">{e.createdAt}</td>
                    <td className="px-4 py-3 text-credit">{e.price}</td>
                </tr>
              ))
            }
          </tbody>
      </table>
    </div>
    </div>    
  )
}

export default Orders
