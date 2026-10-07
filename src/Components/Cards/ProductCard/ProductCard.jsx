import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Dispatch } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { addToCart, removeFromCart, removeWish, addWish, getUserOrders } from '../../../redux/actions.js' // CREAR UNA ACTION QUE DEPLOYE FAVORITO AL USUARIO

import FavouriteButton from '../../FavouriteButton/FavouriteBurron.jsx'
import Swal from 'sweetalert2'
import { isDisabled } from '@testing-library/user-event/dist/utils/index.js'
import xboxImg from '../../../images/Xbox.png'
import playStation from '../../../images/PlayStation.png'
import pc from '../../../images/PC.png'
// FIX: `shoppingCard` (ícono del carrito) quedó sin uso → el botón de la cabina
// ahora es textual ("INSERT COIN"), igual que en la maqueta de pen.dev.




export default function ProductCard({ id, id_api, name, img, rating, platforms, price, fromApi, isDisabled, genres, steam_rating_score, steam_rating_desc, steam_rating_reviews }) {
  let cart = useSelector(state => state.cart);
  let user = useSelector(state => state.users);
  let games = useSelector(state => state.products2).map(e => e.name); //140 --
  let orders = useSelector(state => state.userOrders).map(e => e.game_name); //horizon y thiswar
  let [adquiridos, setAdquiridos] = useState(false);
  const [remove, setRemove] = useState(false);
  let location = useLocation();
  /* let screenShots = useSelector(state => state.screenShots) */
  let foundCart = false;   //aca encontraria el juego si esta agregado al carrito
  const dispatch = useDispatch()
  let user_id = null;
  // console.log(user)
  // console.log(games)
  if (user.user) {
    user_id = user.user.id
    // console.log(user_id)
  } else {
    // console.log("hola")
  }

  // console.log(rating)
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta',
      cancelButton: 'gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon'
    },
    buttonsStyling: false
  })

  useEffect(() => {
   cart?.length && localStorage.setItem('cart', JSON.stringify(cart));
   // FIX: se pedían las órdenes del usuario aunque `user_id` fuera null (es decir,
   // sin sesión) → el API respondía 401 y la consola se llenaba de errores:
   // una petición fallida POR CADA TARJETA del catálogo (10 por página).
   // Ahora solo se consulta cuando hay usuario.
   user_id && dispatch(getUserOrders(user_id))
   orders.forEach(e => { if (e === name) { setAdquiridos(true) } })
   // console.log(localStorage.getItem("cart"))
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [remove])

  const handleClick = (e) => {
    e.preventDefault();
    // console.log("HICISTE CLICK")
    // console.log(e.target)
    // console.log(e.target.name)
    //
    // FIX — el botón "Insert coin" no agregaba nada al carrito.
    // La condición era `e.target.name === "cart"`, pero `name="cart"` está en el
    // <div> que ENVUELVE al botón, y el botón ocupa el 100% de ese div (width
    // 100% en .gc-coin). El click nunca caía en el div: el navegador reportaba
    // e.target = <button>, cuyo `name` es "", así que la condición era false y
    // el click se perdía (ni dispatch, ni Swal, nada).
    //
    // Se resuelve subiendo desde el elemento clickeado hasta el que tiene el
    // marcador, en vez de comparar el elemento clickeado. Así el handler
    // responde igual si el click cae en el div, en el botón o en cualquier hijo
    // futuro (un ícono, por ejemplo), sin depender del ancho de nada.
    if (e.target.closest('[name="cart"]')) {

      let fC = cart.filter(e => e === id);
      if (owned) {
        Swal.fire({
          icon: 'warning',
          text: 'You already own this game!',
        })
      } else if (fC.length > 0) {
        Swal.fire({
          icon: 'warning',
          text: 'Game is already in cart!',
        })
      } else {
        dispatch(addToCart(id)) // dispacha al carrito de compras con el id del game en la db
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Succesfully added to your cart',
          showConfirmButton: false,
          timer: 1500
        })
        if(location.pathname === "/shopping_cart"){window.location.reload()}
      }
    } else if (e.target.value === "remove") {

      swalWithBootstrapButtons.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire(
            'Deleted!',
            'Your product has been deleted from the cart.',
            'success'
          );
          dispatch(removeFromCart(id));
          setRemove(true);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            'Your product is still in the cart ',
            'error'
          )
        }
      })
    }
  }




  let platformsArr = []
  if (platforms && platforms.length > 0) {
    let platformsSet = new Set();
    platforms.forEach(e => {
      if (e.name.includes('PlayStation')) platformsSet.add('PlayStation');
      if (e.name.includes('Xbox')) platformsSet.add('Xbox');
      if (e.name === 'PC') platformsSet.add('PC');
    });
    platformsSet.forEach(e => platformsArr.push(e))
  }

  let userOrders = useSelector(state => state.userOrders);
  let owned = false;
  if (userOrders) {
    let gam = userOrders.filter((e) => e.game_id === id)
    if (gam.length > 0) {
      owned = true;
    }
  }


  cart.forEach(e => { if (e === id) { foundCart = true } })

  //orders.forEach(e => {if(e === name){setAdquiridos(true)}})

  /*
   * RATING — 5 estrellas, del puntaje OFICIAL de Steam.
   *
   * Antes esto hacía `Math.floor(rating / 10)` sobre el campo legacy `rating`,
   * que venía en dos flavors y ninguno servía: 0 para lo importado de Steam
   * (sin fuente) y 100 para los juegos viejos de RAWG (escala 0-100). Con 100
   * daba 10 y el badge mostraba "10/6"; con 0 no se veía ninguna estrella.
   *
   * Ahora la fuente es `steam_rating_score` (review_score de Steam, 0-10) y se
   * convierte a 5 estrellas dividiendo por 2. Se conserva el campo legacy como
   * plan B para los juegos que todavía no pasaron por el sync.
   *
   * `Math.min` es la guarda final: aunque el dato venga raro, nunca se dibujan
   * más de 5 estrellas ni el badge desborda.
   */
  const MAX_ESTRELLAS = 5

  const puntajeSteam = Number(steam_rating_score)

  // Sin rating oficial: se cae al legacy (0-100 → 5 estrellas). Si tampoco hay,
  // queda null y se muestra "sin puntuar" en vez de 0 estrellas mudas.
  let estrellas = null
  if (Number.isFinite(puntajeSteam) && puntajeSteam > 0) {
    estrellas = Math.round(puntajeSteam / 2)
  } else if (Number(rating) > 0) {
    estrellas = Math.round(Number(rating) / 20)
  }

  const tieneRating = estrellas !== null
  estrellas = tieneRating ? Math.max(0, Math.min(MAX_ESTRELLAS, estrellas)) : 0

  const arr = Array.from({ length: estrellas }, (_, i) => i)
  const blackstars = Array.from({ length: MAX_ESTRELLAS - estrellas }, (_, i) => i)

  // Iniciales para la placa "attract mode" (ej. OVERWATCH 2 -> OV)
  const iniciales = (name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

  /*
   * ARCADE · CABINA — medidas copiadas del frame "E · Arcade" de pen.dev
   * (exportado a HTML/CSS), no inventadas:
   *   cabinet  → bg #130A28, outline 2px #3A2470, radius 14px, padding 16px, gap 14
   *   screen   → alto 196px, radius 10px, glow 0 0 34px #FF2E9355, gradiente -118.389deg
   *   initials → Anton 64px, #0A0614, opacity .55
   *   label    → Anton 24px #F2EEFF, letter-spacing 1px
   *   coin btn → gradiente 0deg #FF2E93→#7B2FFF, radius 8px, alto 44px, glow 0 0 24px #FF2E9366
   */
  return (
      <article className="group flex h-full flex-col rounded-[14px] border-2 border-line bg-cab p-4 transition hover:-translate-y-1 hover:border-neon">

        {/* 1 · PANTALLA
            Ahora el carré es la PORTADA del juego (lo que vende la cabina) y el
            degradado "attract mode" pasó a ser una placa chica junto al nombre
            (abajo). El degradado exacto sigue siendo `.gc-attract`, el mismo
            del mock de pen.dev: -118.389deg, #FF2E93 14.645% → #7B2FFF 57.071%
            → #0A0614 85.355%. */}
        <Link className="block no-underline" to={fromApi || isDisabled ? `/home` : `/detail/${id}`}>
          <div className="relative h-[196px] w-full overflow-hidden rounded-[10px] border border-line shadow-[0_0_34px_rgba(255,46,147,0.33)]">
            <img src={img} alt={name} className="h-full w-full object-cover" />
          </div>
        </Link>

        {/* 2 · PANEL DE CONTROL */}
        <div className="mt-4 flex min-w-0 flex-1 flex-col gap-3">

          {/* Placa "attract mode": el carré con degradado que antes ocupaba la pantalla
            grande, reducido a la medida del antiguo thumbnail (56×56) para que
            el nombre y las estrellas respiren. Sin el rótulo "Attract mode": a
            esta escala sería ilegible, y el degradado + iniciales ya lo
            identifican. */}
          <div className="flex items-center gap-3">
            <div className="gc-attract relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-[10px] border-2 border-line">
              <span className="font-display text-2xl leading-none text-void/55">{iniciales}</span>
              <span className="gc-pixel absolute bottom-1 right-1 rounded bg-bulb px-1 py-0.5 text-[7px] leading-none text-void">
                {tieneRating ? `${estrellas}/${MAX_ESTRELLAS}` : '—'}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-xl leading-none text-ink">{name}</h3>
              <div className="mt-1.5 flex items-center gap-0.5">
                {arr.map((e, i) => (
                  <svg key={`filled-${i}`} xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#ffbb00" className="bi bi-star-fill" viewBox="0 0 16 16">
                    <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                ))}
                {blackstars.map((e, i) => (
                  <svg key={`empty-${i}`} xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#4a4438" className="bi bi-star" viewBox="0 0 16 16">
                    <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg>
                ))}
              </div>
              {/* Veredicto de Steam + cuántas reseñas lo sostienen. Sin él no se
                puede distinguir "4 estrellas de 5" de "4 estrellas de 5 pero de
                dos personas". */}
              {tieneRating && steam_rating_desc && (
                <p className="gc-pixel mt-1 truncate text-[8px] uppercase text-dim" title={`${steam_rating_reviews || 0} reseñas en Steam`}>
                  {steam_rating_desc}
                  {steam_rating_reviews ? ` · ${steam_rating_reviews}` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {platformsArr.map((e, i) => {
              let platformImg;
              if (e === 'PC') platformImg = pc
              if (e === 'Xbox') platformImg = xboxImg
              if (e === 'PlayStation') platformImg = playStation
              return (
                <img key={i} className="h-5 w-5 object-contain opacity-80" src={platformImg} alt={e} />
              )
            })}
          </div>

          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((e, index) => (
              <span key={index} className="gc-pixel rounded border border-line bg-panel px-2 py-1 text-[8px] uppercase text-dim">
                {e.name === "Massively Multiplayer" ? "Massive mult.." : e.name}
              </span>
            ))}
            {genres.length > 3 ? (
              <span className="gc-pixel rounded border border-line bg-panel px-2 py-1 text-[8px] uppercase text-dim">+{genres.length - 3}</span>
            ) : null}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-3 pt-1">
            {isDisabled || fromApi ? (
              <span className="gc-pixel text-[9px] uppercase text-destructive">No stock</span>
            ) : (
              <>
                <span className="gc-pixel text-sm text-credit">ARS$ {price}</span>

                {!adquiridos && !user?.user?.isAdmin ? (
                    <div name="cart" onClick={(e) => handleClick(e)} className="min-w-[140px] flex-1">
                      <button
                        disabled={fromApi || isDisabled ? true : false}
                        className="gc-coin gc-pixel text-[12px] uppercase transition"
                      >
                        Insert coin
                      </button>
                    </div>
                  ) : null}
              </>
            )}
          </div>
        </div>

        {/* Favorito: fuera del panel para no competir con el botón de créditos */}
        {user?.user?.id && !user?.user?.isAdmin && (
          <div className="absolute right-6 top-6">
            <FavouriteButton id={id} />
          </div>
        )}

      </article>)

}
