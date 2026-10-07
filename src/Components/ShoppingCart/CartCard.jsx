import { useDispatch } from "react-redux";
import { Link } from "react-router-dom"
import { $CombinedState } from "redux";
import { removeFromCart } from "../../redux/actions"

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · ÍTEM DEL CARRITO
 * Fila de "máquina": miniatura con marco cian, nombre en display, precio en
 * verde de créditos, contador de unidades y el botón de quitar. El selector
 * de cantidad es SOLO lectura (la app guarda un crédito por juego, así que
 * agregar un control que despachara sería lógica nueva: no va aquí).
 * ────────────────────────────────────────────────────────────────────────── */

function CartCard({id, name, img, rating, platforms, price}) {
    let dispatch = useDispatch()
    let platformsString = "";
  platforms && platforms.forEach(e=> platformsString = platformsString + `  ${e.name}`);
    
    function handleRemove(){
        dispatch(removeFromCart(id))
        let LS = JSON.parse(localStorage.getItem("cart"));
        LS = LS.filter(e=> e!==id);
        localStorage.setItem("cart", JSON.stringify(LS))
        window.location.reload();
    }

    return (
    <div className="flex w-full flex-col gap-4 rounded-xl border-2 border-line bg-cab/80 p-4 transition hover:border-neon/60 sm:flex-row sm:items-center">

      {/* Miniatura: la foto de la cabina */}
      <Link to={`/detail/${id}`} className="block shrink-0">
        <img
          className="h-28 w-full rounded-lg border border-line object-cover transition hover:border-neon hover:gc-glow-cyan sm:w-48"
          src={img}
          alt={`${name} thumbnail`}
        />
      </Link>

      {/* Datos + mandos */}
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div className="min-w-0">
          <p className="gc-pixel text-[9px] uppercase text-dim">Credito cargado</p>
          <Link
            to={`/detail/${id}`}
            className="font-display text-2xl uppercase leading-tight tracking-wide text-ink transition hover:text-neon"
          >
            {name}
          </Link>
          <p className="gc-pixel mt-2 text-[9px] uppercase text-dim">
            <i className="bi bi-controller mr-1" aria-hidden="true" />
            {platformsString}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">

          {/* Precio en créditos */}
          <span className="gc-pixel text-sm text-credit">ARS$ {price}</span>

          {/* Cantidad: 1 crédito por juego (solo lectura) */}
          <div className="flex items-center gap-2">
            <span className="gc-pixel text-[9px] uppercase text-dim">Qty</span>
            <span className="gc-pixel flex h-8 min-w-[2.5rem] items-center justify-center rounded-md border border-line bg-panel px-2 text-[10px] text-ink">
              01
            </span>
          </div>

          <button
            onClick={(e)=> handleRemove(e)}
            type="button"
            className="gc-pixel rounded-md border border-destructive/70 px-4 py-2 text-[10px] uppercase text-destructive transition hover:bg-destructive/10"
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartCard
