import React, { useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'
import BulbRow from '../ui/BulbRow';

function Restore() {
    let history = useHistory();
    let [email, setEmail] = useState()

    function handleChange(e) {
        e.preventDefault()
        setEmail(e.target.value)
    }
    async function handleSubmit(e) {
        e.preventDefault()
        await axios.get(`${process.env.REACT_APP_URL}restore/?email=${email}`)
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Please, check you e-mail and Follow the Link.',
            showConfirmButton: true,
            timer: 1500
        })
        history.push("/home")
    }


    let [disabledEmail, setDisabledEmail] = useState(false)




    // ARCADE · PANTALLA DE ARRANQUE: recuperación de contraseña como "CONTINUE?",
    // misma cabina de login con rótulo pixel y botón de envío en magenta.
    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-center justify-center px-4 py-10 md:px-8">
            {/* {isSubmit && <Redirect to={'/login'} />} */}
            <div className="mx-auto w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 gc-glow-magenta gc-drop-in">

                <BulbRow className="mb-6" />

                <p className="gc-pixel text-[10px] uppercase text-magenta">Continue?</p>
                <h1 id="pleaseLogIn" className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">RESTORE PASSWORD</h1>
                <p className="mt-2 text-sm text-dim">Te enviamos un enlace a tu correo para volver a jugar.</p>

                <form onSubmit={(e) => handleSubmit(e)} method='post' className="mt-6 space-y-5">

                    {/* E-MAIL */}
                    <div>
                        <small onClick={(e) => setDisabledEmail(!disabledEmail)}
                            htmlFor="exampleInputEmail1"
                            className="gc-pixel text-[9px] uppercase text-dim">Put your registered e-mail
                        </small>

                        <input type="email"
                            onChange={e => handleChange(e)}
                            value={email}
                            name="email"
                            id="email"
                            className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] disabled:opacity-50"
                            placeholder={`your@mail.com`}
                            required=""
                            disabled={disabledEmail} />

                        <button className="gc-pixel mt-4 w-full rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110">Send</button>

                        <small className="mt-3 block text-sm text-destructive" hidden={true}>Email Address is incorrect</small>

                        <small className="block text-sm text-destructive" hidden={true}>Email Address already exists</small>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default Restore
