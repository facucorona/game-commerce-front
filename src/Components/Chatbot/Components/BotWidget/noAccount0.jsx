import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

// NOTA ARCADE: opción del bot = tecla de máquina → botón pixel con borde cian.
// Se sacan el import de linkTohome.css y la clase `.link`; el `to` y los hooks
// (importados pero sin uso) quedan intactos.
export default function NoAccount1 (props){

    return(<div className="mt-2 flex justify-center">
    <Link to="/login" className="no-underline">
        <button type="button" className="gc-pixel flex items-center gap-2 rounded-md border border-neon/70 px-4 py-2 text-[9px] uppercase text-neon transition hover:bg-neon/10">
            <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
            Logueate aquí!
        </button>
    </Link>
    </div>) 
}
