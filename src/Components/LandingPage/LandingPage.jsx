import React from 'react'
import { useLocation, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "../NavBar/NavBar.jsx";
import CardContainer from '../CardsContainers/CardContainer.jsx'
import SideBar from '../SideBar/SideBar.jsx';
import CreateUser from '../CreateUser/CreateUser';
import Login from '../Login/Login';
import ShoppingCart from '../ShoppingCart/ShoppingCart';


export default function LandingPage() {

  let location = useLocation();

  // ARCADE: rótulo gigante de marquesina + fila de bombillas + subtítulo pixel
  // "1 CRÉDITO = 1 JUEGO" y los dos CTAs (INSERT COIN / VER CATÁLOGO).
  // Abajo sigue el contenido que ya renderizaba (CardContainer).
  return (
    <div className="w-full">
      <section className="gc-vignette relative overflow-hidden border-b-2 border-line">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-20 text-center md:px-8 md:py-28">
          <p className="gc-pixel gc-blink text-[11px] uppercase text-neon">High score · Ahora disponible</p>

          {/*
            FIX IMPORTANTE: el halo del título estaba hecho con `gc-glow-magenta`,
            que es un box-shadow → dibuja un RECTANGULO alrededor del h1 (se veía
            una banda oscura cruzando las letras). Para texto el halo va con
            `drop-shadow`, que sigue la silueta de las letras.
            Valor copiado del mock: drop-shadow(0 0 13px #FF2E9366).
          */}
          <h1 className="gc-title mt-6 font-display uppercase leading-[0.9] tracking-[4px] text-magenta text-[clamp(2.5rem,9vw,7.5rem)]"
            onMouseEnter={(e) => { if (e.target.classList.contains('g-mag')) e.currentTarget.classList.add('hover-mag'); if (e.target.classList.contains('g-neon')) e.currentTarget.classList.add('hover-neon'); }}
            onMouseLeave={(e) => { e.currentTarget.classList.remove('hover-mag', 'hover-neon'); }}
          >
            <span className="g-mag">GAM</span><span className="g-neon text-neon">E</span><span className="g-mag">-</span><span className="g-neon text-neon">COMMERCE</span>
          </h1>

          <p className="gc-pixel mt-8 text-xs uppercase text-credit">1 Crédito = 1 Juego</p>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              className="gc-pixel rounded-md bg-magenta px-7 py-4 text-[11px] uppercase text-white gc-glow-magenta transition hover:brightness-110"
              to="/login"
            >
              Insert coin
            </Link>
            <a
              className="gc-pixel rounded-md border border-neon/70 px-7 py-4 text-[11px] uppercase text-neon transition hover:bg-neon/10"
              href="#catalogo"
            >
              Ver catálogo
            </a>
          </div>
        </div>
      </section>

      <div id="catalogo" className="flex ">
        {/* {location.pathname === "/" && <SideBar/>} */}
        {location.pathname === "/" && <CardContainer />}
      </div>
    </div>
  )
}
