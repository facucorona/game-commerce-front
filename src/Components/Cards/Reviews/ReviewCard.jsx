import React, { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Dispatch } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addRemoveReview, deleteReview, editReview, getUserReviews } from '../../../redux/actions'
import Swal from 'sweetalert2'

/* ─────────────────────────────────────────────────────────────────────────────
 * PATRÓN ARCADE · RESEÑA = FILA DE TABLA DE RÉCORDS
 * Cada review es una fila de "high score": borde line, fondo cab, autor en
 * magenta y puntaje en verde de créditos (pixel). El modo edición (mis
 * reseñas) abre los controles en la misma fila, con inputs de máquina.
 * ────────────────────────────────────────────────────────────────────────── */

function validate(input) {
  let error = {};
  if (!input.description || input.description.length > 255) error.description = "Description required with no more than 256 characters"
  if (!input.rating || input.rating < 0 || input.rating > 100) error.rating = "1 - 100"
  return error
};

export default function ReviewCard({ username, rating, description, userImg, id, reviews, setReviews }) {

  let dispatch = useDispatch();

  let { user } = useSelector(state => state.users);
  const [myReview, setMyReview] = useState(false);
  const [edit, setEdit] = useState(false);
  const [activeSubmit, SetactiveSubmit] = useState(true);
  const [review, setReview] = useState({ description: description, rating: rating });
  let [input, setInput] = useState({
    id: id,
    rating: rating,
    description: description,
  });
  let [error, setError] = useState({});

  useEffect(() => {
    const llaves = Object.keys(input)
    for (const key of llaves) {
      if (input[key] && !error[key]) { //si hay input y no hay errores --false
        SetactiveSubmit(false)
      } else {
        SetactiveSubmit(true)
        break;
      };
    };
  }, [input, error])

  function handleChange(e) {
    e.preventDefault(e)
    let review = e.target.value;
    setInput({
      ...input,
      [e.target.name]: review,
    });
    setError(validate({
      ...input,
      [e.target.name]: review
    }))
  };


  useEffect(() => {
    if (user) {
      if (user.username === username) {
        setMyReview(true)
      }
    }
  }, [user]);

  function removeReview(e) {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteReview(id));
        setReviews(reviews.filter(e => id != e.id));


        let timerInterval
        Swal.fire({
          title: 'Deleting review!',
          html: 'I will close in <b></b> milliseconds.',
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            const b = Swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
          }
        }).then(() => {
          setTimeout(() => {
            dispatch(deleteReview(id))
          }, 500)
        })
        .then(() => window.location.reload())
      }
    })



      
  }

  function handlerSubmit(e) {
    e.preventDefault();
    dispatch(editReview(input));
    setReview({ description: input.description, rating: input.rating })
    Swal.fire(
      'Good job!',
      'Review Edited Succesfully!',
      'success'
    )
      .then(() => window.location.reload())
  };

  return (
    // ── La fila de la tabla de récords ────────────────────────────────
    <div className="flex items-start gap-4 border-b border-line px-4 py-3 last:border-b-0 hover:bg-panel">

      {/* Controles de la fila (solo en tu propia reseña) */}
      {edit && (
        <button
          type="button"
          onClick={e => setEdit(false)}
          aria-label="Close edit review"
          className="gc-pixel mt-3 shrink-0 rounded-md border border-line px-2 py-1 text-[10px] uppercase text-dim transition hover:border-magenta hover:text-magenta"
        >
          X
        </button>
      )}
      {!edit && myReview && (
        <button
          type="button"
          onClick={e => setEdit(true)}
          aria-label="Edit review"
          className="gc-pixel mt-3 shrink-0 rounded-md border border-line px-2 py-1 text-[10px] uppercase text-dim transition hover:border-neon hover:text-neon"
        >
          <i className="bi bi-pencil" aria-hidden="true" />
        </button>
      )}

      {/* Avatar */}
      <img
        src={userImg}
        className="mt-2 h-16 w-16 shrink-0 rounded-full border-2 border-magenta object-cover"
        alt={`${username} avatar`}
      />

      {edit ? (
        /* ── Modo edición: los mandos de la fila ─────────────────────── */
        <form className="w-full" onSubmit={e => handlerSubmit(e)}>

          <div className="gc-pixel mb-3 flex items-center gap-2 text-[9px] uppercase text-neon">
            <i className="bi bi-pencil-fill" aria-hidden="true" />
            Editing {username}
          </div>

          <div className="mb-3">
            <input
              type="number"
              /* placeholder="Rating" */
              className="w-full rounded-lg border border-line bg-panel px-4 py-2 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]"
              name="rating"
              value={input.rating}
              onChange={(e) => handleChange(e)}
              required
            />
            {error.rating ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.rating}</label> : null}
          </div>

          <div className="mb-3">
            <textarea
              placeholder="Review"
              className="w-full rounded-lg border border-line bg-panel px-4 py-2 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]"
              name="description"
              value={input.description}
              onChange={(e) => handleChange(e)}
              required
            ></textarea>
            {error.description ? <label className="gc-pixel mt-2 block text-[9px] uppercase text-destructive">{error.description}</label> : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={e => removeReview(e)}
              className="gc-pixel rounded-md bg-destructive px-4 py-2 text-[10px] uppercase text-white transition hover:brightness-110"
            >
              Remove Review
            </button>
            <button
              type="submit"
              disabled={activeSubmit}
              className="gc-pixel rounded-md bg-magenta px-4 py-2 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Save Review
            </button>
          </div>
        </form>
      ) : (
        /* ── Vista de récord: texto + autor + puntaje ─────────────────── */
        <div className="min-w-0 flex-1">
          <p className="gc-pixel text-[10px] leading-relaxed text-ink">{review.description}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="gc-pixel text-[9px] uppercase text-magenta">{username}</span>
            <span className="gc-pixel text-[9px] uppercase text-dim">
              Rating:
              <span className="gc-pixel ml-2 text-sm text-credit">{review.rating}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
