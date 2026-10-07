import React from "react";
// NOTA ARCADE: el avatar es la "cabina" del bot → caja cuadrada con bisel
// magenta y el ícono bi-robot en cian (sin imagen externa). Se saca el import
// de BotAvatar.modules.css porque su clase `.botAvatar` ya no se usa.
export default function Botavatar (){
    return <div className="gc-pixel flex h-full w-full items-center justify-center rounded-md border-2 border-magenta bg-panel text-base text-neon">
            <i className="bi bi-robot" aria-hidden="true" />
    </div>
};
