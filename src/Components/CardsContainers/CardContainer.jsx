import React from 'react'
import ProductCard from '../Cards/ProductCard/ProductCard.jsx'
import CardForSale from '../Cards/CardForSale/CardForSale'
import CardSlider from '../Cards/CardsSlider/CardsSlider.jsx'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAllProducts } from '../../redux/actions.js'
import { Link } from 'react-router-dom'
import Spinner from '../Spinner/Spinner.jsx'
import CardLanding from '../CardLanding/CardLanding.jsx'

const CardContainer = () => {

  const Allproducts = useSelector((state) => state.products)
  const searchered = useSelector((state) => state.searchered)
  /* const AllGenres = useSelector((state) => state.usedGenres).map(e => e.name)
  const AllPlataforms = useSelector((state) => state.usedPlatforms).map(e => e.name) */
  const AllGenres = [...new Set(Allproducts.map(e => e.genres).flat().map(e => e.name))]
  const AllPlataforms = [...new Set(Allproducts.map(e => e.platforms).flat().map(e => e.name))]

  /*
   * FILTROS DEL CARRUSEL
   * ------------------------------------------------------------------
   * Antes había listas FIJAS written a mano —géneros "Puzzle/Action/
   * Adventure/Shooter" y plataformas "PC/Linux/Xbox One/Nintendo Switch"— que
   * venían del catálogo de RAWG. Con Steam como fuente, el catálogo no tiene
   * "Puzzle", "Shooter", "Xbox One" ni "Nintendo Switch": esos filtros
   * devolvían 0 juegos y la sección se quedaba en <Spinner /> para siempre
   * ("CARGANDO..." eterno, intermitente porque el random iba rotando).
   *
   * Ahora las listas se derivan del propio catálogo (AllGenres/AllPlataforms),
   * así que nunca caen en un filtro vacío y se adaptan solas si el catálogo
   * cambia. Se filtran las que efectivamente tienen juegos.
   */
  const years = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017]

  // Géneros y plataformas que AL MENOS tienen un juego associated.
  const generosConJuegos = AllGenres.filter(
    (g) => Allproducts.some((p) => p.genres && p.genres.find((x) => x.name === g))
  )
  const plataformasConJuegos = AllPlataforms.filter(
    (pl) => Allproducts.some((p) => p.platforms && p.platforms.find((x) => x.name === pl))
  )

  const [randomGen, setRandomGen] = useState(generosConJuegos[0] || "Action")
  const [randomPlat, SetRandomPLat] = useState(plataformasConJuegos[0] || "PC")
  const [randomYear, SetRandomYear] = useState()

  // Rota el género cada 10 s, pero sólo entre los que tienen juegos.
  useEffect(() => {
    if (generosConJuegos.length < 2) return
    const t = setInterval(() => {
      setRandomGen(generosConJuegos[Math.floor(Math.random() * generosConJuegos.length)])
    }, 10000)
    return () => clearInterval(t)
  }, [generosConJuegos.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  // Idem para plataformas.
  useEffect(() => {
    if (plataformasConJuegos.length < 2) return
    const t = setInterval(() => {
      SetRandomPLat(plataformasConJuegos[Math.floor(Math.random() * plataformasConJuegos.length)])
    }, 10000)
    return () => clearInterval(t)
  }, [plataformasConJuegos.join(',')]) // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProducts())
    ramYear()
  }, [])

  /* useEffect(() => {
    setTimeout(() => {
      SetRandomGen(AllGenres[Math.floor(Math.random() * AllGenres.length)])
      
    }, 2000)
  }, [setTimeout]) */

  /*   const ramGen = async () => {
      let randGen = Math.floor(Math.random() * AllGenres.length)
      const x = await AllGenres[randGen]
      SetRandomGen(x)
    };
  
   const ramPlat = async () => {
      let randPlat = Math.floor(Math.random() * AllPlataforms.length)
      const y = await AllPlataforms[randPlat]
      SetRandomPLat(y)
    }; */

  const ramYear = () => {
    let randYear = Math.floor(Math.random() * years.length)
    const x = years[randYear]
    SetRandomYear(x)

  };

  const forSale = Allproducts.filter((e) => e.released.slice(0, 4) > randomYear)
  const genres = Allproducts.filter((c) => c.genres.find((c) => c.name === randomGen))
  const platforms = Allproducts.filter((c) => c.platforms.find((c) => c.name === randomPlat))
  
  // ARCADE: tres "pistas" de la sala (ofertas / plataformas / géneros), cada una
  // con rótulo pixel magenta y encuadre de cabina (DESIGN_SYSTEM.md §4)
  //
  // El <Spinner /> sólo aparece mientras NO hay catálogo (carga real). Si el
  // catálogo ya llegó pero un filtro quedó sin resultados, la sección se
  // omite: antes caía en el `else` y se quedaba en "CARGANDO..." para
  // siempre, que era el bug visible en la captura.
  const cargandoCatalogo = Allproducts.length === 0

  return (
        <div className="mx-auto w-full max-w-[1400px] px-4 py-8 md:px-8">

          {cargandoCatalogo ? <Spinner /> : <CardForSale forSale={forSale.slice(0,8)} />}

              {/* Plataformas */}
              {!cargandoCatalogo && platforms.length > 0 && (
              <section className="mt-12 rounded-xl border-2 border-line bg-cab/60 p-5">
              <p className="gc-pixel text-[10px] uppercase text-magenta">Recomendado</p>
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink">{randomPlat}</h2>
                <CardSlider platforms={platforms} i={1}/>
              </section>)}

              {/* Genres */}
              {!cargandoCatalogo && genres.length > 0 && (
              <section className="mt-8 rounded-xl border-2 border-line bg-cab/60 p-5">
              <p className="gc-pixel text-[10px] uppercase text-magenta">Recomendado</p>
              <h2 className="font-display text-2xl uppercase tracking-wide text-ink">{randomGen}</h2>
                <CardSlider platforms={genres} i={2}/>
              </section>)}

      </div>
  )
}

export default CardContainer
