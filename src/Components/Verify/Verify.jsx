import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { verifyEmail } from './VerifyHelper';
import BulbRow from '../ui/BulbRow';

export default function Verify() {
    const { email } = useParams(),
        [response, setResponse] = useState();

    useEffect(() => {
        (async () => {
            setResponse(await verifyEmail(email))
        })()
    }, []);

    // ARCADE · PANTALLA DE ARRANQUE: verificación de email como cabina de
    // "READY / GAME OVER" según el resultado, con píldora pixel y CTA magenta.
    const panelLink = "gc-pixel inline-block rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110"

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-center justify-center px-4 py-10 md:px-8">
            <div className="mx-auto w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 text-center gc-drop-in">

                <BulbRow className="mb-6" />

                <p className="gc-pixel gc-blink text-[10px] uppercase text-magenta">Verifying email</p>
                <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">VERIFY</h1>

                <div className="mt-6 space-y-4">
                    {response && response.message === undefined && (
                        <>
                            <p className="gc-pixel text-[11px] uppercase text-credit">READY</p>
                            <p className="text-sm text-dim">Verification has been successful</p>
                            <Link type="button" className={panelLink} to={'/login'}>Login</Link>
                        </>
                    )}

                    {response && response.message && (
                        <>
                            <p className="gc-pixel text-[11px] uppercase text-destructive">Game over</p>
                            <p className="text-sm text-dim">Email adress are invalid</p>
                            <Link type="button" className={panelLink} to={'/create_user'}>Create one</Link>
                        </>
                    )}

                    {response === false && (
                        <>
                            <p className="gc-pixel text-[11px] uppercase text-bulb">Already verified</p>
                            <p className="text-sm text-dim">Email adress already verificated</p>
                            <Link type="button" className={panelLink} to={'/login'}>Login</Link>
                        </>
                    )}

                    {response === undefined && (
                        <p className="gc-pixel gc-blink text-[10px] uppercase text-neon">Loading...</p>
                    )}
                </div>

            </div>
        </div>
    )
};
