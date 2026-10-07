import React from 'react';
import { Link } from 'react-router-dom';
import BulbRow from '../ui/BulbRow';

export default function NotCardWhishList(params) {
    // ARCADE · ESTADO VACÍO: "NO HAY PARTIDAS GUARDADAS" en display con
    // scanlines y un botón pixel para volver al catálogo.
    return (
        <div className="w-full max-w-[560px] overflow-hidden rounded-xl border-2 border-line bg-cab/90 text-center gc-scanlines gc-drop-in" aria-current="true">
            <BulbRow />

            <div className="gc-attract px-8 py-10">
                <p className="gc-pixel text-[10px] uppercase text-white/80">Empty slot</p>
                <h1 className="mt-3 font-display text-4xl uppercase tracking-wide text-white">NO HAY PARTIDAS GUARDADAS</h1>
            </div>

            <div className="px-8 py-8">
                <Link to="/home" className="gc-pixel inline-block rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110" style={{ textDecoration: 'none' }}>
                    <i className="bi bi-controller me-2" aria-hidden="true" />Go to catalog
                </Link>
            </div>
        </div>
    );
};
