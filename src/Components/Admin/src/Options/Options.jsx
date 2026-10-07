import React from 'react'


// PATRÓN ARCADE: el riel de pestañas del admin. Cada botón es una "tecla de
// máquina": etiqueta pixel + ícono bi, bisel violeta y foco cian al pasar el
// mouse. El grupo "Products" ya no es un desplegable de Bootstrap (su JS se
// eliminó): sus dos botones quedan siempre visibles, apilados y con sangría.

function Optios({setRender}) {
  
  function handleClick(e) {
    e.preventDefault();
    if(e.target.value === 'dash'){
      setRender({dash: true})
    }else if(e.target.value ===  'add'){
      setRender({add: true})
    }else if(e.target.value === 'edit'){
      setRender({edit: true})
    }else if(e.target.value === 'user'){
      setRender({user: true})
    }
  }

  return (
    <nav className="mt-6 flex flex-col gap-2">
      <button value='dash' className="gc-pixel flex w-full items-center gap-3 rounded-md border border-line px-4 py-3 text-left text-[10px] uppercase text-dim transition hover:border-neon hover:text-neon" type="button" aria-expanded="false" onClick={(e) => {handleClick(e)}}>
        <i className="bi bi-speedometer2 text-sm text-neon" aria-hidden="true" />
        Dashboard
      </button>

      <div className="mt-2 flex flex-col gap-2">
        <p className="gc-pixel px-1 text-[9px] uppercase text-dim/70">Products</p>
        <button className="gc-pixel flex w-full items-center gap-3 rounded-md border border-line px-4 py-3 text-left text-[10px] uppercase text-dim transition hover:border-neon hover:text-neon" type="button" onClick={(e) => {handleClick(e)}} value='add'>
          <i className="bi bi-plus-circle text-sm text-magenta" aria-hidden="true" />
          Add a new game
        </button>
        <button className="gc-pixel flex w-full items-center gap-3 rounded-md border border-line px-4 py-3 text-left text-[10px] uppercase text-dim transition hover:border-neon hover:text-neon" type="button" onClick={(e) => {handleClick(e)}} value='edit'>
          <i className="bi bi-pencil-square text-sm text-magenta" aria-hidden="true" />
          Edit Product
        </button>
      </div>

      <button className="gc-pixel flex w-full items-center gap-3 rounded-md border border-line px-4 py-3 text-left text-[10px] uppercase text-dim transition hover:border-neon hover:text-neon" type="button" aria-expanded="false" onClick={(e) => {handleClick(e)}} value='user'>
        <i className="bi bi-people text-sm text-neon" aria-hidden="true" />
        Users
      </button>
    </nav>
  )
}

export default Optios