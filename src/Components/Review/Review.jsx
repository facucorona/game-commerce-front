import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getUserOrders, PostReview } from "../../redux/actions";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import axios from "axios";
const { REACT_APP_URL } = process.env;

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · FORMULARIO DE RESEÑA "DOS JUGADORES"
 * El formulario es una Versus de dos columnas: PLAYER 1 (quien reseña) y
 * PLAYER 2 (quien responde / estado del unlocked). Etiquetas pixel, inputs
 * de máquina con foco cian y el CTA magenta con glow.
 * ────────────────────────────────────────────────────────────────────────── */

function validate(input, productOwned) {
    let error = {};
    if (productOwned) {
        if (!input.description || input.description.length > 255) error.description = "Description required with no more than 256 characters"
        if (!input.rating || input.rating < 0 || input.rating > 100) error.rating = "1 - 100"
    }
    return error
};
//

export default function Review_box({ productId, reviews, setReviews }) {

    let user = useSelector(state => state.users);
    let userOrders = useSelector(state => state.userOrders);
    var username;
    var user_id;
    var profile_pic;
    if (user.user) {
        user_id = user.user.id;
        username = user.user.username;
        profile_pic = user.user.profile_pic;
    }
    const [activeSubmit, SetactiveSubmit] = useState(true);
    const [productOwned, SetProductOwned] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [reviewed, setReviewed] = useState(false);

    let [input, setInput] = useState({
        rating: "",
        description: "",
        user_id: user_id,
        productId: productId,
        profile_pic: profile_pic,
        username: username,
    });
    let [error, setError] = useState({});
    let dispatch = useDispatch();


    useEffect(() => {
        if (productOwned && !reviewed) {
            const llaves = Object.keys(input)
            for (const key of llaves) {
                if (input[key] && !error[key]) { //si hay input y no hay errores --false
                    SetactiveSubmit(false)
                } else {
                    SetactiveSubmit(true)
                    break;
                };
            };
        }
    }, [input, error])

    function handleChange(e) {
        e.preventDefault(e)
        let review = e.target.value;
        setInput({
            ...input,
            [e.target.name]: review,
        });
        setError(validate({
            ...input,
            [e.target.name]: review
        }, productOwned))
    };

    useEffect(() => {
        if (user.user) {
            dispatch(getUserOrders(user_id))
        }
    }, []);
    useEffect(() => {
        userOrders.forEach(e => {
            if (e.game_id === productId) {
                SetProductOwned(true);
            }
        });
    }, [userOrders]);

    useEffect(() => {
        if (reviews) {
            setTimeout(() => {
                axios.get(`${REACT_APP_URL}reviews?user_id=${user_id}`)
                    .then(res => setUserReviews(res.data.filter((e) => !e.reported)))
                    .catch(err => console.log(err))
            }, "500");
        }
    }, [user, reviews])

    useEffect(() => {
        if (reviews && userReviews) {
            userReviews.forEach(e => {
                if (e.productId === productId) {
                    setReviewed(true)
                }
            })
        }
    }, [userReviews, reviews])


    function handlerSubmit(e) {
        e.preventDefault();
        dispatch(PostReview(input));
        setReviews([...reviews, ...[input]])
        Swal.fire(
            'Good job!',
            'Review Posted Succesfully!',
            'success'
        )
            .then(() => window.location.reload())
        setInput({
            rating: "",
            description: "",
            user_id: user_id,
            productId: productId,
            username: username,
        })
    };
    //rating y review

    return (
        <div className="mx-auto mt-5 w-full max-w-[560px]">
            {/* Rótulo de la Versus */}
            <div className="gc-pixel mb-3 flex items-center justify-center gap-2 text-[9px] uppercase text-magenta">
                <span className="h-px flex-1 bg-line"></span>
                Versus
                <span className="h-px flex-1 bg-line"></span>
            </div>

            <form onSubmit={(e) => handlerSubmit(e)} className="rounded-xl border-2 border-line bg-cab/80 p-5">

                {/* ── DOS COLUMNAS · PLAYER 1 / PLAYER 2 ─────────────────── */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                    {/* PLAYER 1 · quien reseña */}
                    <div className="rounded-lg border border-magenta/50 bg-panel/70 p-4">
                        <div className="mb-4 flex items-center gap-2 border-b border-line/60 pb-2">
                            <i className="bi bi-person-fill text-magenta" aria-hidden="true" />
                            <span className="gc-pixel text-[9px] uppercase text-magenta">Player 1</span>
                            <span className="gc-pixel ml-auto text-[9px] uppercase text-dim">Reviewer</span>
                        </div>

                        <div className="mb-3">
                            <label className="gc-pixel mb-2 block text-[9px] uppercase text-dim" htmlFor="review-rating">Rating:</label>
                            <input
                                id="review-rating"
                                type="number"
                                /* placeholder="Rating" */
                                className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]"
                                name="rating"
                                value={input.rating}
                                onChange={(e) => handleChange(e)}
                                required
                            />
                            {error.rating ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.rating}</label> : null}
                        </div>

                        <div className="mb-3">
                            <label className="gc-pixel mb-2 block text-[9px] uppercase text-dim" htmlFor="review-description">Review:</label>
                            <textarea
                                id="review-description"
                                placeholder="Review"
                                className="w-full rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]"
                                name="description"
                                value={input.description}
                                onChange={(e) => handleChange(e)}
                                required
                            ></textarea>
                            {error.description ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.description}</label> : null}
                        </div>
                    </div>

                    {/* PLAYER 2 · el estado del desbloqueo */}
                    <div className="flex flex-col rounded-lg border border-neon/50 bg-panel/70 p-4">
                        <div className="mb-4 flex items-center gap-2 border-b border-line/60 pb-2">
                            <i className="bi bi-person-badge-fill text-neon" aria-hidden="true" />
                            <span className="gc-pixel text-[9px] uppercase text-neon">Player 2</span>
                            <span className="gc-pixel ml-auto text-[9px] uppercase text-dim">Responde</span>
                        </div>

                        {!productOwned ? (
                            <div className="gc-pixel flex items-start gap-2 text-[9px] uppercase leading-relaxed text-bulb">
                                <i className="bi bi-lock-fill" aria-hidden="true" />
                                <span>You must own the product to review</span>
                            </div>
                        ) : null}

                        {reviewed ? (
                            <div className="gc-pixel flex items-start gap-2 text-[9px] uppercase leading-relaxed text-magenta">
                                <i className="bi bi-exclamation-octagon-fill" aria-hidden="true" />
                                <span>You already reviewed this game</span>
                            </div>
                        ) : null}

                        {productOwned && !reviewed ? (
                            <div className="gc-pixel flex items-start gap-2 text-[9px] uppercase leading-relaxed text-credit">
                                <i className="bi bi-unlock-fill" aria-hidden="true" />
                                <span>Juego desbloqueado: podés dejar tu reseña</span>
                            </div>
                        ) : null}

                        {/* READY / LOCKED: la lucecita de la cabina */}
                        <div className="mt-auto flex items-center gap-2 pt-5">
                            <span className={`h-3 w-3 rounded-full ${productOwned && !reviewed ? 'gc-glow-bulb bg-bulb' : 'bg-line'}`} aria-hidden="true"></span>
                            <span className="gc-pixel text-[9px] uppercase text-dim">
                                {productOwned && !reviewed ? 'Ready' : 'Locked'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* CTA de la máquina */}
                <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                        type="submit"
                        disabled={activeSubmit}
                        className="gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Post Review
                    </button>
                    <span className="gc-pixel text-[9px] uppercase text-dim">Rating 1 - 100</span>
                </div>
            </form>
        </div>
    )
};
