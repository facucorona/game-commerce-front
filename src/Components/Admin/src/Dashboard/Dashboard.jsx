import React from 'react'
import InfoWeb from './InfoWeb/InfoWeb.jsx'
import InfoSales from './InfoSales/InfoSales.jsx'
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from "react";
import {getAllProducts, getGenres, getPlatforms, getAllUsers,getAllorders } from '../../../../redux/actions.js'
import LineChart from '../Dashboard/InfoSales/LineChart.jsx'
import BarChart from "../Dashboard/InfoSales/BarChart.jsx";
import PieChart from "../Dashboard/InfoSales/PieChart.jsx";
import DoughnutChart from "../Dashboard/InfoSales/DoughnutChart.jsx";
import Tables from "../Dashboard/InfoSales/Tables";

// PATRÓN ARCADE: encabezado de rótulo (etiqueta pixel magenta + título Anton) y
// cada bloque del dashboard dentro de una caja de máquina: rounded-xl, bisel
// violeta de 2px y fondo "cab". Las cuatro pantallas de chart van en grilla.

export default function Dashboard() {
  
  const items = useSelector((state) => state)
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(getAllProducts())
    dispatch(getGenres())
    dispatch(getPlatforms())
    dispatch(getAllUsers())
    dispatch(getAllorders())
  },[dispatch])

  return (

    <div className="flex flex-col gap-6">

      {/* ENCABEZADO: rótulo de cabina */}
      <header>
        <p className="gc-pixel text-[10px] uppercase text-magenta">Dashboard</p>
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink">Operator Panel</h1>
      </header>

      {/* BLOQUE INFO SALES */}
      <div className="rounded-xl border-2 border-line bg-cab p-5">
        <h3 className="gc-pixel mb-4 text-[9px] uppercase text-dim">Info Sales</h3>
        <InfoSales items={items}/>
      </div>

      {/* BLOQUE INFO WEB */}
      <div className="rounded-xl border-2 border-line bg-cab p-5">
        <h3 className="gc-pixel mb-4 text-[9px] uppercase text-dim">Info Web</h3>
        <InfoWeb items={items}/>
      </div>

      {/* PANTALLAS DE CHART (el orden de renders no cambia) */}
      <div className="grid gap-6 md:grid-cols-2">
        <LineChart/>
        <BarChart/>
        <PieChart/>
        <DoughnutChart/>
      </div>

      <div>
        <Tables/>
      </div>
    </div>
  )
};
