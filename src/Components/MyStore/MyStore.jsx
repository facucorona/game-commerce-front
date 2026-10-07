import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {getAllProducts, getUserOrders} from "../../redux/actions";
import { useSelector } from 'react-redux';
import Orders from "./Orders";
import ProductCard from "../Cards/ProductCard/ProductCard";
import { Redirect } from "react-router-dom";
import BulbRow from '../ui/BulbRow';
//
const MyStore = () => {

  let user = useSelector(state => state.users);
  let userOrders = useSelector(state => state.userOrders);
  let games = useSelector(state=> state.products);
  let dispatch = useDispatch();
  let [orders, setOrders] = useState(false);
  var user_id;
  if (user.user) {
      user_id = user.user.id;
  }
  let filteredGames=[];
  useEffect(()=>{

    dispatch(getAllProducts())
    // FIX: se pedían las órdenes con `user_id` undefined cuando no hay sesión
    // → 401 en la consola. Solo se consulta si hay usuario.
    user_id && dispatch(getUserOrders(user_id))
  },[dispatch, user_id])

  userOrders.forEach(e=> games.forEach(f=>{
    if(e.game_id === f.id){
      filteredGames.push(f)
    }
  }))



  // ARCADE · BIBLIOTECA: cada juego comprado es una máquina de la sala; el
  // toggle pixel de arriba abre el marcador de récords (tabla de órdenes).
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
      {user?.user?.isAdmin && <Redirect to='/*' />}

      <BulbRow className="mb-6" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="gc-pixel text-[10px] uppercase text-magenta">Your cabinet</p>
          <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">MY STORE</h1>
        </div>

        <div className="text-center">
          <input className="gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" onClick={()=> setOrders(!orders)} type="button" value="Show my orders"/>
        </div>
      </div>

      {!orders && <div className="mt-8 flex flex-col gap-4">
        <p className="gc-pixel text-[9px] uppercase text-dim">
          {filteredGames.length > 0 ? `${filteredGames.length} machine(s) ready` : 'No machines in this slot'}
        </p>
      {
        userOrders.length>0 && filteredGames.map(e=>(
          <div key={e.id} className="flex flex-col gap-4 rounded-xl border-2 border-line bg-cab/80 px-4 py-3 gc-drop-in hover:border-neon/70 hover:bg-panel">
            {/* Estado de la máquina: en juego / archivada */}
            <div className="flex items-center gap-3 border-b border-line/60 pb-3">
              <span className={`gc-pixel shrink-0 rounded-md border px-3 py-2 text-[9px] uppercase ${e.isDisabled ? 'border-destructive/70 text-destructive' : 'border-neon/70 text-neon'}`}>
                {e.isDisabled ? 'Archived' : 'Ready'}
              </span>
              <span className="gc-pixel truncate text-[10px] uppercase text-ink">{e.name}</span>
              <span className="gc-pixel ml-auto shrink-0 text-[10px] text-credit">{e.price}</span>
            </div>

            <ProductCard id={e.id} id_api={e.id_api} name={e.name} img={e.background_image
          } rating={e.rating} platforms={e.platforms} price={e.price} fromApi={e.fromApi} isDisabled={e.isDisabled} genres={e.genres} />
          </div>
        ))
      }
      </div>}
      {
        orders && <Orders orders={userOrders} games={filteredGames}/> 
      }
    </div>
  )
}

export default MyStore
