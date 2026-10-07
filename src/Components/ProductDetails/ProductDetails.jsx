import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams, NavLink, Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { addToCart, addWish } from '../../redux/actions';
import ReviewCard from '../Cards/Reviews/ReviewCard';
import FavouriteButton from '../FavouriteButton/FavouriteBurron';
import Review_box from '../Review/Review';
import BulbRow from '../ui/BulbRow';
const { REACT_APP_URL } = process.env;

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · FICHA DE PRODUCTO
 * La ficha se lee como la CABINA de una máquina: rótulo pixel magenta,
 * spec-panel de la máquina (rating / metacritic / esrb / released) y CTA
 * con glow. El carrusel de capturas pasa a ESTADO DE REACT (índice +
 * translateX sobre el track con overflow-hidden) porque el JS de Bootstrap
 * fue removido del proyecto. Precios siempre en verde de créditos.
 * ────────────────────────────────────────────────────────────────────────── */

export default function ProductDetails() {

  const [game, setGame] = useState({});
  const [disabled, setDisabled] = useState(true); // si no esta logueado desabilita addwish
  let cart = useSelector(state => state.cart);
  const [reviews, setReviews] = useState();

  let user = useSelector(state => state.users); // se trae el usuario logueado para permitir agregar a wishlist
  let { id } = useParams();
  let dispatch = useDispatch();
  let orders = useSelector(state => state.userOrders);
  let [orderFound, setOrderFound] = useState(false);

  // Índice de la captura visible del carrusel (estado propio, sin Bootstrap JS)
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (user.length) setDisabled(false); //si cuando se monta el componente hay usuario logueado habilita el addwish
    setTimeout(() => {
      axios.get(`${REACT_APP_URL}videogames/${id}`)
        .then(res => {
          setGame(res.data)
          axios.get(`${REACT_APP_URL}reviews/${id}`)
            .then(res => setReviews(res.data.filter((e) => !e.reported)))
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }, "500");
  }, [id, user])

  function handleClick(e) { // eso se ejecuta cuando se le hace click al boton de add to cart o wishlist
    e.preventDefault();
    if (e.target.value === "cart") {
      let fC = cart.filter(e => e === id);
      if (fC.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Already in cart!',
        })
      } else {
        dispatch(addToCart(game.id)) // dispacha al carrito de compras con el id del game en la db
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Succesfully added to your cart',
          showConfirmButton: false,
          timer: 1500
        })
      }

      // if(fC.length>0){
      // }else{
      //   alert("Juego ya agregado al carrito!")
      // }

    }
  }
  useEffect(() => {
    orders.forEach(e => {
      if (id === e.game_id) setOrderFound(true)
    })
  }, [id, orders])

  /* Carrusel: la portada cuenta como slide 1 y los Screenshots van detrás.
     `total` evita un módulo por cero si el juego llega sin imágenes. */
  const slides = [game.background_image, ...(game.Screenshots || []).map(e => e?.image)];
  const total = Math.max(slides.length, 1);
  const goTo = (i) => setSlide(((i % total) + total) % total);

  // Fila de spec de la máquina: etiqueta pixel + dato
  const spec = (label, value) => (
    <div className="flex items-baseline justify-between gap-3 border-b border-line/60 py-2 last:border-b-0">
      <span className="gc-pixel text-[9px] uppercase text-dim">{label}</span>
      <span className="gc-pixel text-[11px] uppercase text-ink">{value}</span>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">

      {/* Fila de bombillas del marco: decorativa */}
      <BulbRow />

      {
        !game.name && (
          <div className="mt-6 flex items-center justify-center rounded-xl border-2 border-line bg-cab/80 p-10" role="status">
            <i className="bi bi-arrow-repeat gc-blink mr-3 text-2xl text-neon" aria-hidden="true" />
            <span className="gc-pixel text-[10px] uppercase text-dim">
              <span className="sr-only">Loading...</span>
              Cargando cabina...
            </span>
          </div>
        )
      }

      {game.name && (
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* ── COLUMNA IZQUIERDA · la máquina y sus mandos ───────────── */}
          <div className="lg:col-span-5">

            {/* Rótulo de la cabina */}
            <div className="gc-drop-in rounded-xl border-2 border-line bg-cab/80 p-5">
              <p className="gc-pixel text-[10px] uppercase text-magenta">Detalle</p>
              <h1 className="font-display text-4xl uppercase leading-none tracking-wide text-ink">
                {game.name}
              </h1>
              <p className="mt-4 text-justify text-sm leading-relaxed text-dim">
                {game.description}
              </p>
            </div>

            {/* Spec-panel de la máquina */}
            <div className="mt-4 rounded-xl border-2 border-line bg-cab/80 p-5">
              <p className="gc-pixel mb-2 text-[9px] uppercase text-magenta">Spec panel</p>
              {/* Rating: primero el oficial de Steam (score 0-10 + veredicto).
                  Antes se mostraba `game.rating`, que viene en escala 0-100 por
                  herencia de RAWG y en 0 para lo importado de Steam. Si no hay
                  rating oficial se cae al legacy; si tampoco, "Sin puntuar". */}
              {game.steam_rating_score != null && game.steam_rating_score > 0
                ? spec('Rating Steam', `${game.steam_rating_score}/10 · ${game.steam_rating_desc || '—'}${game.steam_rating_reviews ? ` (${game.steam_rating_reviews} reseñas)` : ''}`)
                : spec('Rating', Number(game.rating) > 0 ? `${game.rating}/100` : 'Sin puntuar')}
              {spec('Metacritic', game.metacriticRating)}
              {spec('Esrb', game.esrb_rating)}
              {spec('Released', game.released)}
            </div>

            {/* Ya lo tenés en tu arcade */}
            {orderFound && (
              <div className="mt-4 rounded-xl border-2 border-neon/60 bg-panel/70 p-5 gc-glow-cyan">
                <p className="gc-pixel text-[9px] uppercase text-neon">Credito cargado</p>
                <h3 className="mt-2 font-display text-2xl uppercase tracking-wide text-ink">
                  You already own this game!
                </h3>
                <Link
                  to="/my_store"
                  className="gc-pixel mt-4 inline-flex items-center gap-2 rounded-md border border-neon/70 px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10"
                >
                  <i className="bi bi-joystick" aria-hidden="true" />
                  Go to your games library
                </Link>
              </div>
            )}

            {/* Mandos: precio en créditos + add to cart + wishlist */}
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border-2 border-line bg-cab/80 p-5">
              <div>
                <span className="gc-pixel block text-[9px] uppercase text-dim">Precio</span>
                <span className="gc-pixel text-sm text-credit">ARS$ {game.price}</span>
              </div>

              <div>
                {orderFound ?
                  <button
                    type="button"
                    disabled
                    className="gc-pixel cursor-not-allowed rounded-md border border-line px-5 py-3 text-[10px] uppercase text-dim"
                  >
                    Owned
                  </button>
                  :
                  (!user?.user?.isAdmin && <button
                    value="cart"
                    onClick={handleClick}
                    type="button"
                    className="gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110"
                  >
                    Add to cart
                  </button>)}
              </div>

              <div className="ml-auto">
                {!user?.user?.isAdmin && <FavouriteButton id={id} />}
              </div>
            </div>

            {/* Formulario de reseña (PLAYER 1 / PLAYER 2) */}
            <div className="mt-4">
              <Review_box productId={id} reviews={reviews} setReviews={setReviews} />
            </div>

            <div className="h-4"></div>
          </div>

          {/* ── COLUMNA DERECHA · pantalla y récord de reseñas ─────────── */}
          <div className="lg:col-span-7">

            {/* ── CARRUSEL DE CAPTURAS (estado de React) ──────────────── */}
            <div className="rounded-xl border-2 border-line bg-cab/80 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="gc-pixel text-[10px] uppercase text-magenta">Screenshots</p>
                <span className="gc-pixel text-[9px] uppercase text-dim">
                  <span className="text-neon">{Math.min(slide + 1, total)}</span> / {total}
                </span>
              </div>

              {/* ARCADE: los indicators son segmentos tipo "player select"
                  (rectángulos que se estiran al activarse), no bolitas. */}
              <div className="mt-4 flex items-center justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Slide ${i + 1}`}
                    aria-current={i === slide ? "true" : undefined}
                    className={`h-1.5 rounded-sm transition-all duration-300 ${
                      i === slide
                        ? "w-10 bg-magenta gc-glow-magenta"
                        : "w-6 bg-line/70 hover:w-8 hover:bg-dim"
                    }`}
                  />
                ))}
              </div>

              {/* Ventana + track desplazado */}
              <div className="relative mt-4 overflow-hidden rounded-lg border border-line bg-void">
                <div
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${slide * 100}%)` }}
                >
                  {slides.map((src, i) => (
                    <div key={i} className="w-full shrink-0">
                      <img
                        className="h-[22rem] w-full object-cover"
                        src={src}
                        alt={i === 0 ? `${game.name} cover` : `${game.name} screenshot ${i}`}
                      />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => goTo(slide - 1)}
                  type="button"
                  aria-label="Previous"
                  className="gc-pixel absolute left-3 top-1/2 -translate-y-1/2 rounded-md border border-neon/70 bg-void/80 px-3 py-2 text-[10px] uppercase text-neon backdrop-blur transition hover:bg-neon/10"
                >
                  <i className="bi bi-chevron-left" aria-hidden="true" />
                </button>
                <button
                  onClick={() => goTo(slide + 1)}
                  type="button"
                  aria-label="Next"
                  className="gc-pixel absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-neon/70 bg-void/80 px-3 py-2 text-[10px] uppercase text-neon backdrop-blur transition hover:bg-neon/10"
                >
                  <i className="bi bi-chevron-right" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Plataformas y géneros */}
            <div className="mt-4 rounded-xl border-2 border-line bg-cab/80 p-5">
              <p className="gc-pixel mb-3 text-[9px] uppercase text-magenta">Plataformas</p>
              <div className="flex flex-wrap gap-2">
                {game.platforms?.map((e, i) => (
                  <span
                    key={i}
                    className="gc-pixel rounded-md border border-line bg-panel px-3 py-1.5 text-[9px] uppercase text-ink"
                  >
                    {e.name}
                  </span>
                ))}
              </div>

              <p className="gc-pixel mb-3 mt-5 text-[9px] uppercase text-magenta">Generos</p>
              <div className="flex flex-wrap gap-2">
                {game.genres?.map((e, i) => (
                  <span
                    key={i}
                    className="gc-pixel rounded-md border border-neon/50 bg-panel px-3 py-1.5 text-[9px] uppercase text-neon"
                  >
                    {e.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabla de récords: las reseñas */}
            <div className="mt-4">
              <p className="gc-pixel mb-3 text-[9px] uppercase text-magenta">High scores</p>
              <div className="overflow-hidden rounded-xl border-2 border-line">
                <div className="max-h-[380px] overflow-y-auto">
                  {reviews && reviews.map((e) => {

                    // return (<ReviewCard username={e.username} rating={e.rating} description={e.description} userImg={e.profile_pic} />)

                    return (<ReviewCard key={e.i} username={e.username} rating={e.rating} description={e.description} userImg={e.profile_pic} id={e.id} reviews={reviews} setReviews={setReviews} />)

                  })}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
