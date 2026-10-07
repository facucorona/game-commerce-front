import React from 'react'
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAllProducts, filterByGenres, filterByPlatforms } from '../../../../redux/actions.js'
import { products } from '../../../../redux/products.js'
import SearchBar from '../../../SearchBar/SearchBar'
import { Link } from 'react-router-dom'
const {REACT_APP_URL} = process.env;

// PATRÓN ARCADE: "editor de la estantería" → rótulo de cabina + filtros pixel
// + panel de filas (cada fila = una máquina con su tecla de editar/agregar).
// OJO: las clases de los <i> ('bi bi-pencil' / 'bi bi-plus-circle') y los ids
// #add / #loading NO se tocan: addToDb() los lee y reescribe por JS.

function EditProducts({setRender, setGame}) {

  const [render, setRender1] = useState('');
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getAllProducts())
  }, [dispatch])

  const addToDb = (event) => {
    event.preventDefault()
    setRender1('game added')
    let add = event.currentTarget.querySelector('#add')
    let icon = add.querySelector('i')
    if (icon.className === 'bi bi-pencil') {
      handleEdit(event)
    }else{
      let loading = event.currentTarget.querySelector('#loading')
      add.style.display = 'none'
      loading.style.display = 'block'
      let sus = event.currentTarget.id
      setTimeout(() => {
        axios.get(`${REACT_APP_URL}videogames/add_api/${sus}`)
          .then(res => {
            icon.className = 'bi bi-pencil'
            add.style.display = 'block'
            loading.style.display = 'none'
          })
          .catch(err => {
            if (err.response.data === 'Game already in DB') {
              icon.className = 'bi bi-pencil'
              add.style.display = 'block'
              loading.style.display = 'none'
            }else{
              add.style.display = 'block'
              loading.style.display = 'none'
            }
          });
      }, "500");
    }
  };

  const filterPlatforms = (event) => {
    event.preventDefault()
     dispatch(filterByPlatforms(event.target.value))
  };

  const filterGenre = (event) => {
      event.preventDefault()
      dispatch(filterByGenres(event.target.value))
  };

  const handleEdit = async (event) => {
    let id;
    if (event.currentTarget.id) {
      id = event.currentTarget.id
    }else{
      id = event.target.id
    }
    setTimeout(() => {
      axios.get(`${REACT_APP_URL}videogames/${id}`)
        .then(res => {
          setGame(res.data)
          setRender({editForm: true});
        })
        .catch(err => console.log(err));
    }, "500");
  }


  const products = useSelector((state) => state.products)
  let platforms = [...new Set(products.map(e => e.platforms).flat().map(e => e.name))]
  let genres = [...new Set(products.map(e => e.genres).flat().map(e => e.name))]
  //console.log(products);
  const searchered = useSelector((state) => state.searchered);
  const games = searchered.length ? searchered : products


  var color = 'black'

  return (
    <div className="mx-auto w-full max-w-[1400px]">
      
      <p className="gc-pixel text-[10px] uppercase text-magenta">Productos</p>
      <h1 className="font-display text-4xl uppercase tracking-wide text-ink">Edit Product</h1>
      
      
      <div className="mt-4 flex justify-center"><SearchBar /></div>


      <div className="mt-4 mb-3 flex flex-wrap items-center justify-center gap-4">
      <div className="flex flex-col gap-2">
          <label htmlFor="filterPlatforms" className="gc-pixel text-[9px] uppercase text-dim">Platforms</label>
          <select id="filterPlatforms" className="w-full min-w-[180px] rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" aria-label="Default select example" onChange={(e) => filterPlatforms(e)}>
            <option value="default">Platforms</option>
            {platforms.length && platforms.map(e => (
              <option key={e.name} value={e}>{e}</option>
            ))}
          </select>
        </div>

      <div className="flex flex-col gap-2">
          <label htmlFor="filterGenres" className="gc-pixel text-[9px] uppercase text-dim">Genres</label>
          <select id="filterGenres" className="w-full min-w-[180px] rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" aria-label="Default select example" onChange={(e) => filterGenre(e)}>
            <option value="default">Genres</option>
            {genres.length && genres.map(e => (
              <option key={e.name} value={e}>{e}</option>
            ))}
          </select>
        </div>

      </div>

      {/*<div className={style.text}>

        <select className="form-select" multiple aria-label="multiple select example" className={style.games}>
          {games.length && games.map((product, index) => {
            return <option
              key={index}
              onClick={(e) => handleClick(e)}
              value={product.id}>
              {product.name}
            </option>
          })};
        </select>

      </div>*/}

      <div className="max-h-[450px] overflow-y-auto rounded-xl border-2 border-line bg-cab">
        {games.length && games.map((product, index) => {
          if (color === 'white') {
            color = 'rgba(140, 144, 147, 0.138)'
          }else{color = 'white'}
            return <div className="flex items-center gap-4 border-b border-line bg-cab px-4 py-3 text-sm text-ink odd:bg-panel hover:bg-panel">
              <div id={product.id} className="cursor-pointer text-left text-ink" onClick={(e) => handleEdit(e)}>{product.name}</div>
              {!product.fromApi ? <div className="ml-auto w-10 cursor-pointer text-neon" onClick={(e) => handleEdit(e)}><i id={product.id} className="bi bi-pencil" aria-hidden="true" /></div> :
              <div id={product.id} className="ml-auto w-10 cursor-pointer text-neon" onClick={(e) => addToDb(e) }><div id='add' className="w-10" style={{display: 'block'}}><i className="bi bi-plus-circle" aria-hidden="true" /></div><div id='loading' className="mx-auto h-4 w-4 rounded-full border-2 border-neon border-t-transparent animate-spin" style={{display: 'none'}} /></div>}
            </div>
        })}
      </div>

    </div>
  )
}

export default EditProducts
