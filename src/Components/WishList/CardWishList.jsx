import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeWish, addToCart, removeFromCart, getUsers } from '../../redux/actions';
import { deleteFavorite } from '../FavouriteButton/FavoriteButton';
import Swal from 'sweetalert2';

export default function CardWhishList({ id, name, price, background_image }) {
    const token = sessionStorage.getItem('token'),
        [inShopCart, setInShopCart] = useState(false),
        [isClose, setIsClose] = useState(false),
        cart = useSelector(state => state.cart),
        dispatch = useDispatch();

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white',
            cancelButton: 'gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon'
        },
        buttonsStyling: false
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        const cartLS = JSON.parse(localStorage.getItem("cart"));
        for (const e of cartLS) {
            if (e === id) {
                setInShopCart(true)
                return
            }
        }
        setInShopCart(false)
    });

    useEffect(() => {
        dispatch(getUsers(token))
    }, [isClose]);

    async function handleClose() {
        dispatch(removeWish(id));
        await deleteFavorite(id, token);
        setIsClose(true)
    };

    function handleShopCart(e) {
        if (e.target.id === 'addShop') {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Succesfully added to your cart',
                showConfirmButton: false,
                timer: 1500
            })
            dispatch(addToCart(id));
        } else {
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
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
            })
        }
    }

    // ARCADE · PARTIDA GUARDADA: tarjeta de cabina con carátula en modo
    // atracción, precio en verde créditos y botón "INSERT COIN"/"RETIRE COIN".
    return (
            <div className="w-[280px] overflow-hidden rounded-xl border-2 border-line bg-cab/90 gc-drop-in hover:border-neon/70" aria-current="true">
                <div className="flex w-full justify-end border-b border-line/60 px-4 py-2">
                    <button onClick={() => handleClose()} type="button" className="gc-pixel rounded-md border border-line px-3 py-1.5 text-[9px] uppercase text-dim transition hover:border-destructive hover:text-destructive" aria-label="Close">
                        <i className="bi bi-x-lg" aria-hidden="true" />
                    </button>
                </div>

                <div>
                    <Link to={'/detail/' + id} className="block gc-attract gc-scanlines transition hover:brightness-110" style={{ textDecoration: 'none' }} aria-current="true" >
                        <img className="h-[140px] w-full object-cover" src={background_image} alt={name} />
                        <h5 className="gc-pixel px-4 py-3 text-[10px] uppercase text-ink" >{name}</h5>
                    </Link>
                    <div className="flex items-center justify-between px-4 pb-4">
                        <small className="gc-pixel text-[11px] text-credit">${price}</small>
                        <small className="gc-pixel text-[8px] uppercase text-dim">Credits</small>
                    </div>
                </div>

                {inShopCart ?
                    <small id='deleteShop' className="gc-pixel block w-full cursor-pointer border-t border-line px-4 py-3 text-center text-[9px] uppercase text-neon transition hover:bg-neon/10" onClick={(e) => handleShopCart(e)}>Retire coin</small> :
                    <small id='addShop' className="gc-pixel block w-full cursor-pointer border-t border-line px-4 py-3 text-center text-[9px] uppercase text-magenta transition hover:bg-magenta/10" onClick={(e) => handleShopCart(e)}>Insert coin</small>}
            </div>
    );
};
