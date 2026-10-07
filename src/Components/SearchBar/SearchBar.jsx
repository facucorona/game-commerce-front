import { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { clear, searchProduct, setCurrentPage } from "../../redux/actions.js"
// NOTA ARCADE: el buscador es el "slot" de tokens de la marquesina → input de
// cabina con ícono bi-search y botón pixel magenta "BUSCAR".
// Búsqueda en vivo con debounce 350 ms; al vaciar el input se limpia automáticamente.
// No hay botón "Ver todo": input vacío = catálogo completo.
const SearchBar = () => {
  const [name, setName] = useState("");
  const [liveQuery, setLiveQuery] = useState("");
  const dispatch = useDispatch();
  const { searchered } = useSelector(state => ({
    searchered: state.searchered,
  }));
  const debounceRef = useRef(null);
  const lastRequestId = useRef(0);

  // Búsqueda en vivo con debounce: dispara a los 350 ms y cancela si hay nueva tecla
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    lastRequestId.current += 1;
    const thisRequestId = lastRequestId.current;

    debounceRef.current = setTimeout(() => {
      if (thisRequestId !== lastRequestId.current) return;
      const q = liveQuery.trim();
      if (q.length >= 2) {
        dispatch(searchProduct(q));
        dispatch(setCurrentPage(1));
      } else if (q.length === 0) {
        dispatch(clear());
        dispatch(setCurrentPage(1));
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [liveQuery, dispatch]);

  // Handler del input: actualiza estado local Y liveQuery (para debounce)
  function handleChange(e) {
    e.preventDefault();
    const val = e.target.value;
    setName(val);
    setLiveQuery(val);
  }

  // Limpia el input y el catálogo
  function handleClear(e) {
    e.preventDefault();
    dispatch(clear());
    dispatch(setCurrentPage(1));
    setName("");
    setLiveQuery("");
  }

  // Mostrar botón de limpiar (X) solo si hay texto en el input
  const showClear = name.length > 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <form className="flex items-center gap-2" role="search">
          <div className="relative">
            <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-dim" aria-hidden="true" />
            <input
              className="gc-pixel w-full min-w-[160px] max-w-[260px] rounded-lg border border-line bg-panel py-2 pl-9 pr-3 text-[10px] normal-case text-ink outline-none transition placeholder:text-dim placeholder:uppercase focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)] sm:w-64"
              type="search"
              placeholder="Buscar juego..."
              aria-label="Search"
              value={name}
              onChange={handleChange}
            />
            {showClear && (
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 gc-pixel text-dim hover:text-neon transition"
                onClick={handleClear}
                aria-label="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default SearchBar