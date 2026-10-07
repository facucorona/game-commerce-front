import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import SearchBar from "../SearchBar/SearchBar"
// NOTA ARCADE: NavBar.css se eliminó. El menú se construye con tokens y
// utilidades propias (Tailwind) en vez de clases de Bootstrap.
// Patrón de referencia del proyecto → ver DESIGN_SYSTEM.md §4 "Marquesina".
import { logout } from './NavBarHelper'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getUsers, resetUser, addToCart, removeFromCart, getUserOrders } from '../../redux/actions'
import BulbRow from '../ui/BulbRow';

const NavBar = () => {
  let location = useLocation();
  const [show, setShow] = useState(false);
  const { user } = useSelector(state => state.users);
  const cart = useSelector(state => state.cart);
  let dispatch = useDispatch();

  async function handleLogout() {
    window.sessionStorage.removeItem('token');
    await logout()
    localStorage.removeItem("cart");
    if (cart.length > 0) {
      cart.forEach(id => dispatch(removeFromCart(id)))
    }
    dispatch(resetUser());
    window.location.reload()
  };

  useEffect(() => {
    const token = window.sessionStorage.getItem('token');
    token && dispatch(getUsers(token));
    dispatch(removeFromCart());
  }, []);

  useEffect(() => {
    const shopCart = JSON.parse(localStorage.getItem("cart"));

    const data = new Set(shopCart);
    [...data].length && [...data].map(e => {
      if(!cart.includes(e))
      dispatch(addToCart(e));
    })
  }, [])


  useEffect(() => {
    user && dispatch(getUserOrders(user.id));
  }, [user])

  var isAdmin = false;

  if (user && user.isAdmin) {
    isAdmin = true;
  }

  function handleClick() {
    show ? setShow(false) : setShow(true)
  }

  /* ---------------- piezas de la marquesina ---------------- */
  // Enlace del menú: etiqueta pixel + ícono. El activo se enciende en cian.
  const navItem = (to, icon, label, extra = '') => (
    <NavLink
      to={to}
      className={`gc-pixel flex items-center gap-2 rounded-md border border-transparent px-3 py-2 text-[11px] uppercase text-dim transition hover:border-line hover:text-neon ${extra}`}
      activeStyle={{ color: 'hsl(var(--neon))', borderColor: 'hsl(var(--line))' }}
    >
      <i className={`bi ${icon} text-sm`} aria-hidden="true" />
      {label}
    </NavLink>
  )

  return (
    <>
      {/* ARCADE: la fila de bombillas del marco. Puramente decorativa. */}
      <BulbRow />

      <nav className="sticky top-0 z-40 border-b-2 border-line bg-cab/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-3 px-4 py-2">

          <NavLink to="/" className="flex items-center gap-3 py-2">
            <span className="gc-title font-display text-4xl leading-tight tracking-wide text-magenta"
              onMouseEnter={(e) => { if (e.target.classList.contains('g-mag')) e.currentTarget.classList.add('hover-mag'); if (e.target.classList.contains('g-neon')) e.currentTarget.classList.add('hover-neon'); }}
              onMouseLeave={(e) => { e.currentTarget.classList.remove('hover-mag', 'hover-neon'); }}
            >
              <span className="g-mag">GAM</span><span className="g-neon text-neon">E</span><span className="g-mag">-</span><span className="g-neon text-neon">COMMERCE</span>
            </span>
          </NavLink>

          {/* Botón de menú en mobile: el estado `show` ya vivía en React,
              por lo que sigue funcionando sin el JS de Bootstrap. */}
          <button
            onClick={() => handleClick()}
            type="button"
            className="gc-pixel ml-auto rounded-md border border-line px-3 py-2 text-[10px] uppercase text-dim hover:border-neon hover:text-neon md:hidden"
            aria-expanded={show}
            aria-controls="gc-nav"
            aria-label="Abrir menú"
          >
            {show ? "Cerrar" : "Menú"}
          </button>

          <div
            id="gc-nav"
            className={`${show ? 'flex' : 'hidden'} w-full flex-col items-stretch gap-1 md:ml-auto md:flex md:w-auto md:flex-row md:items-center md:gap-1`}
          >
            {navItem("/home", "bi-controller", "Home")}

            {user && !user.isAdmin && navItem("/my_store", "bi-disc", "Library")}
            {user && !user.isAdmin && navItem("/wish_list", "bi-heart", "Wishlist")}
            {user && user.isAdmin && navItem("/admin", "bi-speedometer2", "Admin")}
            {!isAdmin && navItem("/shopping_cart", "bi-cart", "Cart")}

            {!user && navItem("/login", "bi-box-arrow-in-right", "Login")}

            {["/home", "/"].includes(location.pathname) && <SearchBar />}

            {/* Avatar + nombre: lleva al perfil */}
            {user && (
              <NavLink to="/userprofile" className="gc-pixel flex items-center gap-2 rounded-md border border-line px-3 py-2 text-[10px] uppercase text-dim hover:border-neon hover:text-neon">
                <span className="hidden sm:inline">{user.username}</span>
                <img src={user.profile_pic} alt="Tu avatar" className="h-7 w-7 rounded-full border border-neon object-cover" />
              </NavLink>
            )}

            {user && (
              <NavLink
                to='/home'
                className="gc-pixel rounded-md border border-transparent px-3 py-2 text-[10px] uppercase text-dim transition hover:border-line hover:text-neon"
                activeStyle={{ color: 'hsl(var(--neon))' }}
              >
                <span onClick={() => handleLogout()}>
                  <i className="bi bi-power me-2 text-sm" aria-hidden="true" />
                  Logout
                </span>
              </NavLink>
            )}

            {location.pathname.includes('/detail') && (
              <NavLink to="/home" className="gc-pixel rounded-md bg-magenta px-4 py-2 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110">
                Volver
              </NavLink>
            )}
          </div>
        </div>

        {/* Contador de créditos del carrito: "créditos" = unidades de juego.
            OJO con el singular: antes decía "1 CRÉDITOS CARGADOS". */}
        {cart.length > 0 && (
          <div className="border-t border-line/60 bg-panel/60">
            <div className="gc-pixel mx-auto flex w-full max-w-[1400px] items-center gap-2 px-4 py-1.5 text-[9px] uppercase text-dim">
              <i className="bi bi-coin text-credit" aria-hidden="true" />
              <span className="text-credit">{cart.length}</span>{' '}
              {cart.length === 1 ? 'crédito cargado' : 'créditos cargados'}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}

export default NavBar
