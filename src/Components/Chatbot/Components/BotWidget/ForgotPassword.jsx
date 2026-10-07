import React from "react";
import { Link } from "react-router-dom";

// NOTA ARCADE: opción del bot = tecla de máquina → botón pixel con borde cian
// (mismo criterio que buttonHome/noAccount0/noAccount1). Fuera el import de
// linkTohome.css y la clase `.link`; el `to` del Link queda igual.
export default function ForgottenPassword (props){
    return(<div className="mt-2 flex justify-center">
        <Link to="/login/restore" className="no-underline">
            <button type="button" className="gc-pixel flex items-center gap-2 rounded-md border border-neon/70 px-4 py-2 text-[9px] uppercase text-neon transition hover:bg-neon/10">
                <i className="bi bi-key" aria-hidden="true" />
                Restaurar contraseña.
            </button>
        </Link>
    </div>) 
}
