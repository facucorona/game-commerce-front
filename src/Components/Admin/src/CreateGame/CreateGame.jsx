import React, { useEffect } from "react"
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

import { getGenres, getPlatforms, Post_Game } from "../../../../redux/actions";
import { Link } from "react-router-dom";
//import {   useNavigate, NavLink } from 'react-router-dom';

function validate(input) {
    let error = {};
    if (!input.name) error.name = "Title required"
    if (input.name.length < 4) error.name = "Title needs at least 4 characters"
    if (!input.description) error.description = "Description required"
    if (input.description.length < 20) error.description = "Description needs at least 20 characters"
    if (!input.background_image) error.background_image = "an image is required"
    //if(!input.rating || input.rating < 0 || input.rating > 100)error.rating = "Must rate the product with a number between 1 and 100"
    if (!input.price || input.price <= 0) error.price = "Must put a price with a value higher than 0"
    if (!input.genres.length) error.genres = "Must select at least one Genre"
    if (!input.released) error.released = "Must select the release date of the product"
    if (!input.platforms.length) error.platforms = "Must select at least one platform"
    return error
};

// PATRÓN ARCADE: alta de juego = "cabina nueva" → rótulo, panel de máquina
// centrado con etiquetas pixel, inputs en bg-panel con foco cian, chips
// descartables, botón magenta de alta y botón de carga de capturas.

