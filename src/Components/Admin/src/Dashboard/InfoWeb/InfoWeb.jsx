import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

// PATRÓN ARCADE: las tres métricas web usan la caja de contador de récord
// (bisel violeta, etiqueta pixel y cifra en Anton).

export default function InfoWeb({items}) {

  
  const baneados = items.allUsers.filter(e => e.isBanned === true)
  const Admin = items.allUsers.filter(e => e.isAdmin === true)
  
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border-2 border-line bg-cab p-5">
            <p className="gc-pixel text-[9px] uppercase text-dim">Registered users</p>
            <p className="font-display mt-2 text-4xl text-ink">{items.allUsers.length}</p>
        </div>
        <div className="rounded-xl border-2 border-line bg-cab p-5">
            <p className="gc-pixel text-[9px] uppercase text-dim">Users Banned</p>
            <p className="font-display mt-2 text-4xl text-destructive">{baneados.length}</p>
        </div>
        <div className="rounded-xl border-2 border-line bg-cab p-5">
            <p className="gc-pixel text-[9px] uppercase text-dim">Admins</p>
            <p className="font-display mt-2 text-4xl text-bulb">{Admin.length}</p>
        </div>
    </div>
  )
};