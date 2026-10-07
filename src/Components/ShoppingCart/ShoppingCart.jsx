
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from 'react'
import Checkout from '../Checkout/Checkout'
import { addToCart, getAllProducts, removeFromCart } from "../../redux/actions";
import { Link, Redirect } from "react-router-dom";
import CartCard from "./CartCard";
import { RandomHelper } from "./RandomHelper"
import BulbRow from '../ui/BulbRow';

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · CARRITO = BANDEJA DE CRÉDITOS
 * Encabezado "CREDITOS" con el contador en verde de créditos, la lista de
 * ítems como filas de máquina, el total como insert coin y la ranura de
 * monedas al pie. Todos los dispatch, Swal y rutas intactos.
 * ────────────────────────────────────────────────────────────────────────── */

export default function ShoppingCart() {
    let cart = useSelector(state => state.cart);
    let games = useSelector(state => state.products2);
    let users = useSelector(state => state.users);
    let filterGames = [];
    let [cartLS, setCartLS] = useState([]);
    let fg;
    let gamesCO;
    let forCheckout;
    let dispatch = useDispatch();
    let totalPrice = 0;

    useEffect(() => {
        dispatch(getAllProducts())
        let cartLS2 = JSON.parse(localStorage.getItem("cart"));
        //localStorage.setItem('cart',JSON.stringify(cart));
        if (cart.length < 1 && cartLS2 !== null) {
            // console.log(cartLS2)
            cartLS2.forEach(e => dispatch(addToCart(e)));
        }
        if (cartLS2) {
            
           setCartLS(cartLS2)
        }
    }, [dispatch])

    useEffect(() => {

    }, [cart])


    cartLS !== undefined && (cartLS.forEach(LS => {
        fg = games.filter(games => LS === games.id);
        // console.log(fg)
        if (fg.length > 0) {
            filterGames.push(fg[0])
        }
    }
    ))

    //arreglo vacio. 
    if (!cartLS && cart.length > 0) {
        cart.forEach(e => {
            fg = games.filter((f) => e === f.id)
            filterGames.push(fg[0])
        })
    }


    if (filterGames.length > 0) {
        gamesCO = filterGames.map(e => {
            return {
                title: e.name,
                unit_price: e.price,
                quantity: 1
            }
        })
        forCheckout = {
            items: gamesCO,
            back_urls: {
                "success": "http://localhost:8080/feedback",
                "failure": "http://localhost:8080/feedback",
                "pending": "http://localhost:8080/feedback"
            },
            auto_return: "approved",
        };




        let string_user_id;
        if (users.user) {
            string_user_id = JSON.stringify(users.user.id)
            string_user_id = string_user_id + "/"
            const carro = cart.map(e => e).join('*')
            string_user_id = string_user_id + carro
        }



        forCheckout = {
            items: gamesCO,
            external_reference: `${users.user ? string_user_id : null}`, //el id de cada orden
            back_urls: {
                "success": `${process.env.REACT_APP_URL}cart/feedback`,
                "failure": `${process.env.REACT_APP_URL}cart/feedback`, //cambiar a mensaje de error
                "pending": `${process.env.REACT_APP_URL}cart/feedback` //x2
            },
            auto_return: "approved",
        };

        filterGames.forEach(e =>
            totalPrice = totalPrice + e.price
        )

    };

    function handleAllRemove() {
        cart.forEach(e => dispatch(removeFromCart(e)));
        window.localStorage.clear();
        window.location.reload();
    }
    return (

        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
            {users?.user?.isAdmin && <Redirect to='/*' />}

            {/* Fila de bombillas del marco */}
            <BulbRow />

            {/* ── ENCABEZADO · CREDITOS + contador en verde ──────────────── */}
            <div className="gc-drop-in mt-4 rounded-xl border-2 border-line bg-cab/80 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <p className="gc-pixel text-[10px] uppercase text-magenta">Bandeja de la maquina</p>
                        <h1 className="font-display text-4xl uppercase leading-none tracking-wide text-ink">
                            Creditos
                        </h1>
                    </div>

                    {/* Contador de créditos */}
                    <div className="flex items-center gap-3 rounded-lg border border-line bg-panel px-4 py-3">
                        <i className="bi bi-coin text-credit" aria-hidden="true" />
                        <div>
                            <span className="gc-pixel block text-[9px] uppercase text-dim">Creditos</span>
                            <span className="gc-pixel text-sm text-credit">
                                {filterGames.length}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── CONTENIDO DEL MEDIO ──────────────────────────────────── */}
            <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Lista de ítems */}
                <div className="flex flex-col gap-3 lg:col-span-2">
                    {filterGames.length > 0 ?
                        (filterGames.map((e, i) => (
                            <CartCard
                                key={i}
                                id={e.id} name={e.name} img={e.background_image}
                                rating={e.rating} platforms={e.platforms} price={e.price}
                            />
                    ))) : (
                        <div className="rounded-xl border-2 border-line bg-cab/80 p-10 text-center">
                            <i className="bi bi-coin mb-3 block text-3xl text-line" aria-hidden="true" />
                            <h4 className="gc-pixel text-[10px] uppercase text-dim">No products yet...</h4>
                        </div>
                    )}
                </div>

                {/* Panel del ticket: total + pago */}
                <div className="flex flex-col justify-between gap-6 rounded-xl border-2 border-line bg-cab/80 p-5">

                    {/* Total estimado, en créditos */}
                    <div className="flex items-center justify-between gap-4 border-b border-line/60 pb-4">
                        <span className="gc-pixel text-[9px] uppercase text-dim">Total estimado</span>
                        <span className="gc-pixel text-sm text-credit">ARS$ {totalPrice}</span>
                    </div>

                    <div>
                        {users.user ?
                            <div>
                                {filterGames.length > 0 && (
                                    <p className="gc-pixel mb-3 text-[9px] uppercase text-neon">
                                        Pay with MercadoPago
                                    </p>
                                )}
                                {forCheckout && <Checkout games={forCheckout} />}
                            </div> :
                            <Link to="/login" className="block">
                                <button
                                    type="button"
                                    className="gc-pixel w-full rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110"
                                >
                                    You must be logged in to purchase
                                </button>
                            </Link>

                        }
                    </div>

                    {/* Mandos de la bandeja */}
                    <div className="flex flex-col gap-3">
                        <Link to="/home">
                            <button
                                type="button"
                                className="gc-pixel w-full rounded-md border border-neon/70 px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10"
                            >
                                <i className="bi bi-shop" aria-hidden="true" />
                                Continue shopping!
                            </button>
                        </Link>

                        <button
                            onClick={(e) => handleAllRemove(e)}
                            type="button"
                            className="gc-pixel w-full rounded-md border border-destructive/70 px-5 py-3 text-[10px] uppercase text-destructive transition hover:bg-destructive/10"
                        >
                            <i className="bi bi-trash3" aria-hidden="true" />
                            Remove all items
                        </button>
                    </div>
                </div>
            </div>
            {/*FIN DEL CONTENDIO DEL MEDIO*/}

            {/* ── RANURA DE MONEDAS ────────────────────────────────────── */}
            <div className="mt-10">
                <div className="mb-4 flex items-center gap-3">
                    <span className="gc-pixel text-[10px] uppercase text-magenta">Suerte</span>
                    <span className="h-px flex-1 bg-line"></span>
                    <span className="gc-pixel text-[10px] uppercase text-dim">Maybe you're interested in...</span>
                    <span className="h-px flex-1 bg-line"></span>
                </div>

                <div className="flex flex-row flex-wrap justify-center">
                    <RandomHelper games={games} />
                </div>
            </div>
        </div>
    )
}
