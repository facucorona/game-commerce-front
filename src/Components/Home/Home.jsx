import React, { useState } from 'react'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux'
import { getAllProducts, getUsers, setCurrentPage, addWish, resetWish,/* getScreenShots */ } from '../../redux/actions';
import ProductCard from '../Cards/ProductCard/ProductCard';
import Pagination from '../Pagination/Pagination';
import SideBar from '../SideBar/SideBar';
import Filters from "../Filters/Filters"
import MyChatBot from '../Chatbot/chatbot';
import config from '../Chatbot/Config/config';
import MessageParser from '../Chatbot/MessageParser/MessageParser';
import ActionProvider from '../Chatbot/ActionProvider/ActionProvider';
import Spinner from "../Spinner/Spinner"
import { Link } from 'react-router-dom';
// Flyers de promoción (convertidos a .jpg y livianos: 5.7 MB → ~120 KB c/u)
import banner from "../../images/banner.jpg"
import banner2 from "../../images/banner2.jpg"

function Home() {
    let games = useSelector(state => state.products);
    let searchered = useSelector(state => state.searchered);
    let dispatch = useDispatch();
    let currentPage = useSelector((state) => state.currentPage);
    let [gamesPerPage, setgamesPerPage] = useState(12);
    const indexOfLastGame = currentPage * gamesPerPage;
    const indexOfFirstGame = indexOfLastGame - gamesPerPage;
    const currentGames = searchered.length ? searchered.slice(indexOfFirstGame, indexOfLastGame) : games.slice(indexOfFirstGame, indexOfLastGame);
    // Rating oficial de Steam (score 0-10): se pasa a la tarjeta junto con el
    // veredicto y la cantidad de reseñas. Antes sólo viajaba el campo legacy
    // `rating`, que venía en 0 (importados de Steam) o 100 (herencia de RAWG).
    const ratingDe = (e) => ({
        steam_rating_score: e.steam_rating_score,
        steam_rating_desc: e.steam_rating_desc,
        steam_rating_reviews: e.steam_rating_reviews,
    });

    const user = useSelector((state) => state.users),
        token = window.sessionStorage.getItem('token');
     const [show, setShow] = useState(false);

    const paginado = (number) => {
        dispatch(setCurrentPage(number))
        setTimeout(()=> window.scroll({top: 0}),500)
    };

    useEffect(()=>{
        setTimeout(()=> setShow(true),1000)
    },[searchered])

    useEffect(() => {
        token && dispatch(getUsers(token));
        dispatch(getAllProducts());
    }, []);

    useEffect(() => {
        user.products?.length !== 0 ? user.products?.map(e => dispatch(addWish(e.id))):
        dispatch(resetWish());
    },[user]);

    // ARCADE: catálogo en grilla de "cabinas" + rótulo de sección,
    // sidebar fijo a la izquierda, banner "attract mode" a la derecha,
    // y marquesina de créditos al pie (DESIGN_SYSTEM.md §4)
    return (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
            <div className="flex flex-col gap-6 lg:flex-row">

                {/* 1 · Sidebar izquierdo: filtros */}
                <aside className="w-full shrink-0 lg:w-[220px]">
                    {/* FIX: el wrapper ponía su propio rótulo "Filtros" y el
                        SideBar ya trae el suyo → se veía "FILTROS" dos veces
                        seguidas dentro del mismo marco. */}
                    <div className="sticky top-24 rounded-xl border-2 border-line bg-cab/80 p-4">
                        <SideBar />
                    </div>
                </aside>

                {/* 2 · Main: grilla de cabinas + paginación */}
                <main className="min-w-0 flex-1">

                    <div className="mb-6">
                        <p className="gc-pixel text-[10px] uppercase text-magenta">Catálogo</p>
                        <h1 className="font-display text-4xl uppercase tracking-wide text-ink">HOME</h1>
                    </div>

                    <div className="mb-5">
                        <Filters />
                    </div>

                    <div className="grid grid-cols-1 gap-5 pb-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {currentGames.length > 0 && currentGames.map(e => (
                            <ProductCard key={e.id} name={e.name} id_api={e.id_api} id={e.id} img={e.background_image} rating={e.rating} genres={e.genres} platforms={e.platforms} price={e.price} fromApi={e.fromApi} isDisabled={e.isDisabled} {...ratingDe(e)} />
                        ))}
                        {!show && <Spinner />}
                        {show && (currentGames.length < 1) && (
                            <div className="col-span-full flex items-center justify-center gap-3 py-10" role="status">
                                <i className="bi bi-coin gc-blink text-bulb" aria-hidden="true" />
                                <span className="gc-pixel text-[10px] uppercase text-dim">Loading...</span>
                            </div>
                        )}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        gamesPerPage={gamesPerPage}
                        games={searchered.length ? searchered.length : games.length}
                        paginado={paginado}
                    />

                </main>

                {/* 3 · Sidebar derecho: banner "attract mode" */}
                <aside className="w-full shrink-0 lg:w-[220px] lg:order-last">
                    <div className="sticky top-24">
                        <Link className="block" to={user.user ? "/home" : "/login"}>
                            <div className="gc-attract relative w-full overflow-hidden rounded-xl border-2 border-line transition hover:-translate-y-1 hover:border-neon">
                                <span className="gc-pixel absolute left-3 top-3 z-10 text-[9px] uppercase text-white/80">Attract mode</span>
                                <img className="h-[320px] w-full object-cover" src={user.user ? banner : banner2} alt={user.user ? "Promoción Black Friday" : "Promoción de registro"} />
                            </div>
                        </Link>
                    </div>
                </aside>

            </div>
        </div>
    )
}

export default Home