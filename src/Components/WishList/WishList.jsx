import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { addWish, getUsers } from '../../redux/actions';
import Spinner from '../Spinner/Spinner';
import CardWhishList from './CardWishList';
import NotCardWhishList from './NotCardWishList';
import BulbRow from '../ui/BulbRow';

const WishList = () => {
  const wishList = useSelector(state => state.wishlist),
    { products } = useSelector(state => state.users),
    { user } = useSelector(state => state.users),
    token = sessionStorage.getItem('token'),
    dispatch = useDispatch();

const [logged, setLogged] = useState(false);

  useEffect(() => {
    token && dispatch(getUsers(token));
  }, []);

  useEffect(() => {
    products && wishList.length === 0 && products.map(e => dispatch(addWish(e.id)));
  }, [products]);

  setTimeout(() => {
    user === undefined && setLogged(true)
  }, 700);

  // ARCADE · SALA DE PARTIDAS GUARDADAS: rejilla de "fichas" con marco de
  // cabina; cada partida guardada la aporta CardWhishList y el estado vacío
  // NotCardWhishList.
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">
      {user?.user?.isAdmin && <Redirect to='/*' />}
      {user === undefined && logged && <Redirect to="/Login"/>}

      <BulbRow className="mb-6" />

      <p className="gc-pixel text-[10px] uppercase text-magenta">Saved games</p>
      <h1 className="mt-2 font-display text-4xl uppercase tracking-wide text-ink">WISHLIST</h1>

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {user === undefined ? <Spinner /> :
          products.length ? products?.map(e => {
            return <CardWhishList key={e.id} id={e['wishList.ProductId'] ? e['wishList.ProductId'] : e['Favorites.ProductId']} name={e.name} price={e.price} background_image={e.background_image} />
          }) :
            <NotCardWhishList />}
      </div>
    </div>
  )
}

export default WishList
