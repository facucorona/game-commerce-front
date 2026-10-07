import React, {useEffect} from "react"
import {useState} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {getGenres, getPlatforms, Edit_Game, getAllProducts, clear}  from "../../../../redux/actions";
import Swal from 'sweetalert2'

function validate(input){
    let error={};
    if(!input.name || input.name.length < 4) error.name="A Tittle required with at least 4 characters"
    if(input.description.length < 20) error.description ="A Description is required with at least 20 characters"
    if(!input.description) error.description="Description is required"
    if(!input.background_image) error.background_image="an image is required"
    //if(!input.rating || input.rating < 0 || input.rating > 100)error.rating = "Must rate the product with a number between 1 and 100"
    if(!input.price || input.price <= 0 )error.price = "Must put a price with a value higher than 0"
    if(!input.genres.length) error.genres="Must select at least one Genre"
    if(!input.released) error.released="Must select the release date of the product"
    if(!input.platforms.length) error.platforms="Must select at least one platform"
    return error
};

function getPayload(game,input){
    let payload = {}
    payload.id = game.id
    //slug : game.name.split(' ').join('-').toLowerCase(),
    if (input.name !== game.name) payload.name =  input.name;
    if(input.name !== game.name) payload.slug = input.name.split(' ').join('-').toLowerCase(); 
    if (input.isDisabled !== game.isDisabled) payload.isDisabled =  input.isDisabled;
    if (input.released !== game.released) payload.released =  input.released;
    if (input.description !== game.description) payload.description =  input.description;
    if (input.background_image !== game.background_image) payload.background_image = input.background_image;
    //if (''+input.rating !== ''+game.rating) payload.rating =  input.rating;
    if (''+input.price !== ''+game.price) payload.price =  input.price;
    let gameGenres = game.genres.map(e => e.name);
    const array2Sorted = gameGenres.slice().sort();
    const array1Sorted = input.genres.slice().sort();
    if (array1Sorted.length !== array2Sorted.length || array1Sorted.every((value, index) => value !== array2Sorted[index])){
        payload.addGenre = [];
        payload.rmvGenre = [];
        input.genres.forEach((e) => {
            if (!gameGenres.includes(e)) payload.addGenre.push(e);
        });
        gameGenres.forEach((e) => {
            if (!input.genres.includes(e)) payload.rmvGenre.push(e);
        });
    }
    let gamePlatforms = game.platforms.map(e => e.name);
    const plat2Sorted = gamePlatforms.slice().sort();
    const plat1Sorted = input.platforms.slice().sort();
    if (plat1Sorted.length !== plat2Sorted.length || plat1Sorted.every((value, index) => value !== plat2Sorted[index])){
        payload.addPlat = [];
        payload.rmvPlat = [];
        input.platforms.forEach((e) => {
            if (!gamePlatforms.includes(e)) payload.addPlat.push(e);
        });
        gamePlatforms.forEach((e) => {
            if (!input.platforms.includes(e)) payload.rmvPlat.push(e);
        });
    }
    return payload;
}

// PATRÓN ARCADE: "editor de cabina" → rótulo + botón Go Back (tecla secundaria),
// formulario dentro de un panel de máquina con etiquetas pixel, inputs en
// bg-panel con foco cian, chips de género/plataforma y CTA magenta "EDIT".
// NOTA: el `style={{display: display}}` del aviso se mantiene inline porque
// `display` es un valor dinámico (block/none según activeSubmit).

