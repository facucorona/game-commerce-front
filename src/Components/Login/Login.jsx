import React, { useEffect } from 'react'
import { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useDispatch } from "react-redux";
import gLogo from './btn_google.svg'
import { postUsers } from "./LoginHelper";
import { findEmail } from "../CreateUser/CreateUserHelper";
import { useSelector } from "react-redux";
import { getUsers } from "../../redux/actions";
import BulbRow from '../ui/BulbRow';
const { REACT_APP_URL } = process.env;

const Login = () => {
  const [user, setUser] = useState({ username: "", password: "" }),
    [userGet, setUserGet] = useState({ userNExists: false, failedLog: false, userBan: false, isVerified: false }),
    [disabled, setDisabled] = useState(true),
    dispatch = useDispatch()

  const { userAuth } = useSelector(state => {
    return { userAuth: state.users }
  })

  useEffect(() => {
    if (user.username && user.password) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [user])

  function handleChange(e) {
    setUser({ ...user, [e.target.id]: e.target.value })
    if (e.target.id === 'username') {
      setUserGet((i) => ({ ...i, userNExists: false, userBan: false, isVerified: false }))
    } else {
      setUserGet((i) => ({ ...i, failedLog: false }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const userExist = await findEmail(user.username);
    if (userExist.user === null) {
      setUserGet((i) => ({ ...i, userNExists: true }));
    }
    else if (userExist.isBanned) {
      setUserGet((i) => ({ ...i, userBan: true }));
      // } else if (!userExist.isVerified) {
      //   setUserGet((i) => ({ ...i, isVerified: true }));
    } else {
      const info = await postUsers(user);
      info.message?.search('login') && setUserGet((i) => ({ ...i, failedLog: true }));
      info.token && dispatch(getUsers(info.token)) && window.sessionStorage.setItem('token', info.token);
    }
  }

  // ARCADE · PANTALLA DE ARRANQUE: cabina centrada con rótulo pixel "INSERT COIN",
  // marco violeta con neón magenta, campos en panel oscuro y CTA magenta.
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-center justify-center px-4 py-10 md:px-8">
      {userAuth.user && <Redirect to='/home' />}

      <div className="mx-auto w-full max-w-[460px] rounded-xl border-2 border-line bg-cab/90 p-8 gc-glow-magenta gc-drop-in">

        <BulbRow className="mb-6" />

        <p className="gc-pixel text-[10px] uppercase text-magenta">Insert coin</p>
        <h1 id="pleaseLogIn" className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">LOGIN</h1>
        <p className="mt-2 text-sm text-dim">Ingresa tu email y contraseña para volver a la sala.</p>

        <form onSubmit={(e) => handleSubmit(e)} className="mt-6 space-y-5">

          {/* EMAIL */}
          <div>
            <label htmlFor="exampleInputEmail1" className="gc-pixel text-[9px] uppercase text-dim">Email address</label>
            <input
              type="email"
              id="username"
              className={`mt-2 w-full rounded-lg border bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] ${userGet.userNExists || userGet.userBan ? 'border-destructive/70' : 'border-line focus:border-neon'}`}
              aria-describedby="emailHelp"
              placeholder="example@examplemail.com"
              onChange={handleChange}
              value={user.username}
              name="username"
            />
            {userGet.userNExists && <p className="mt-2 rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">Email address invalid</p>}
            {userGet.userBan && <p className="mt-2 rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">Email address are banned</p>}
            {userGet.isVerified && <p className="mt-2 rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">Email address not verified</p>}
            <small id="emailHelp" className="mt-2 block text-xs text-dim">We'll never share your email with anyone else.</small>
          </div>

          {/* PASSWORD */}
          <div>
            <label htmlFor="exampleInputPassword1" className="gc-pixel text-[9px] uppercase text-dim">Password</label>
            <input
              type="password"
              id="password"
              className={`mt-2 w-full rounded-lg border bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] ${userGet.failedLog ? 'border-destructive/70' : 'border-line focus:border-neon'}`}
              onChange={handleChange}
              value={user.password}
              name="password"
            />
            {userGet.failedLog && <p className="mt-2 rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive">Invalid Password</p>}
            <Link className="gc-pixel mt-3 inline-block text-[9px] uppercase text-neon transition hover:text-bulb gc-glow-cyan" to="/restore">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <input
            disabled={disabled}
            type="submit"
            className="gc-pixel w-full rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            value="Login"
          />
        </form>

        <div className="mt-6 border-t border-line/60 pt-6 text-center">
          <p className="gc-pixel text-[9px] uppercase text-dim">¿No tenés cuenta?</p>
          <Link to="/create_user" className="gc-pixel mt-4 inline-block rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110">
            Create one!
          </Link>

          <p className="gc-pixel my-4 text-[9px] uppercase text-dim">O</p>

          <a className="gc-pixel flex w-full items-center justify-center gap-3 rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" href={`${REACT_APP_URL}login/auth/google`}>
            <img src={gLogo} id='' alt='googleButton' className="h-6 w-6 rounded-full" />
            <span>Sign in with google</span>
          </a>
        </div>

      </div>
    </div>
  )
}

export default Login
