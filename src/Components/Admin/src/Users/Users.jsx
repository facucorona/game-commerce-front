import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'
import Swal from 'sweetalert2'
import {
  getAllUsers,
  filter_bannedAdmin,
  byUserName,
  bann_unBann,
  makeAdmin
} from '../../../../redux/actions'

export default function Users({ setRender }) {

  const bannedOn = ["Banned", "Admin", "All"]
  const [name, setName] = useState("")
  const dispatch = useDispatch()
  const users = useSelector((state) => state.allUsers)


  useEffect(() => {
    dispatch(getAllUsers())
  }, [])

  const handleBanUser = (e) => {
    e.preventDefault()

    let id = e.target.abbr
    const banUser = users.find(e => e.id === id)

    let adminEdit = banUser.isAdmin
    let contidion_admin = adminEdit ? "QUIT this user as admin" : "Add this user an admin"
    let condition_admin2 = adminEdit ? "QUIT" : "ADD"
    let condition_admin3 = adminEdit ? `The user "${banUser.username}" is no longer an admin` : `The user "${banUser.username}" is now an admin`
    let condition_admin4 = adminEdit ? `The user "${banUser.username}" Lost all the roles` : 'the user now has this roles: - dkkkdd - jdkddjfk!.'

    var typeOfEdit = banUser.isBanned
      ? typeOfEdit = "unban"
      : typeOfEdit = "ban"

    var contition;
    var contition2;

    typeOfEdit === "ban" ? contition = 'BAN' : contition = 'UNBAN'
    typeOfEdit === "ban" ? contition2 = "and the user lost all de permission to our site" : contition2 = "Is welcome again"



    Swal.fire({
      title: `What do you want to do with this user "${banUser.username}"?`,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: contition,
      confirmButtonText: contidion_admin,

      ///////////////////////////////// FUNCIÓN SI EL USUARIO PASA A SER ADMINISTRADOR /////////////////////////////   

    }).then((result) => {
      if (result.isConfirmed) {

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white',
            cancelButton: 'gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon'
          },
          buttonsStyling: false
        })
        if (typeOfEdit = banUser.isBanned) {
          return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Impossible to add this user as admin!',
            footer: `Why do I have this issue? --- in this moment the "${banUser.username}" is banned, for security this option is not allowed`
          })
        };

        swalWithBootstrapButtons.fire({
          title: `Are you sure to ${condition_admin2} admin this user? "${banUser.username}"`,
          text: "You can revert this option later!",
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: `Yes, ${condition_admin2} it admin!`,
          cancelButtonText: 'No, cancel!',
          reverseButtons: true
        }).then((result) => {

          if (result.isConfirmed) {
            dispatch(makeAdmin(id))

            swalWithBootstrapButtons.fire(
              condition_admin3,
              condition_admin4,
              'success'
            )
            let timerInterval
            Swal.fire({
              title: 'Making Changes!',
              html: 'I will close in <b></b> segundos.',
              timer: 1500,
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
              if (result.dismiss === Swal.DismissReason.timer) {
                /* console.log('I was closed by the timer') */
              }
            }).then(() => dispatch(getAllUsers()))



          } else if (

            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Cancelled',
              'The user is not an admin',
              'error'
            )
          }
        })
        ///////////////////////////////// FUNCIÓN SI EL USUARIO SE QUIERE BANEAR O DESBANEAR /////////////////////////////        

      } else if (result.isDenied) {

        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: 'gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white',
            cancelButton: 'gc-pixel rounded-md border border-neon px-5 py-3 text-[10px] uppercase text-neon'
          },
          buttonsStyling: false
        })

        if (banUser.isAdmin) {
          return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Impossible to ban this user!',
            footer: `Why do I have this issue? --- in this moment the "${banUser.username}" is admin, for security this option is not allowed`
          })
        };


        swalWithBootstrapButtons.fire({
          title: `Are you sure to ${contition} this user? "${banUser.username}"`,
          text: "You can revert this option later!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'cancel!',
          reverseButtons: true
        }).then((result) => {
          if (result.isConfirmed /* BANN */) {

            swalWithBootstrapButtons.fire(
              ` the user "${banUser.username}" has been ${contition}NED`,
              `${contition2}`,
              'success'
            )

            dispatch(bann_unBann({ typeOfEdit, id }))

            setTimeout(() => {
              dispatch(getAllUsers())
            }, 500);

          } else if (
            result.dismiss === Swal.DismissReason.cancel
          ) {
            swalWithBootstrapButtons.fire(
              'Cancelled',
              `The user  "${banUser.username}" still on`,
              'error'
            )
          }
        });
      }
    })
  };


  /*     useEffect(() => {
        dispatch(getAllUsers())
      }, [] ) */


  function handleChange(e) {
    e.preventDefault();
    setName(e.target.value)
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(byUserName(name))
    setName("")
  };

  const filterUsers = (e) => {
    e.preventDefault()
    dispatch(filter_bannedAdmin(e.target.value))
  };

  function viewReviews(user, username) {
    setRender({ reviews: true, username: user, username1: username })
  };

  // PATRÓN ARCADE: "puesto de control" → rótulo + buscador + teclas de filtro
  // siempre visibles (el desplegable de Bootstrap ya no funciona) y tabla de
  // récords de usuarios. OJO: el <abbr> del <td> del lápiz es lo que lee
  // handleBanUser (e.target.abbr), así que ese atributo no se toca.

  return (

    <div className="mx-auto w-full max-w-[1400px]">
      <p className="gc-pixel text-[10px] uppercase text-magenta">Usuarios</p>
      <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Users</h2>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <form className="flex items-center gap-3" role="search" onSubmit={handleSubmit}>
          <input className="w-full min-w-[220px] rounded-lg border border-line bg-panel px-4 py-3 text-sm text-ink outline-none transition focus:border-neon focus:shadow-[0_0_16px_rgba(0,240,255,0.35)]" type="search" placeholder="Username..." required aria-label="Search" value={name} onChange={handleChange} />
          <button className="gc-pixel rounded-md bg-magenta px-5 py-3 text-[10px] uppercase text-white gc-glow-magenta transition hover:brightness-110" type="submit">Search</button>
        </form>

        <div className="flex items-center gap-3">
          <span className="gc-pixel text-[9px] uppercase text-dim">Filter by ...</span>
          {bannedOn.map((plat, index) => {
            return (
              <button key={index}
                className="gc-pixel rounded-md border border-line px-4 py-2 text-[9px] uppercase text-dim transition hover:border-neon hover:text-neon"
                onClick={(e) => { filterUsers(e) }}
                value={plat}>{plat}</button>
            )
          })}
        </div>
      </div>

      <div className="mt-6 max-h-[440px] overflow-y-auto overflow-x-hidden rounded-xl border-2 border-line">
        <table className="w-full text-left">
          <thead className="sticky top-0">
            <tr className="gc-pixel bg-panel text-[9px] uppercase text-dim">
              <th className="px-4 py-3" scope="col">id</th>
              <th className="px-4 py-3" scope="col">User Name</th>
              <th className="px-4 py-3" scope="col">Name</th>
              <th className="px-4 py-3" scope="col">Last Name</th>
              <th className="px-4 py-3" scope="col">E-mail</th>
              <th className="px-4 py-3" scope="col">Banned</th>
              <th className="px-4 py-3" scope="col">isAdmin</th>
              <th className="px-4 py-3" scope="col">Created At</th>
              <th className="px-4 py-3" scope="col">Reviews</th>
              <th className="px-4 py-3" scope="col">Edit</th>
            </tr>
          </thead>
          <tbody  >
            {users.map((user, index) => {
              if(user.email==="admin@admin.com") return ;
              return <tr key={index} className="border-b border-line text-sm text-ink hover:bg-panel">
                  <td className="gc-pixel px-4 py-3 text-[9px] text-dim">{user.id}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.lastname}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  {user.isBanned === false ? <td className="gc-pixel px-4 py-3 text-dim"> - </td> : <td className="px-4 py-3 text-destructive"><i className="bi bi-x-circle" aria-hidden="true" /></td>}
                  {user.isAdmin === false ? <td className="gc-pixel px-4 py-3 text-dim"> - </td> : <td className="px-4 py-3 text-neon"><i className="bi bi-check-circle" aria-hidden="true" /></td>}
                  <td className="gc-pixel px-4 py-3 text-[9px] text-dim">{user.createdAt.slice(0, 10)}</td>
                  <td className="px-4 py-3"> <a onClick={(e) => viewReviews(user.id, user.username)} className="gc-pixel cursor-pointer text-[9px] uppercase text-neon transition hover:text-bulb">Reviews</a> </td> { }
                  <td abbr={user.id} className="bi bi-pencil cursor-pointer px-4 py-3 text-center text-bulb" onClick={(e) => handleBanUser(e)}></td>
                </tr>
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
};