export default function EditForm({setRender, game}) {

    const goBack = () => {
        setRender({edit: true});
    }
    //console.log(game);
    const dispatch = useDispatch();
    //const navigate = useNavigate();
    const [activeSubmit, setActiveSubmit] = useState(true);
    const genres = useSelector((state)=>state.genres);
    const platform = useSelector((state)=>state.platforms);
    const [error, setError] = useState({});
    const [input, setInput] = useState({
        name:game.name,
        slug : game.name.split(' ').join('-').toLowerCase(),
        description:game.description,
        background_image:game.background_image,
        released:game.released,
        price:game.price,
        rating:game.rating,
        isDisabled:game.isDisabled,
        platforms: game.platforms && game.platforms.map(e => e.name),
        genres: game.genres && game.genres.map(e => e.name),
    });

    useEffect(()=>{
        dispatch(getGenres())
        dispatch(getPlatforms())
        const llaves = Object.keys(input)
        for (const key of llaves) {
            if (key === 'isDisabled') {
                continue;
            }
            if (input[key] && !error[key]) { //si hay input y no hay errores --false
                setActiveSubmit(false)
            }else {
                setActiveSubmit(true)
                break;
            };
        };
        if (Object.keys(getPayload(game,input)).length === 1){
            setActiveSubmit(true);
        }
    }, [input, error])

    function handlersubmit (e){
        e.preventDefault();
        dispatch(Edit_Game(getPayload(game,input)));
        Swal.fire(
            'Good job!',
            'Videogame Edited Succesfully!',
            'success'
        ).then(()=>setRender({edit: true}))
        dispatch(getAllProducts())
        dispatch(clear())
    };
    function handleSwitch(e){
        setInput({
            ...input,
            isDisabled: !input.isDisabled,
        });
    }
    function handleChange(e){
        //console.log(input)
        setInput({
            ...input,
            [e.target.name]: e.target.value,
            slug : game.name.split(' ').join('-').toLowerCase(),
        });
        setError(validate({
            ...input,
            [e.target.name]: e.target.value
        }))
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
    function handleDeleteGenre(e){
        setInput({
            ...input,
            genres: input.genres.filter( genres => genres !== e)
        })
    };
    function handleDeletePlat(e){
        setInput({
            ...input,
            platforms: input.platforms.filter( platform => platform !== e)
        })
    };

    var display = 'block'
    if (!activeSubmit) {
        display = 'none'
    }

  return (
    <div className="mx-auto w-full max-w-[1400px]">
        <button value='test' className="gc-pixel rounded-md border border-neon/70 px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" type="button" aria-expanded="false" onClick={goBack}>
          <i className="bi bi-arrow-left mr-2" aria-hidden="true" />Go Back
        </button>
        
        <p className="gc-pixel mt-6 text-[10px] uppercase text-magenta">Productos</p>
        <h1 className="font-display text-4xl uppercase tracking-wide text-ink">Edit Game</h1>
        


        <div className="mt-6 flex justify-center">
            <div className="w-full max-w-[520px] rounded-xl border-2 border-line bg-cab p-5">
                <form onSubmit={(e)=>handlersubmit(e)}>

                    <div className="mb-4 flex items-center justify-center gap-3">
                        <div className="gc-pixel text-[9px] uppercase text-dim">Enabled</div>
                    <div className="flex items-center">
                        <input className="h-5 w-5 cursor-pointer accent-magenta" type="checkbox" id="flexSwitchCheckDefault" onChange={handleSwitch} name="isDisabled" checked={!input.isDisabled}/>
                        {/* <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label> */}
                    </div>
                    </div>
                    

                    <div className="mb-3">
                        <label htmlFor="ef-name" className="gc-pixel text-[9px] uppercase text-dim">Name</label> 
                        <input id="ef-name" type="text" className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="title of the game..." onChange={handleChange} value={input.name} name="name" />
                        {/* <small className="form-text">We'll never share your email with anyone else.</small> */}
                        {error.name? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.name}</label>:null}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ef-description" className="gc-pixel text-[9px] uppercase text-dim">Description</label> 
                        <textarea id="ef-description" type="text" className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="a brief summary..." onChange={handleChange}  value={input.description} name="description" />
                        {error.description ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.description}</label>:null}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ef-image" className="gc-pixel text-[9px] uppercase text-dim">Image</label>
                        <input id="ef-image" type="text" className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="an image url..." onChange={handleChange} value={input.background_image} name="background_image" />
                        {error.background_image ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.background_image}</label> : null}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ef-released" className="gc-pixel text-[9px] uppercase text-dim">Release Date</label>
                        <input id="ef-released" type="date" className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="Realese date..." onChange={handleChange} value={input.released} name="released" />
                        {error.released ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.released}</label> : null}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ef-price" className="gc-pixel text-[9px] uppercase text-dim">Price</label>
                        <input id="ef-price" type="number" className="mt-2 w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" placeholder="Price..." onChange={handleChange}  min="1" max="100" value={input.price} name="price" />
                        {error.price ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.price}</label> : null}
                    </div>
                    <div className="mb-3">
                        {/* <label className="form-label" >Genres</label> */}
                        <select  placeholder="Select at least one Genre..." className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]"  name="genres" value={input.genres} onChange={(e)=>handleSelectGenres(e)}>
                            <option>Select Genres</option > 
                            {genres && genres.map((e, pos)=>{ return <option id={pos} key={e.id} value={e.genres}>{e.name}</option>})}
                        </select>  
                        {error.genres ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">Select a Genre</label> : null}
                    </div>
        
                    <div className="mb-3">
                        {/* <label className="form-label">Platform</label> */}
                        <select placeholder="Select at least one Platform" className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" name="platforms" value={input.platforms} onChange={(e)=>handleSelectPlat(e)}>
                            <option>Select Platforms</option>
                            {platform && platform.map((consola, pos)=>{
                                return <option id={consola.id} key={consola.id} value={consola.platforms}>{consola.name}</option>
                            })}
                        </select>
                        {error.platforms ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.platforms}</label>:null}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="gc-pixel text-[9px] uppercase text-neon">Genres:</div>
                        <div className="gc-pixel text-[9px] uppercase text-neon">Platforms:</div>
                    </div>
                    <div className="flex justify-center gap-4">
                    <div className="w-full rounded-lg border border-line bg-panel p-3">
                    {input.genres.map((genre, pos)=>
                        <div className="flex flex-col items-center">
                            <p id={pos} onClick={()=>handleDeleteGenre(genre)} className="gc-pixel my-1 cursor-pointer text-[9px] uppercase text-ink">{genre}<i className="bi bi-x ml-2 text-destructive" aria-hidden="true" /></p>
                            {/* <button onClick={()=>handleDeleteGenre(genre)}>X</button> */}
                        </div>
                    )}  
                    </div>
                    <div className="w-full rounded-lg border border-line bg-panel p-3">
                    {input.platforms.map((plataforma,pos)=>
                        <div className="flex flex-col items-center">
                            <p id={pos} onClick={()=>handleDeletePlat(plataforma)} className="gc-pixel my-1 cursor-pointer text-[9px] uppercase text-ink">{plataforma}<i className="bi bi-x ml-2 text-destructive" aria-hidden="true" /></p>
                        </div>
                    )}
                    </div>
                    </div>

                    <div className="gc-pixel mb-2 mt-5 text-[9px] uppercase text-destructive" style={{display: display}}>Must change at least one parameter</div>
                    {/* <button type="submit" disabled={activeSubmit}>Create!!</button> */} 
                    <button type="submit" className="gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110" disabled={activeSubmit}>Edit</button>
                </form>
            </div>
        </div>




    </div>
  )
}
