import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// NOTA: se quitó `import 'tw-elements'`. El plugin y su JS nunca tuvieron uso real
// (0 atributos data-te-* en todo el proyecto) y solo aportaba peso al bundle.
import App from './App';
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";
import store from "./redux/store.js"
import axios from 'axios';

/*
 * INTERCEPTOR DE AUTENTICACIÓN
 * ----------------------------------------------------------------------------
 * El backend lee el JWT **únicamente de la query**: `?tkn=<token>`
 * (ver ExtractJWT.fromUrlQueryParameter('tkn') en el API).
 *
 * El proyecto original pasaba el token a mano en algunas llamadas
 * (`...videogames?id=1?tkn=${token}`) y lo olvidaba en otras. El síntoma era
 * que varias pantallas pedían 401 sin motivo aparente, por ejemplo:
 *     GET /order/user/2   →  401   (biblioteca y órdenes del usuario)
 *     POST /payment       →  401   (checkout)
 *
 * Este interceptor agrega el token a TODAS las peticiones que no lo bringan
 * todavía, así el guard del API deja de rechazar llamadas legítimas.
 * No pisamos las que ya traen `tkn=` (las manuales del código original).
 */
axios.interceptors.request.use((config) => {
  const token = window.sessionStorage.getItem('token');
  // No agregar token a endpoints públicos:
  // - /videogames (catálogo y búsqueda)
  // - /videogames/:id (detalle)
  // - /genres, /platforms (filtros)
  // - /reviews (reseñas públicas)
  // - /login, /logout, /signin, /restore, /user/find (auth)
  const publicPaths = ['/videogames', '/genres', '/platforms', '/reviews', '/login', '/logout', '/signin', '/restore', '/user/find'];
  const isPublic = publicPaths.some(p => config.url?.includes(p));
  if (token && !isPublic && !config.url.includes('tkn=')) {
    config.url =
      config.url + (config.url.includes('?') ? '&' : '?') + 'tkn=' + encodeURIComponent(token);
  }
  return config;
});

ReactDOM.render(
<BrowserRouter>
  <Provider store={store}>
    <App />
  </Provider>
</BrowserRouter>,
  document.getElementById('root')
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
