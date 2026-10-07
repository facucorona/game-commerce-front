import React, { useState } from "react";
import { getAllProducts, filterByGenres, filterByPlatforms, getGenres, getPlatforms, setCurrentPage, orderEsrb, clear, priceFilter } from '../../redux/actions';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MessageParser from '../Chatbot/MessageParser/MessageParser';
import ActionProvider from '../Chatbot/ActionProvider/ActionProvider';
import config from '../Chatbot/Config/config';
import Chatbot from 'react-chatbot-kit'
import 'react-chatbot-kit/build/main.css'
import MyChatBot from "../Chatbot/chatbot";

/* const esrbMock = [ "Teen", "Mature", "Not rated", "Adults Only", "Everyone", "Everyone 10+", "Rating Pending" ] */

// NOTA ARCADE: los filtros son la cabina de control del catálogo → panel con
// rótulo pixel "FILTROS", grupos etiquetados, selectores de cabina y el
// precio como un créditos-verde (accent-neon en el range).
// Se eliminó `import "./SideBar.css"` y sus estilos inline: la lógica (useState,
// useEffect, dispatch y los value/onChange) queda intacta.

export default function SideBar() {

  const dispatch = useDispatch();

  const products = useSelector((state) => state.products)
  let genres = [...new Set(products.map(e => e.genres).flat().map(e => e.name))]
  let platforms = [...new Set(products.map(e => e.platforms).flat().map(e => e.name))]
  let esrb = [...new Set(products.map(e => e.esrb_rating))]
  let prices = [...new Set(products.map(e => e.price).sort((a, b) => a - b))]


  // FIX: con el catálogo vacío `prices` es [] y prices[0] / prices[length-1]
  // dan undefined. Ese undefined se metía en minPrice/maxPrice y el <input
  // type="range"> pasaba de controlado a no controlado en cada render
  // (warning "changing a controlled input to be uncontrolled") y el slider
  // quedaba inservible. Con estos defaults nunca hay undefined.
  let min = prices.length ? Number(prices[0]) : 0
  let max = prices.length ? Number(prices[prices.length - 1]) : 100

  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(0)

  // console.log(maxPrice)
  /*   const minprice = (e) => {
      e.preventDefault() 
      setMinPrice(parseInt(e.target.value))
    };
   */
  const hanleChange = (e) => {
    e.preventDefault()
    setMaxPrice(parseInt(e.target.value))
  };

  // BUG (NO TOCADO): `max` sale de precios[length-1]; si el catálogo está vacío
  // vale undefined y este useEffect deja maxPrice/minPrice en undefined.
  // El <input type="range"> controlado recibe value={undefined} y React avisa
  // "A component is changing an uncontrolled input to be controlled".
  useEffect(() => {
    setMaxPrice(max)
    setMinPrice(min)
  }, [products])



  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  function handleFilterByGenre(e) {
    e.preventDefault();
    if (e.target.value !== "default") {
      dispatch(filterByGenres(e.target.value));
      dispatch(setCurrentPage(1))
    }
  };

  function handleFilterByPlatforms(e) {
    e.preventDefault();
    if (e.target.value !== "default") {
      dispatch(filterByPlatforms(e.target.value));
      dispatch(setCurrentPage(1))
    }
  };

  function applyPrice(e) {
    e.preventDefault()
    dispatch(priceFilter(maxPrice))
  }

  function esrbContent(e) {
    e.preventDefault()
    let value = e.target.value
    if (value !== "default") {
      /* console.log(value) */
      dispatch(orderEsrb(value))
    };
  };

  function handleClick(e) {
    /*  setMaxPrice(max)
     setMinPrice(min) */
    dispatch(clear())
  };

  // Clases compartidas por los tres selectores: panel con bisel violeta.
  const selectClass = "gc-pixel w-full appearance-none rounded-lg border border-line bg-panel px-3 py-2 text-[10px] uppercase text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]"
  const labelClass = "gc-pixel mb-2 block text-[9px] uppercase text-dim"

  return (
    <div className="rounded-xl border-2 border-line bg-cab/80 p-5">
      <p className="gc-pixel mb-4 border-b border-line/60 pb-3 text-[10px] uppercase text-magenta">
        Filtros
      </p>

      <div>
        <small className={labelClass}>Genres</small>
        <select className={selectClass} aria-label="Default select example" onChange={(e) => handleFilterByGenre(e)}>
          <option value="default">Genres</option>
          {genres.length && genres.map(e => (
            <option key={e.name} value={e}>{e}</option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <small className={labelClass}>Platforms</small>
        <select className={selectClass} aria-label="Default select example" onChange={(e) => handleFilterByPlatforms(e)}>
          <option value="default">Platforms</option>
          {platforms.length && platforms.map(e => (
            <option key={e.name} value={e}>{e}</option>
          ))}
        </select>
      </div>
      <div className="mt-3">
        <small className={labelClass}>ESRB</small>
        <select className={selectClass} aria-label="Default select example" onChange={(e) => esrbContent(e)}>
          <option value="default">ESRB Rating</option>
          {esrb?.map((esrb, index) => (
            <option key={index} value={esrb}> {esrb} </option>
          ))}
        </select>
      </div>

      <div className="mt-4 w-full">
        {maxPrice > 1 ? <label htmlFor='rangeMax' className='gc-pixel mb-2 block text-[9px] uppercase text-credit'> Under ${maxPrice - 1} </label> : <label htmlFor='rangeMax' className='gc-pixel mb-2 block text-[9px] uppercase text-credit'> ${minPrice}</label>}
        <input className="h-2 w-full cursor-pointer accent-neon" id='rangeMax' disabled={false} value={maxPrice} onChange={(e) => hanleChange(e)} type="range" min={min} max={max} step='10' />
      </div>

      {/* <div>
          <label htmlFor='rangeMin' className='gc-pixel mb-2 block text-[9px] uppercase text-credit'> Low Price ${minPrice}</label>
          <input id='rangeMin' className="h-2 w-full cursor-pointer accent-neon" onChange={(e) => minprice(e)} type="range" min={min} max={maxPrice} step='1'/>
        </div> */}

      <button className="gc-pixel mt-4 w-full rounded-md bg-magenta px-4 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110" onClick={applyPrice}>Apply Price</button>


      <div>
        <button className="gc-pixel mt-3 w-full rounded-md border border-neon/70 px-4 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" onClick={handleClick}>Reset Filters</button>
      </div>

      <div className="my-4" />

      <MyChatBot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </div>
  )
}
