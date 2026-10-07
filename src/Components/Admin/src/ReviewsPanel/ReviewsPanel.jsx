import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { addRemoveReview, getUserReviews, getUserReportedReviews } from '../../../../redux/actions.js'

// PATRÓN ARCADE: moderación de reseñas = "tabla de récords" apilada dentro de una
// caja de máquina. Botón Go Back (tecla secundaria) y botón de interchangeably
// Enabled/Disabled. El <i> alterna bi-plus-circle / bi-x-circle según la pestaña
// activa: eso lo decide viewDisabled() a través de `reviews.button` y NO se toca.

function ReviewsPanel({setRender, render}) {

    const dispatch = useDispatch()
    const [reviews, setReviews] = useState({})

    const goBack = () => {
        setRender({user: true});
    }
    function viewDisabled(e){
        if (e.target.value === 'View Disabled') {
            dispatch(getUserReportedReviews(username))
        }else{ 
            dispatch(getUserReviews(username));
        }
    }

    const reportedRev = useSelector((state) => state.reviewsUserRep);
    const enabledRev = useSelector((state) => state.reviewsUser);
    
    var username = render.username;
    var username1 = render.username1;
    var color = 'white'

    useEffect(() => {
        dispatch(getUserReviews(username));
    }, []);
    useEffect(()=>{
        setReviews({button: 'View Disabled', reviews: enabledRev})
    }, [enabledRev]);
    useEffect(()=>{
        setReviews({button: 'View Enabled', reviews: reportedRev})
    }, [reportedRev]);

    function handleSwitch(e, review){
        var action = 'add'
        if (!review.reported) {
            action = 'remove'
        }
        let i = reviews.reviews.findIndex((e) => e.id === review.id);
        dispatch(addRemoveReview({typeOfEdit:action, id: review.id}));
        reviews.reviews[i].reported = !review.reported;
        setTimeout(() => {
            if(action === 'add'){
                dispatch(getUserReportedReviews(username));
            }else{
                dispatch(getUserReviews(username));
            }    
        }, "500");
    }


  return (
    <div className="mx-auto w-full max-w-[1400px]">
      
        <button value='test' className="gc-pixel rounded-md border border-neon/70 px-5 py-3 text-[10px] uppercase text-neon transition hover:bg-neon/10" type="button" aria-expanded="false" onClick={goBack}>
          <i className="bi bi-arrow-left mr-2" aria-hidden="true" />Go Back
        </button>

        <div className="mt-4">

            <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="gc-pixel text-[10px] uppercase text-magenta">Reviews</p>
                <h2 className="font-display text-3xl uppercase tracking-wide text-ink">{username1.charAt(0).toUpperCase() + username1.slice(1)}&apos;s Reviews</h2>
                <input value={reviews.button} className="gc-pixel cursor-pointer rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110" type="button" aria-expanded="false" onClick={(e)=>viewDisabled(e)}></input>
            </div>

            <div className="mt-4 max-h-[560px] overflow-y-auto rounded-xl border-2 border-line bg-cab">
            {reviews.reviews && reviews.reviews.map((review) => {
                if (color === 'white') {
                    color = 'rgba(140, 144, 147, 0.138)'
                }else{color = 'white'}
                return(
                <div className="flex items-center gap-4 border-b border-line bg-cab px-4 py-3 text-sm text-ink odd:bg-panel hover:bg-panel">
                    <div className="max-w-[850px] cursor-pointer text-left pt-1 pl-1"><p className="mb-0">{review.description}</p></div>
                    <div className="ml-auto w-10">
                        <div className="cursor-pointer text-neon" onClick={(e) => handleSwitch(e, review)} ><i className={reviews.button === 'View Enabled' ? 'bi bi-plus-circle': 'bi bi-x-circle'} aria-hidden="true"></i></div>
                    </div>
                </div>
                )
            })}
            </div>
        </div>

    </div>
  )
}

export default ReviewsPanel
