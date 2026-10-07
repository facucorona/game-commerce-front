import React from 'react'
import { useMemo } from 'react';

import { Line } from 'react-chartjs-2'

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)


// PATRÓN ARCADE: cada chart va dentro de una caja de máquina (bisel violeta +
// fondo cab) con título pixel arriba y el canvas sobre un panel con scanlines.
// La config de chart.js (data / options / labels) NO se toca.
const scores = ["10", "20", "45", "3", "80"]
const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Frinday"]

const options = {
    fill:true,
    responsive: false,
}

export default function LineChart() {
    const data = useMemo(function() {
        return {
            datasets: [
                {
                    label: "Weekly Users",
                    data: scores,
                    transition: 1,
                    tension: 0.3,
                    borderColor: "#223852",
                    pointBackgroundColor: "#223852",
                    
                },
            ],
            labels,
        }
    }, [])
   
    return  <div className="rounded-xl border-2 border-line bg-cab p-5">
            
    <p className="gc-pixel mb-4 text-[9px] uppercase text-dim">Weekly Users</p>
    <div className="gc-scanlines rounded-lg bg-panel p-3">
      <Line data={data} options={options}/>
    </div>

</div>
};