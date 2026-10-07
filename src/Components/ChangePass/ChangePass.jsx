import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom';
import bcrypt from 'bcryptjs'
import Swal from 'sweetalert2'
import { useHistory } from 'react-router-dom'
import { existsUsername, userFormat, validatedFormat, validatedFunctions} from "../CreateUser/CreateUserHelper";
import BulbRow from '../ui/BulbRow';

function ChangePass() {
    let [disabledNewPassword, setDisabledNewPassword] = useState(false)
    let [disabledConfirmNewPassword, setDisabledConfirmNewPassword] = useState(true)
    let [confirmNewPassword, setConfirmNewPassword] = useState("")
    let [newPassword, setNewPassword] = useState("")
    let [submit, setSubmit] = useState(true);


    let history = useHistory();
    let { id, token } = useParams();
    // console.log("🚀 ~ file: ChangePass.jsx ~ line 7 ~ ChangePass ~ id", id)
    // console.log("🚀 ~ file: ChangePass.jsx ~ line 7 ~ ChangePass ~ token", token)

    let [isChange, setChange] = useState(validatedFormat)

    async function handleSubmit(e) {
        e.preventDefault()

        if (confirmNewPassword === newPassword) {
            let salt = parseInt(process.env.REACT_APP_KEY_SALT)
            let hashedPass = await bcrypt.hash(newPassword, salt)
            axios.put(`${process.env.REACT_APP_URL}restore/newpassword/${id}/${token}`, { newPassword: hashedPass })
        }
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Password Changed!',
            showConfirmButton: false,
            timer: 1500
        })
        history.push("/home")
    }
    let [validate, setValidate] = useState(false)

    useEffect(()=>{

        if(validatedFunctions.password(newPassword)){
            setDisabledConfirmNewPassword(false)
            setValidate(true)
        }
        if(!(validatedFunctions.password(newPassword))){
            setValidate(false)
        }
        if(newPassword !== "" && confirmNewPassword !== ""){
            if(newPassword === confirmNewPassword){
                setSubmit(false)
            }
        }

    },[newPassword, confirmNewPassword])

    function handlePasswordChange(e){
        e.preventDefault();
        if(e.target.name==="password"){
            setNewPassword(e.target.value)
        }
        if(e.target.name==="cPassword"){
            setConfirmNewPassword(e.target.value)
        }
        }







    // ARCADE · PANTALLA DE ARRANQUE: "nueva contraseña" como cabina de reinicio
    // de partida, rótulo pixel y dos campos con el primero bloqueado.
    const fieldCls = (isBad) => `mt-2 w-full rounded-lg border bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] ${isBad ? 'border-destructive/70' : 'border-line focus:border-neon'}`

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-center justify-center px-4 py-10 md:px-8">
            {/* {isSubmit && <Redirect to={'/login'} />} */}
            <div className="mx-auto w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 gc-glow-magenta gc-drop-in">

                <BulbRow className="mb-6" />

                <p className="gc-pixel text-[10px] uppercase text-magenta">Continue</p>
                <h1 id="pleaseLogIn" className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">RESTORE PASSWORD</h1>
                <p className="mt-2 text-sm text-dim">Elegí una nueva clave para tu partida.</p>

                <form onSubmit={(e) => handleSubmit(e)} method='post' className="mt-6 space-y-5">

                    {/* NEW PASSWORD */}
                    <div>
                        <small htmlFor="password" className="gc-pixel text-[9px] uppercase text-dim">New Password</small>

                        {/* <input type="password" onChange={e => handleChange(e)} value={user.password} name="password" id="password" className={form-control ${isChange.password && !validate.password && "is-invalid"}} placeholder="Your Password" required="" /><br /><br />
    //     {isChange.password && !validate.password && <small className="inputLabel">Password Must be Contain: number, symbol, uppercase and 8 digits</small>} */}

                        <input type="password"
                            onChange={e => handlePasswordChange(e)}
                            // value={newPassword}
                            name="password"
                            id="password"
                            className={fieldCls(!validate)}
                            placeholder="New Password"
                            required=""
                             />

                        {!validate && (<small className="mt-2 block rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">Password Must be Contain: number, symbol, uppercase and 8 digits</small>)}
                    </div>

                    {/* CONFIRM NEW PASSWORD */}
                    <div>
                        <small htmlFor="confirm password" className="gc-pixel text-[9px] uppercase text-dim">Confirm New Password</small>

                        <input className={fieldCls(newPassword !== confirmNewPassword)}
                            type="password"
                            onChange={e => handlePasswordChange(e)}
                            // value={confirmNewPassword}
                            name="cPassword"
                            id="cPassword"
                            placeholder="Confirm New password"
                            required=""
                            disabled={!validate} />

                        {newPassword !== confirmNewPassword && <small className="mt-2 block rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">Passwords don't match</small>}
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button disabled={submit} type="submit" className="gc-pixel w-full rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">Insert coin</button>
                </form>
            </div>
        </div>
    //     <div className="relative z-0 mb-6 w-full group">
    //     <small htmlFor="password" className="form-label inputLabel">Password</small><br />
    //     <input type="password" onChange={e => handleChange(e)} value={user.password} name="password" id="password" className={form-control ${isChange.password && !validate.password && "is-invalid"}} placeholder="Your Password" required="" /><br /><br />
    //     {isChange.password && !validate.password && <small className="inputLabel">Password Must be Contain: number, symbol, uppercase and 8 digits</small>}
    //   </div>
    )
}

export default ChangePass
