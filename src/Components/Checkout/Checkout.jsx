import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from "axios"
const FORM_ID = 'payment-form';

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · CABINA DE PAGO MERCADOPAGO
 * Solo markup y clases: el form (#payment-form) es el ancla que usa MercadoPago
 * para inyectar su script y su botón, así que conserva id, method y nombre.
 * useEffect + initMercadoPago + preferences intactos.
 * ────────────────────────────────────────────────────────────────────────── */

export default function Checkout({games}) {
    const {REACT_APP_URL} = process.env;
    const { id } = useParams(); // id de producto
    const [preferenceId, setPreferenceId] = useState(null);

    // let game = useSelector(state.cart)

    useEffect(() => {
        // luego de montarse el componente, le pedimos al backend el preferenceId
        axios.post(`${REACT_APP_URL}payment`, games)

            .then((order) => {
                order = order.data
                setPreferenceId(order.preferenceId);
            });
    }, [id]);

    useEffect(() => {
        if (preferenceId) {
            // con el preferenceId en mano, inyectamos el script de mercadoPago
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src =
                'https://www.mercadopago.com.ar/integrations/v1/web-payment-checkout.js';
            script.setAttribute('data-preference-id', preferenceId);
            const form = document.getElementById(FORM_ID);
            form.appendChild(script);
        }
    }, [preferenceId]);

    return (
        /* El botón real de MercadoPago lo inyecta el SDK dentro de este form */
        <form
            id={FORM_ID}
            method="GET"
            className="w-full rounded-lg border border-neon/50 bg-panel/70 p-4"
        />
    );
}
