import config from "./Config/config";
import MessageParser from './MessageParser/MessageParser';
import ActionProvider from './ActionProvider/ActionProvider';
import Chatbot from "react-chatbot-kit";
import Fade from "react-reveal/Fade";
import Flip from "react-reveal/Flip";
import { useState } from "react";
import { useEffect } from "react";
// NOTA ARCADE: el bot es una máquina más de la sala → lanzador fijo en la
// esquina (caja de cian con ícono bi-robot y rótulo pixel "BOT") y la ventana
// del chat teñida con variantes arbitrarias de Tailwind sobre las clases que
// impone react-chatbot-kit (cab, panel y neones). Esa librería pone dos colores
// INLINE (burbuja del bot y botón enviar) que salen de `customStyles` en
// Config/config.js: ese archivo no es de este subagente y queda pendiente.
const MyChatBot = () => {
    const [showBot, setShowBot] = useState(false)

    // Overrides del CSS de react-chatbot-kit (main.css) con los tokens arcade.
    const kitTheme = [
        "[&_.react-chatbot-kit-chat-container]:w-[320px]",
        "[&_.react-chatbot-kit-chat-inner-container]:border-2",
        "[&_.react-chatbot-kit-chat-inner-container]:border-line",
        "[&_.react-chatbot-kit-chat-inner-container]:bg-cab",
        "[&_.react-chatbot-kit-chat-header]:border-b",
        "[&_.react-chatbot-kit-chat-header]:border-line",
        "[&_.react-chatbot-kit-chat-header]:bg-panel",
        "[&_.react-chatbot-kit-chat-header]:font-pixel",
        "[&_.react-chatbot-kit-chat-header]:text-[9px]",
        "[&_.react-chatbot-kit-chat-header]:uppercase",
        "[&_.react-chatbot-kit-chat-header]:text-neon",
        "[&_.react-chatbot-kit-chat-message-container]:bg-cab",
        "[&_.react-chatbot-kit-chat-message-container]:font-body",
        "[&_.react-chatbot-kit-chat-bot-message]:text-ink",
        "[&_.react-chatbot-kit-chat-bot-avatar-container]:rounded-md",
        "[&_.react-chatbot-kit-chat-bot-avatar-container]:bg-panel",
        "[&_.react-chatbot-kit-user-chat-message]:rounded-md",
        "[&_.react-chatbot-kit-user-chat-message]:border",
        "[&_.react-chatbot-kit-user-chat-message]:border-neon/70",
        "[&_.react-chatbot-kit-user-chat-message]:bg-panel",
        "[&_.react-chatbot-kit-user-chat-message]:text-ink",
        "[&_.react-chatbot-kit-user-chat-message-arrow]:border-l-panel",
        "[&_.react-chatbot-kit-chat-input]:border-t",
        "[&_.react-chatbot-kit-chat-input]:border-line",
        "[&_.react-chatbot-kit-chat-input]:bg-panel",
        "[&_.react-chatbot-kit-chat-input]:text-ink",
        "[&_.react-chatbot-kit-chat-input]:font-body",
        "[&_.react-chatbot-kit-chat-input]:outline-none",
        "[&_.react-chatbot-kit-chat-input]:focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]",
        "[&_.react-chatbot-kit-chat-input]::placeholder:text-dim",
    ].join(" ")

    return (
        <div className={`fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 ${kitTheme}`}>
            {showBot && (
                <Fade big>
                    <div className="gc-glow-cyan rounded-xl">
                        <Chatbot
                            config={config}
                            messageParser={MessageParser}
                            actionProvider={ActionProvider}
                        />
                    </div>
                </Fade>
            )
            }
            <Flip left cascade>
                <button
                    type="button"
                    aria-expanded={showBot}
                    aria-label="Bot: abrir el chat de E-robb"
                    className="gc-pixel flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-xl border-2 border-neon bg-cab/95 text-[9px] uppercase text-neon gc-glow-cyan transition hover:border-magenta hover:text-magenta"
                    onClick={() => setShowBot((prev) => !prev)}
                >
                    <i className="bi bi-robot text-xl leading-none" aria-hidden="true" />
                    <span>Bot</span>
                </button>
            </Flip>
        </div >
    );
};

export default MyChatBot;
