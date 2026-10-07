import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Dispatch } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, removeWish, addWish } from '../../redux/actions.js'
import FavouriteButton from '../FavouriteButton/FavouriteBurron.jsx'
import Swal from 'sweetalert2'
import { isDisabled } from '@testing-library/user-event/dist/utils/index.js'


export default function CardLanding({ id, name, img, price, fromApi, isDisabled }) {
  let cart = useSelector(state => state.cart);
  const { user } = useSelector(state => state.users);
  const [remove, setRemove] = useState(false);
  /* let screenShots = useSelector(state => state.screenShots) */
  let foundCart = false;   //aca encontraria el juego si esta agregado al carrito
  const dispatch = useDispatch()


  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta',
      cancelButton: 'gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon'
    },
    buttonsStyling: false
  })

  useEffect(() => {

    cart?.length && localStorage.setItem('cart', JSON.stringify(cart));

  }, [cart]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [remove]);

  /*  useEffect(() => {
     dispatch(getScreenShots(id_api))
   },[])

   console.log(screenShots) */



  const handleClick = (e) => {
    e.preventDefault();
    if (e.target.value === "cart") {
      let fC = cart.filter(e => e === id);
      if (fC.length > 0) {
        alert("Juego ya agregado al carrito anteriormente!")
      } else {
        dispatch(addToCart(id)) // dispacha al carrito de compras con el id del game en la db
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Succesfully added to your cart',
          showConfirmButton: false,
          timer: 1500
        })
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

  cart.forEach(e => { if (e === id) { foundCart = true } })

  // ARCADE: tarjeta destacada "de premio mayor" del carrusel — imagen en marco
  // attract-mode, precio en verde créditos y botón INSERT COIN (DESIGN_SYSTEM.md §4)
  return (
    <div >

      <div className="flex h-full w-56 flex-col overflow-hidden rounded-xl border-2 border-line bg-cab transition hover:-translate-y-1 hover:border-neon">
        <div className="gc-attract relative h-40 w-full overflow-hidden">
          <span className="gc-pixel absolute left-3 top-3 z-10 text-[9px] uppercase text-white/80">Attract mode</span>
          <Link className="block h-full w-full" to={fromApi || isDisabled ? `/home` : `/detail/${id}`}>
            <img className="h-full w-full object-cover" src={img} alt="product img" />
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <Link className="block no-underline" to={fromApi || isDisabled ? `/home` : `/detail/${id}`}>
            <h3 className="font-display text-base leading-tight text-ink">{name.slice(0, 25)} {name.length > 25 ? "..." : ""}</h3>
          </Link>

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
            {user?.id && <FavouriteButton id={id} />}
            <div>
              {isDisabled || fromApi ?
                <span className="gc-pixel text-[9px] uppercase text-destructive">No stock</span> :
                <span className="gc-pixel text-sm text-credit">${price}</span>}
            </div>
            <div>
              <button disabled={fromApi || isDisabled ? true : false} onClick={(e) => handleClick(e)} value="cart" className="gc-pixel rounded-md bg-magenta px-4 py-2 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110">Insert coin</button>
            </div>
            {foundCart && <button onClick={(e) => handleClick(e)} type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-line text-dim transition hover:border-destructive hover:text-destructive" value="remove" aria-label="Close"><i className="bi bi-x-lg" aria-hidden="true" /></button>}
          </div>
        </div>
      </div>

    </div>)

}
