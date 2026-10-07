import React from 'react'
import { useMemo } from 'react';

import { Doughnut} from 'react-chartjs-2'

import { Chart, registerables } from 'chart.js';
Chart.register(...registerables)


const scores = ["19522", "104329", "93943", "93483"]
const labels = ["Action", "Adventure", "Indie", "Otros"]

const options = {
    fill:true,
    responsive: false,
}

export default function DoughnutChart() {
    const data = useMemo(function() {
        return {
            datasets: [
                {
                    label: "Monthly sales",
                    data: scores,
                    transition: 1,
                    tension: 0.3, 
                    backgroundColor: ['rgb(239, 165, 165)','rgb(192, 239, 182)', 'rgb(198, 155, 247)', '#FFEC00', 'rgb(145, 210, 247)', '#FD3401']  
      
                },
            ],
            labels,
        }
    }, [])
   
    // PATRÓN ARCADE: caja de máquina (bisel violeta + fondo cab) con título pixel
    // arriba y el canvas sobre un panel con scanlines. La config de chart.js
    // (data / options / labels) NO se toca.
    return (
        <div className="rounded-xl border-2 border-line bg-cab p-5">
            
            <p className="gc-pixel mb-4 text-[9px] uppercase text-dim">Sales by genre</p>
            <div className="gc-scanlines rounded-lg bg-panel p-3">
                <Doughnut data={data} options={options}/>
            </div>
        
        </div>
    )
};