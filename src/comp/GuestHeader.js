import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import { Transition } from "@tailwindui/react"
import Axios from "axios"

function GuestHeader() {
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    username: "",
    password: "",
    loginError: false,
    loginCount: 0,
    loginOpen: false,
    message: "Username or password is incorrect.",
  }

  function Reducer(draft, action) {
    switch (action.type) {
      case "setUsername":
        draft.username = action.value
        break
      case "setPassword":
        draft.password = action.value
        break
      case "loginCounter":
        draft.loginCount++
        break
      case "loginError":
        draft.loginError = true
        break
      case "openLogin":
        draft.loginOpen = !draft.loginOpen
        break
      default:
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState)

  useEffect(() => {
    if (state.loginCount) {
      dispatch({ type: "loginError" })
      dispatch({ type: "setUsername", value: "" })
      dispatch({ type: "setPassword", value: "" })
    }
  }, [state.loginCount])

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username: state.username, password: state.password })
      if (response.data) {
        appDispatch({ type: "login", data: response.data })
      } else {
        dispatch({ type: "loginCounter" })
      }
    } catch (e) {
      console.log("Error login request")
    }
  }
  return (
    <nav className="flex items-baseline justify-between flex-wrap my-6 p-6 w-full">
      <div className="flex justify-between items-center text-white w-full lg:w-64">
        <h1 className="font-bold text-2xl lg:text-4xl tracking-tight">SpeakGIPHY</h1>
        {state.loginOpen ? (
          <button onClick={() => dispatch({ type: "openLogin" })} className="flex items-center lg:hidden inline-block text-sm font-semibold px-3 py-2 leading-none text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800">
            Close
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        ) : (
          <button onClick={() => dispatch({ type: "openLogin" })} className="flex items-center lg:hidden inline-block text-sm font-semibold px-3 py-2 leading-none text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800">
            Login
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>
        )}
      </div>{" "}
      <Transition show={state.loginOpen} className="flex flex-col pt-6 mx-auto" enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input onChange={(e) => dispatch({ type: "setUsername", value: e.target.value })} value={state.username} name="username" type="text" placeholder="Username" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-600 placeholder-gray-700 border border-gray-600 text-white mx-2 my-2 py-2 px-4 w-64 appearance-none leading-normal"></input>
          <input onChange={(e) => dispatch({ type: "setPassword", value: e.target.value })} value={state.password} name="password" type="password" placeholder="Password" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-600 placeholder-gray-700 border border-gray-600 text-white mx-2 my-2 py-2 px-4 w-64 appearance-none leading-normal"></input>
          <Transition show={state.loginError} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="text-sm pl-2 mt-1 text-red-400 font-semibold">{state.message}</div>
          </Transition>
          <button className="flex justify-center items-center inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800 mt-4 lg:mt-0">Login</button>
        </form>
      </Transition>
      <div className="hidden lg:flex lg:flex-col lg:flex-end">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input onChange={(e) => dispatch({ type: "setUsername", value: e.target.value })} value={state.username} name="username" type="text" placeholder="Username" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-600 placeholder-spacegray border border-gray-600 text-white mx-2 py-2 px-4 w-64 appearance-none leading-normal"></input>
          <input onChange={(e) => dispatch({ type: "setPassword", value: e.target.value })} value={state.password} name="password" type="password" placeholder="Password" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-600 placeholder-spacegray border border-gray-600 text-white mx-2 py-2 px-4 w-64 appearance-none leading-normal"></input>
          <button className="flex items-center inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800 mt-4 lg:mt-0">
            Login
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
          </button>
        </form>
        <Transition show={state.loginError} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="text-sm pl-2 mt-1 text-red-400 font-semibold">{state.message}</div>
        </Transition>
      </div>
    </nav>
  )
}

export default GuestHeader
