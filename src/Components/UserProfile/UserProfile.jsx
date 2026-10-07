import bcrypt from 'bcryptjs';



// import { AdvancedImage } from '@cloudinary/react';
import { Cloudinary } from "@cloudinary/url-gen";
// import { Transformation } from "@cloudinary/url-gen";

// // Import required actions.
// import { thumbnail, scale } from "@cloudinary/url-gen/actions/resize";
// import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
// import { sepia } from "@cloudinary/url-gen/actions/effect";
// import { source } from "@cloudinary/url-gen/actions/overlay";
// import { opacity, brightness } from "@cloudinary/url-gen/actions/adjust";
// import { byAngle } from "@cloudinary/url-gen/actions/rotate"

// // Import required qualifiers.
// import { image } from "@cloudinary/url-gen/qualifiers/source";
// import { Position } from "@cloudinary/url-gen/qualifiers/position";
// import { compass } from "@cloudinary/url-gen/qualifiers/gravity";
// import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
// import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";
// import CloudinaryUploadWidget from "./CloudinaryUploadWidget";










import React from 'react'
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2'

import { existsUsername, userFormat, validatedFormat, validatedFunctions, findEmail, editUser } from "./UserProfileHelper";
import { Redirect, useHistory } from "react-router-dom";
import NoWorkResult from "postcss/lib/no-work-result";
import { getUsers, putUser } from "../../redux/actions";
import BulbRow from '../ui/BulbRow';

