import React from 'react'
import { useMemo } from 'react';

import { Bar } from 'react-chartjs-2'

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)


const scores = ["10553", "9200", "8100", "7500", "12600", "9384"]
const labels = ["January", "february", "March", "April", "May", "Jun"]

const options = {
    fill:true,
    responsive: false,
}

export default function BarChart() {
    const data = useMemo(function() {
        return {
            datasets: [
                {
                    label: "Monthly sales",
                    data: scores,
                    transition: 1,
                    backgroundColor: ['rgb(60, 99, 34)', 'rgb(60, 99, 34)', 'rgb(60, 99, 34)', 'rgb(178, 3, 8)', 'rgb(60, 99, 34)', 'rgb(60, 99, 34)'],  
                    tension: 0.3
                    
                },
            ],
            labels,
        }
    }, [])
   
    // PATRÓN ARCADE: caja de máquina (bisel violeta + fondo cab) con título pixel
    // arriba y el canvas sobre un panel con scanlines. La config de chart.js
    // (data / options / labels) NO se toca.
    return  <div className="rounded-xl border-2 border-line bg-cab p-5">
            
    <p className="gc-pixel mb-4 text-[9px] uppercase text-dim">Monthly sales</p>
    <div className="gc-scanlines rounded-lg bg-panel p-3">
      <Bar data={data} options={options}/>
    </div>

</div>
};