export default function PostGame() {
    let history = useHistory();
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const [activeSubmit, SetactiveSubmit] = useState(true);
    const genres = useSelector((state) => state.genres);
    const platform = useSelector((state) => state.platforms);
    const [error, setError] = useState({});
    let [screenshots, setScreenshots] = useState([]);
    const [input, setInput] = useState({
        name: "",
        description: "",
        background_image: "",
        released: "",
        price: "",
        //rating:"",
        //isDisabled:false,
        platforms: [],
        genres: [],
        // screenshots: []
    });
    useEffect(() => {
        dispatch(getGenres())
        dispatch(getPlatforms())
        const llaves = Object.keys(input)
        for (const key of llaves) {
            if (input[key] && !error[key]) { //si hay input y no hay errores --false
                SetactiveSubmit(false)
            } else {
                SetactiveSubmit(true)
                break;
            };
        };
    }, [input, error])

    function handlersubmit(e) {
        e.preventDefault();

        dispatch(Post_Game({ ...input, screenshots: screenshots }));

        /* ver si uso un dispatch para volver a cargar los juegos */
        //navigate("/home")
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Game Created!!',
            showConfirmButton: false,
            timer: 1500
        })
        history.push("/home")
    };
    function handleChange(e) {
        //console.log(input)
        setInput({
            ...input,
            [e.target.name]: e.target.value,
        });
        setError(validate({
            ...input,
            [e.target.name]: e.target.value
        }))
        //console.log(input)
        //console.log(error)
    };
    function handleSelectGenres(e) {
        if (!input.genres.includes(e.target.value)) //evitar repetidos
            setInput({
                ...input,
                genres: [...input.genres, e.target.value]
            });
        setError(validate({
            ...input,
            genres: [...input.genres, e.target.value]
        }));
        //console.log(e.target.value)
        //console.log(input.genres)
    }
    function handleSelectPlat(e) {
        if (!input.platforms.includes(e.target.value)) //evitar repetidos
            setInput({
                ...input,
                platforms: [...input.platforms, e.target.value]
            });
        setError(validate({
            ...input,
            platforms: [...input.platforms, e.target.value]
        }));
        //console.log(e.target.value)
        //console.log(input.platforms)
    };
    function handleDeleteGenre(e) {
        setInput({
            ...input,
            genres: input.genres.filter(genres => genres !== e)
        })
    };
    function handleDeletePlat(e) {
        setInput({
            ...input,
            platforms: input.platforms.filter(platform => platform !== e)
        })
    };

    ////////////////////////////
    // //botón cloudinary
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
                // user.profile_pic = path+
                setScreenshots((i) => ([...i, result.info.url]))
                // setInput({ ...input, screenshots: screenshots })

            }
        });

        widget.open()
    };


    /////////////////////////////

    return (
        <div className="mx-auto w-full max-w-[1400px]">
            <p className="gc-pixel text-[10px] uppercase text-magenta">Productos</p>
            <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Add a New Game</h2>
            <div className="mt-6 flex justify-center">
                <div className="w-full max-w-[520px] rounded-xl border-2 border-line bg-cab p-5">
                    <form onSubmit={(e) => handlersubmit(e)}>
                        {/*                 <p>Add a new Game:</p>
 */}                <div className="mb-3">
                            {/*  <label  className="form-label">Name</label> */}
                            <input type="text" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="title of the game..." onChange={handleChange} value={input.name} name="name" />
                            {/* <small className="form-text">We'll never share your email with anyone else.</small> */}
                            {error.name ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.name}</label> : null}
                        </div>
                        <div className="mb-3">
                            {/*  <label  className="form-label">Description</label> */}
                            <input type="text" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="a brief summary..." onChange={handleChange} value={input.description} name="description" />
                            {error.description ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.description}</label> : null}
                        </div>
                        <div className="mb-3">
                            {/* <label  className="form-label">Image</label> */}
                            <input type="text" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="an image url..." onChange={handleChange} value={input.background_image} name="background_image" />
                            {error.background_image ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.background_image}</label> : null}
                            {
                                input.background_image && (<img className="mt-3 h-auto w-60 rounded-lg border border-line" src={input.background_image} id={input.background_image} alt="" />)
                            }
                        </div>
                        <div className="mb-3">
                            {/* <label  className="form-label">Release Date</label> */}
                            <input type="date" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="Realese date..." onChange={handleChange} value={input.released} name="released" />
                            {error.released ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.released}</label> : null}
                        </div>
                        <div className="mb-3">
                            {/* <label  className="form-label">Rating</label> */}
                            {/* <input type="number" className="form-control" placeholder="Rating of the game..." onChange={handleChange} min="1" max="100" value={input.rating} name="rating" />
                    {error.rating ? <label className={style.labelError}>{error.rating}</label> : null} */}
                        </div>
                        <div className="mb-3">
                            {/* <label  className="form-label">Price</label> */}
                            <input type="number" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="Price..." onChange={handleChange} min="1" max="100" value={input.price} name="price" />
                            {error.price ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.price}</label> : null}
                        </div>
                        <div className="mb-3">
                            {/*  <label  className="form-label">Genres</label> */}
                            <select placeholder="Select at least one Genre..." className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" name="genres" value={input.genres} onChange={(e) => handleSelectGenres(e)}>
                                <option>Select Genres</option >
                                {genres && genres.map((e, pos) => { return <option id={pos} key={e.id} value={e.genres}>{e.name}</option> })}
                            </select>
                            {error.genres ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">Select a Genre</label> : null}
                        {input.genres.map((genre, pos) =>
                            <div className="mt-2 flex flex-col items-center">
                                <p id={pos} onClick={() => handleDeleteGenre(genre)} className="gc-pixel my-1 cursor-pointer text-[9px] uppercase text-ink">{genre}<i className="bi bi-x ml-2 text-destructive" aria-hidden="true" /></p>
                                {/* <button onClick={()=>handleDeleteGenre(genre)}>X</button> */}
                            </div>
                        )}
                        </div>

                        <div className="mb-3">
                            {/* <label  className="form-label">Platform</label> */}
                            <select placeholder="Select at least one Platform" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" name="platforms" value={input.platforms} onChange={(e) => handleSelectPlat(e)}>
                                <option>Select Platforms</option>
                                {platform && platform.map((consola, pos) => {
                                    return <option id={consola.id} key={consola.id} value={consola.platforms}>{consola.name}</option>
                                })}
                            </select>
                            {error.platforms ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.platforms}</label> : null}
                        </div>
                        {input.platforms.map((plataforma, pos) =>
                            <div className="mt-2 flex flex-col items-center">
                                <p id={pos} onClick={() => handleDeletePlat(plataforma)} className="gc-pixel my-1 cursor-pointer text-[9px] uppercase text-ink">{plataforma}<i className="bi bi-x ml-2 text-destructive" aria-hidden="true" /></p>
                            </div>
                        )}

                        {/* <button type="submit" disabled={activeSubmit}>Create!!</button> */}
                        {/* <Link to="/home"> */}
                        <button type="submit" className="gc-pixel mt-4 rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110" disabled={activeSubmit}>
                            Create
                        </button>
                    </form>
                    <div className="mt-4 w-full">
                        <button className="gc-pixel w-full rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" onClick={showWidget} >
                          <i className="bi bi-cloud-arrow-up mr-2" aria-hidden="true" />Upload Screenshot
                        </button>
                        <div className="mt-3 flex flex-wrap gap-3">
                        {screenshots?.map(s => {
                            return <img className="h-24 w-36 cursor-pointer rounded-lg border border-line object-cover transition hover:border-neon" src={s} id={s} alt={"selectedPic"} onClick={() => {
                                setScreenshots(screenshots.filter((scr) => scr != s))
                            }} />

                        })}
                        </div>
                    </div>
                    {/* </Link> */}
                    {/* //botón cloudinary */}
                </div>
            </div>
        </div >
    )
};
