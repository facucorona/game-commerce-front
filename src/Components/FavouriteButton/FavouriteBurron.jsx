import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import heart from "../../images/heart.png"
import { addWish, removeWish } from '../../redux/actions';
import { addFavorite, deleteFavorite } from './FavoriteButton';

function FavouriteButton({ id }) {
  let dispatch = useDispatch();
  let wishlist = useSelector(state => state.wishlist);
  let { products } = useSelector(state => state.users);
  const [brigthness, setBrigthness] = useState("brightness(0.5)")

  const token = sessionStorage.getItem('token');
  
  useEffect(() => {
    let fW = wishlist?.filter(e => e === id) 
    if (fW.length > 0 ) { setBrigthness("") };
  }, [wishlist ,products, id]);

  async function handleClick() {
    if (wishlist.includes(id)) {
      dispatch(removeWish(id))
      await deleteFavorite(id, token)
      setBrigthness("brightness(0.5)")
    } else {
      dispatch(addWish(id)) // dispacha al WISHLIST de compras con el id del game en la db
      await addFavorite(id, token)
    }
  }

  // ARCADE: botón circular de favorito, tipo LED del marco de una cabina:
  // apagado sin brillo, encendido a pleno magenta con el corazón relleno (DESIGN_SYSTEM.md §4)
  const isActive = brigthness === ""

  return (
    <button
      type="button"
      value="favourite"
      onClick={(e) => handleClick(e)}
      aria-label="Favorito"
      aria-pressed={isActive}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-magenta transition hover:brightness-110 ${isActive ? "bg-magenta gc-glow-magenta" : "bg-transparent"}`}
    >
      <i
        className={`bi ${isActive ? "bi-heart-fill" : "bi-heart"} text-base ${isActive ? "text-white" : "text-magenta"}`}
        aria-hidden="true"
        style={{ filter: brigthness }}
      />
    </button>
  )
}

export default FavouriteButton