const CreateUser = () => {
    let actualUser = useSelector(state => state.users.user)
    let dispatch = useDispatch();
    let history = useHistory();
    // let actualUser = {
    //     id: 1,
    //     username: "prueba1",
    //     name: "prueba",
    //     lastname: "prueba",
    //     email: "prueba1@p.com",
    //     password: "$2b$10$5ZZZKdDGg3ZWuenDkHsyKeU9.w25o5bhn0tz3N/XCxXdSRTnsFry.",
    //     profile_pic: "https://play.nintendo.com/images/profile-mk-koopa.27049d38.png",
    //     isBanned: false,
    //     isAdmin: true,
    //     isVerified: true,
    //     createdAt: "2022-09-10T19:15:06.819Z",
    //     Products: []
    // }
    const [user, setUser] = useState(actualUser),
        [userGet, setUserNames] = useState({ userExist: false, usernameExists: false }),
        [disabledBtn, setDisabled] = useState(true),
        [isChange, setChange] = useState(validatedFormat),
        [isSubmit, setIsSubmit] = useState(false),
        [validate, setvalidate] = useState(validatedFormat);

    // let userState = useSelector(state => state.user)


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
        const token = window.sessionStorage.getItem('token');
        token && (user === undefined) && dispatch(getUsers(token));
    }, [user, dispatch])

    useEffect(() => {
        if (Object.values(validate).includes(false) || userGet.usernameExists || userGet.userExist) {
            setDisabled(true)
        } else {
            setDisabled(false)
        }
    }, [user, isChange, userGet.usernameExists])

    // async function handleSubmit(e) {
    //     e.preventDefault()
    //     console.log("🚀 ~ file: UserProfile.jsx ~ line 113 ~ handleSubmit ~ e", e)

    //     if (user !== undefined) {
    //         const response = await existsUsername(user.username);
    //         if (response) {
    //             setUserNames((i) => ({ ...i, usernameExists: true }))
    //             return
    //         }
    //         const getUser = await findEmail(user?.email);
    //         if (getUser) {
    //             setUserNames((i) => ({ ...i, userExist: true }));
    //             return
    //         } else if (!getUser) {
    //             await createNewUser(user)
    //         } else {
    //             setDisabled(true)
    //             setvalidate({
    //                 ...validate,
    //                 email: false
    //             });
    //         }
    //         setChange(validatedFormat);
    //         setUser(userFormat);
    //         setvalidate(validatedFormat);
    //         setDisabled(true)
    //         setIsSubmit(true);
    //     }
    // };


    async function handleSubmit(e) {
        e.preventDefault()
        //manda "user" al back
        await editUser(user)

        //manda "user" a redux
        dispatch(putUser(user))

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Profile Edited!',
            showConfirmButton: true,
            timer: 1500
        })
        history.push("/home");

        // window.location.reload()
    }


    //botón cloudinary
    let [path, setPath] = useState("");
    function showWidget() {

        let widget = window.cloudinary.openUploadWidget({
            cloudName: `vgpf`,
            uploadPreset: `videogamespf`,
            sources: ['local', 'url']
        }, (error, result) => {
            // console.log("----------------------------------------ERROR")
            // console.log(error)
            // console.log("----------------------------------------RESULT")
            // console.log(result.event)
            // console.log(result.info)
            if (!error && result.event === "success") {
                // setPath(result.info.url)
                // user.profile_pic = path
                setUser((i) => ({ ...i, profile_pic: result.info.url }))
            }
        });

        widget.open()
    };




    //comprobación de passwords
    let [oldPassword, setOldPassword] = useState("")
    let [newPassword, setNewPassword] = useState("")
    let [confirmNewPassword, setConfirmNewPassword] = useState("")

    async function handlePasswordChange(e) {

        let oldPass = await bcrypt.compare(oldPassword, user.password)
        let confirmation = validatedFunctions.password(newPassword)
        let newConfirmedPass = "";
        if (oldPass === true) {
            if (newPassword !== "" && confirmNewPassword !== "") {
                if (confirmation) {
                    if (newPassword === confirmNewPassword) {
                        let hashedPassword = bcrypt.hashSync(newPassword, process.env.REACT_APP_KEY_SALT)
                        newConfirmedPass = hashedPassword
                    }
                }
            }
        }
        if (confirmation && newConfirmedPass !== "") {
            user.password = newConfirmedPass
        }
    }
    let [disabledEmail, setDisabledEmail] = useState(true)
    let [disabledOldPassword, setDisabledOldPassword] = useState(true)
    let [disabledNewPassword, setDisabledNewPassword] = useState(true)
    let [disabledConfirmNewPassword, setDisabledConfirmNewPassword] = useState(true)
    let [disabledName, setDisabledName] = useState(true)
    let [disabledLastname, setDisabledLastname] = useState(true)
    let [disabledUsername, setDisabledUsername] = useState(true)

    // let [image, setImage] = useState(false)
    // let imagen;
    // useEffect(()=>{
    //     setImage(true)
    // },[user.profile_pic])

    // ARCADE · PANTALLA DE ARRANQUE: perfil del jugador como cabina de control.
    // Cada campo arranca bloqueado y se "desbloquea" con el rótulo pixel
    // clickeable; el botón de guardar es el "INSERT COIN" de la partida.
    const labelCls = "gc-pixel inline-block cursor-pointer text-[9px] uppercase text-dim transition hover:text-neon"
    const fieldCls = (isBad) => `mt-2 w-full rounded-lg border bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] disabled:cursor-not-allowed disabled:opacity-50 ${isBad ? 'border-destructive/70' : 'border-line focus:border-neon'}`
    const errorCls = "mt-2 block rounded-lg border border-destructive/70 bg-destructive/10 px-4 py-3 text-sm text-destructive"

    return (
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1400px] items-start justify-center px-4 py-10 md:px-8">
            {isSubmit && <Redirect to={'/login'} />}
            <div className="mx-auto w-full max-w-[520px] rounded-xl border-2 border-line bg-cab/90 p-8 gc-glow-magenta gc-drop-in">
                <BulbRow className="mb-6" />

                <p className="gc-pixel text-[10px] uppercase text-magenta">Player profile</p>
                <h3 className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">EDIT YOUR PROFILE</h3>

                <button className="gc-pixel mt-6 w-full rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" onClick={showWidget}>
                    <i className="bi bi-image me-2" aria-hidden="true" />Upload image
                </button>

                <form onSubmit={(e) => handleSubmit(e)} method='post' className="mt-6 space-y-5">
                    <div className="flex justify-center rounded-xl border-2 border-line bg-panel p-4 gc-glow-cyan">
                        {/* FIX: sin `user.profile_pic` (recién cargado o deslogueado)
                            el <img> se renderizaba SIN src → ícono de imagen rota.
                            Ahora, si no hay foto, se muestra una cabina vacía. */}
                        {user?.profile_pic ? (
                            <img src={user?.profile_pic} id={"uploadedImage"} alt={"selectedPic"} onClick={() => setPath("")} className="h-40 w-40 rounded-lg border border-neon object-cover" />
                        ) : (
                            <div className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-void">
                                <i className="bi bi-person-bounding-box text-3xl text-dim" aria-hidden="true" />
                                <span className="gc-pixel text-[8px] uppercase text-dim">Sin foto</span>
                            </div>
                        )}
                    </div>

                    {/* E-MAIL */}
                    <div>
                        <small onClick={(e) => setDisabledEmail(!disabledEmail)}
                            htmlFor="exampleInputEmail1"
                            className={labelCls}><i className="bi bi-pencil me-2" aria-hidden="true" />Click here to edit e-mail
                        </small>

                        <input type="email"
                            onChange={e => handleChange(e)}
                            // value={}
                            name="email"
                            id="email"
                            className={fieldCls(isChange.email && !validate.email)}
                            placeholder={`${actualUser && actualUser.email}`}
                            required=""

                            disabled={disabledEmail} />

                        {isChange.email && !validate.email && <small className={errorCls}>Email Address is incorrect</small>}
                        {userGet.userExist && <small className={errorCls}>Email Address already exists</small>}
                    </div>

                    {/* OLD PASSWORD */}
                    {/* <div className="relative z-0 mb-6 w-full group">
                        <small onClick={(e) => setDisabledOldPassword(!disabledOldPassword)} htmlFor="password" className="form-label">Old Password</small><br />

                        <input type="password"
                            onChange={e => { setOldPassword(e.target.value); handlePasswordChange(e) }}
                            value={oldPassword}
                            name="oldpassword" id="password"
                            className={`form-control ${isChange.password && !validate.password && "is-invalid"}`}
                            placeholder="Old Password"
                            required=""
                            disabled={disabledOldPassword} />

                        {isChange.password && !validate.password && <small>Password Must be Contain: number, symbol, uppercase and 8 digits</small>}
                    </div> */}

                    {/* NEW PASSWORD */}
                    {/* <div className="relative z-0 mb-6 w-full group">
                        <small onClick={(e) => setDisabledNewPassword(!disabledNewPassword)} htmlFor="password" className="form-label">New Password</small><br />

                        <input type="password"
                            onChange={e => { setNewPassword(e.target.value); handlePasswordChange(e) }}
                            value={newPassword}
                            name="password"
                            id="password"
                            className={`form-control ${isChange.password && !validate.password(newPassword) && "is-invalid"}`}
                            placeholder="New Password"
                            required=""
                            disabled={disabledNewPassword} />

                        {isChange.password && !validate.password && <small>Password Must be Contain: number, symbol, uppercase and 8 digits</small>}
                    </div> */}

                    {/* CONFIRM NEW PASSWORD */}
                    {/* <div className="relative z-0 mb-6 w-full group">
                        <small onClick={(e) => setDisabledConfirmNewPassword(!disabledConfirmNewPassword)} htmlFor="confirm password" className="form-label">Confirm New Password</small>

                        <input className={`form-control ${isChange.cPassword && user.cPassword !== user.password && "is-invalid"}`}
                            type="password"
                            onChange={e => { setConfirmNewPassword(e.target.value); handlePasswordChange(e) }}
                            value={confirmNewPassword}
                            name="cPassword"
                            id="cPassword"
                            placeholder="Confirm New password"
                            required=""
                            disabled={disabledConfirmNewPassword} />

                        {isChange.cPassword && user.cPassword !== user.password && <small>Passwords don't match</small>}
                    </div> */}

                    {/* NAME */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <small onClick={(e) => setDisabledName(!disabledName)} htmlFor="name" className={labelCls}><i className="bi bi-pencil me-2" aria-hidden="true" />Click here to edit name</small>

                            <input className={fieldCls(isChange.name && !validate.name)}
                                type="text"
                                onChange={e => handleChange(e)}
                                // value={actualUser && actualUser.name}
                                name="name"
                                id="name"
                                placeholder={`${actualUser && actualUser.name}`}
                                required=""
                                disabled={disabledName} />

                            {isChange.name && !validate.name && <small className={errorCls}>Characters Invalid</small>}
                        </div>

                        {/* LASTNAME */}
                        <div>
                            <small onClick={(e) => setDisabledLastname(!disabledLastname)} htmlFor="lastname" className={labelCls}><i className="bi bi-pencil me-2" aria-hidden="true" />Click here to edit lastname</small>

                            <input className={fieldCls(isChange.lastname && !validate.lastname)}
                                type="text"
                                onChange={e => handleChange(e)}
                                // value={actualUser && actualUser.lastname}
                                name="lastname"
                                id="lastname"
                                placeholder={`${actualUser && actualUser.lastname}`}
                                required=""
                                disabled={disabledLastname} />

                            {isChange.lastname && !validate.lastname && <small className={errorCls}>Characters Invalid</small>}
                        </div>

                        {/* USERNAME */}
                        <div className="md:col-span-2">
                            <small onClick={(e) => setDisabledUsername(!disabledUsername)} htmlFor="username" className={labelCls}><i className="bi bi-pencil me-2" aria-hidden="true" />Click here to edit username</small>

                            <input type="text"
                                onChange={(e) => handleChange(e)}
                                // value={actualUser && actualUser.username}
                                name="username"
                                id="username"
                                className={fieldCls(isChange.username && !validate.username)}
                                placeholder={`${actualUser && actualUser.username}`}
                                required=""
                                disabled={disabledUsername} />

                            {isChange.username && !validate.username && <small className={errorCls}>Username Invalid</small>}
                            {userGet.usernameExists && <small className={errorCls}>Username already exists</small>}
                        </div>
                    </div>
                    {/* <div>All fields are required</div> */}

                    {/* SUBMIT BUTTON */}
                    <button type="submit" className="gc-pixel w-full rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110">Insert coin</button>
                </form>
            </div>
        </div>
    )
};

export default CreateUser;
