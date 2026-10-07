import React from 'react'
import { useState, useEffect } from "react";
import { existsUsername, userFormat, validatedFormat, validatedFunctions, findEmail, createNewUser } from "./CreateUserHelper";
import { Redirect, useHistory } from "react-router-dom";
import BulbRow from '../ui/BulbRow';

const CreateUser = () => {
  const [user, setUser] = useState(userFormat),
    [userGet, setUserNames] = useState({ userExist: false, usernameExists: false }),
    [disabledBtn, setDisabled] = useState(true),
    [isChange, setChange] = useState(validatedFormat),
    [isSubmit, setIsSubmit] = useState(false),
    [validate, setvalidate] = useState(validatedFormat);

  let history = useHistory();

  function handleChange(e) {
    setUserNames((i) => ({
      ...i, userExist: false, usernameExists: false
    }));
    setChange({
      ...isChange,
      [e.target.id]: true
    });
    setUser({
      ...user,
      [e.target.id]: e.target.value
    });
    if (e.target.id === 'username') {
      setvalidate({
        ...validate,
        [e.target.id]: validatedFunctions.username(e.target.value)
      })
    } else if (e.target.id !== 'cPassword') {
      setvalidate({
        ...validate,
        [e.target.id]: validatedFunctions[e.target.id](e.target.value)
      })
    }
  };

  useEffect(() => {
    if (Object.values(validate).includes(false) || userGet.usernameExists || userGet.userExist) {
      setDisabled(true)
    } else {
      setDisabled(false)
    }
  }, [user, isChange, userGet.usernameExists])

  async function handleSubmit(e) {
    e.preventDefault()
    const response = await existsUsername(user.username);
    if (response) {
      setUserNames((i) => ({ ...i, usernameExists: true }))
      return
    }
    const getUser = await findEmail(user.email);
    if (getUser.user !== undefined && getUser.user === null) {
      await createNewUser(user);
    } else {
      setUserNames((i) => ({ ...i, userExist: true }));
      setDisabled(true);
      return;
    }
    setChange(validatedFormat);
    setUser(userFormat);
    setvalidate(validatedFormat);
    setDisabled(true)
    setIsSubmit(true);
  };

  // ARCADE · PANTALLA DE ARRANQUE: alta de jugador en una cabina más alta
  // (más campos), rótulo pixel, errores en rojo neón y CTA "INSERT COIN".
  const fieldCls = (isBad) => `mt-2 w-full rounded-lg border bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] ${isBad ? 'border-destructive/70' : 'border-line focus:border-neon'}`
  const errorCls = "mt-2 block rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive"
  const labelCls = "gc-pixel text-[9px] uppercase text-dim"

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-start justify-center px-4 py-10 md:px-8">
      {isSubmit && <Redirect to={'/login'} />}

      <div className="mx-auto w-full max-w-[520px] rounded-xl border-2 border-line bg-cab/90 p-8 gc-glow-magenta gc-drop-in">

        <BulbRow className="mb-6" />

        <p className="gc-pixel text-[10px] uppercase text-magenta">New player</p>
        <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">REGISTER</h1>

        <form onSubmit={(e) => handleSubmit(e)} method='post' className="mt-6 space-y-5">

          {/* E-MAIL */}
          <div>
            <small htmlFor="exampleInputEmail1" className={labelCls}>Email address</small>
            <input type="email" onChange={e => handleChange(e)} value={user.email} name="email" id="email" className={fieldCls(isChange.email && !validate.email)} placeholder="your@email.com" required="" />
            {isChange.email && !validate.email && <small className={errorCls}>Email Address is incorrect</small>}
            {userGet.userExist && <small className={errorCls}>Email Address already exists</small>}
          </div>

          {/* PASSWORD */}
          <div>
            <small htmlFor="password" className={labelCls}>Password</small>
            <input type="password" onChange={e => handleChange(e)} value={user.password} name="password" id="password" className={fieldCls(isChange.password && !validate.password)} placeholder="Your Password" required="" />
            {isChange.password && !validate.password && <small className={errorCls}>Password Must be Contain: number, symbol, uppercase and 8 digits</small>}
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <small htmlFor="confirm password" className={labelCls}>Confirm Password</small>
            <input className={fieldCls(isChange.cPassword && user.cPassword !== user.password)} type="password" onChange={e => handleChange(e)} value={user.cPassword} name="cPassword" id="cPassword" placeholder="Confirm password" required="" />
            {isChange.cPassword && user.cPassword !== user.password && <small className={errorCls}>Passwords don't match</small>}
          </div>

          {/* NAME / LASTNAME / USERNAME */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <small htmlFor="name" className={labelCls}>Name</small>
              <input className={fieldCls(isChange.name && !validate.name)} type="text" onChange={e => handleChange(e)} value={user.name} name="name" id="name" placeholder="First name" required="" />
              {isChange.name && !validate.name && <small className={errorCls}>Characters Invalid</small>}
            </div>
            <div>
              <small htmlFor="lastname" className={labelCls}>Lastname</small>
              <input className={fieldCls(isChange.lastname && !validate.lastname)} type="text" onChange={e => handleChange(e)} value={user.lastname} name="lastname" id="lastname" placeholder="Last name" required="" />
              {isChange.lastname && !validate.lastname && <small className={errorCls}>Characters Invalid</small>}
            </div>
            <div className="md:col-span-2">
              <small htmlFor="username" className={labelCls}>Username</small>
              <input type="text" onChange={(e) => handleChange(e)} value={user.username} name="username" id="username" className={fieldCls(isChange.username && !validate.username)} placeholder="Username" required="" />
              {isChange.username && !validate.username && <small className={errorCls}>Username Invalid</small>}
              {userGet.usernameExists && <small className={errorCls}>Username already exists</small>}
            </div>
          </div>

          <p className="gc-pixel text-[9px] uppercase text-dim">All fields are required</p>

          <button type="submit" className="gc-pixel w-full rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40" disabled={disabledBtn}>Insert coin</button>
        </form>

        <button onClick={() => history.push("/login")} type="text" className="gc-pixel mt-4 w-full rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10">Retire coin</button>

      </div>
    </div>
  )
};

export default CreateUser;
