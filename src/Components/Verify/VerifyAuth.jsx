import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import BulbRow from '../ui/BulbRow';

export default function VerifyAuth() {
    const { token } = useParams();

    window.sessionStorage.setItem('token', token);

    // ARCADE · GAME OVER / CARGANDO: el callback de OAuth muestra "CARGANDO..."
    // pixel parpadeante mientras espera el token y "GAME OVER / CONEXIÓN CON EL
    // SERVIDOR" cuando la conexión no devuelve uno.
    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-center justify-center px-4 py-10 md:px-8">
            {
                token ? (
                    <>
                        {/* mientras redirige al home, la cabina sigue "encendida" */}
                        <div className="mx-auto w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 text-center gc-glow-cyan gc-drop-in" aria-hidden="true">
                            <BulbRow className="mb-6" />
                            <p className="gc-pixel gc-blink text-[10px] uppercase text-neon">Cargando...</p>
                        </div>
                        <Redirect to='/home' />
                    </>
                ) :
                    (
                        <div className="mx-auto w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 text-center gc-glow-magenta gc-drop-in">

                            <BulbRow className="mb-6" />

                            <p className="gc-pixel gc-blink text-[10px] uppercase text-neon">Cargando...</p>

                            <h1 className="mt-4 font-display text-5xl uppercase tracking-wide text-destructive [text-shadow:0_0_18px_rgba(255,46,110,0.55)]">Game over</h1>
                            <p className="gc-pixel mt-3 text-[10px] uppercase text-dim">Conexión con el servidor</p>

                            <p className="mt-6 text-sm text-dim">Your account is banned!</p>

                            <a href="/home" className="gc-pixel mt-6 inline-block rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10">Go Home</a>

                        </div>
                    )
            }
        </div>
    )
};
