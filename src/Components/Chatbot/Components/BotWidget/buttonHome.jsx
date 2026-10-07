import React from "react";
import { Link } from "react-router-dom";

// NOTA ARCADE: las opciones del bot son teclas de máquina → botón pixel con
// borde cian. Se sacan el import de linkTohome.css y la clase `.link` (que
// solo pintaba el Link de negro); los `to` de cada Link no se tocan.
export default function GoHome (props){

    return(<div className="mt-2 flex justify-center">
        <Link to="/home" className="no-underline">
            <button type="button" className="gc-pixel flex items-center gap-2 rounded-md border border-neon/70 px-4 py-2 text-[9px] uppercase text-neon transition hover:bg-neon/10">
                <i className="bi bi-house" aria-hidden="true" />
                Ir al home.
            </button>
        </Link>
    </div>) 
}
