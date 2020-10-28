import React, { useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import { Transition } from "@tailwindui/react"
import Axios from "axios"

function GuestHero() {
  const appDispatch = useContext(DispatchContext)
  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
    },
    submitCount: 0,
  }
  // form validation cases
  function Reducer(draft, action) {
    switch (action.type) {
      case "usernameDirect":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot exceed 30 characters."
        }
        if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
          draft.username.hasErrors = true
          draft.username.message = "Username can only contain letters and numbers."
        }
        break
      case "usernameDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        break
      case "usernameUniqueResult":
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "That username is already taken"
        } else {
          draft.username.isUnique = true
        }
        break
      case "emailDirect":
        draft.email.hasErrors = false
        draft.email.value = action.value
        break
      case "emailDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address."
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        break
      case "emailUniqueResult":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.message = "This email is already being used."
        } else {
          draft.email.isUnique = true
        }
        break
      case "passwordDirect":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 50) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 50 characters."
        }
        break
      case "passwordDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 12 characters."
        }
        break
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors) {
          draft.submitCount++
        }
        break
      default:
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState)

  // add some delay before error messages is shown to user
  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  //check if username exists
  useEffect(() => {
    if (state.username.checkCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "usernameUniqueResult", value: response.data })
        } catch (e) {
          console.log("error username request")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.username.checkCount])

  // check if email exists
  useEffect(() => {
    if (state.email.checkCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value }, { cancelToken: ourRequest.token })
          dispatch({ type: "emailUniqueResult", value: response.data })
        } catch (e) {
          console.log("error email request")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.email.checkCount])

  // if all form validation requirements is passed, then register new user
  useEffect(() => {
    if (state.submitCount) {
      const ourRequest = Axios.CancelToken.source()
      async function fetchResults() {
        try {
          const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value }, { cancelToken: ourRequest.token })
          appDispatch({ type: "login", data: response.data })
        } catch (e) {
          console.log("error password request")
        }
      }
      fetchResults()
      return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  async function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "usernameDirect", value: state.username.value })
    dispatch({ type: "usernameDelay", value: state.username.value, noRequest: true })
    dispatch({ type: "emailDirect", value: state.email.value })
    dispatch({ type: "emailDelay", value: state.email.value, noRequest: true })
    dispatch({ type: "passwordDirect", value: state.password.value })
    dispatch({ type: "passwordDelay", value: state.password.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto p-6 lg:mt-32 justify-center">
      <div className="w-full lg:w-1/2 my-auto">
        <h1 className="text-gray-100 font-bold text-4xl lg:text-6xl mb-4">Do you speak GIF?</h1>
        <p className="text-spacegray text-xl lg:text-2xl">GIF is not a spoken language. It's a language of emotions and humor. Join and chat directly with others around the world, using only the GIPHY API. It's going to get weird.</p>
      </div>
      <div className="flex justify-center w-full mt-10 lg:mt-0 lg:w-1/2">
        <div className="flex-row w-64 bg-white w-full lg:w-2/3 px-12 py-8">
          <h2 className="text-black font-semibold text-center text-xl lg:text-3xl mb-6">Create your account</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input onChange={(e) => dispatch({ type: "emailDirect", value: e.target.value })} id="email-register" name="email" type="text" placeholder="your@email.com" autoComplete="off" className={state.email.hasErrors ? "focus:outline-none focus:shadow-outline bg-gray-100 border-2 border-red-400 placeholder-gray-500 text-gray-900 py-2 px-4 w-full appearance-none leading-normal" : "focus:outline-none focus:shadow-outline bg-gray-100 border-2 border-gray-300 placeholder-gray-500 text-gray-900 py-2 px-4 w-full appearance-none leading-normal"}></input>
              <Transition show={state.email.hasErrors} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="text-sm pl-1 mt-1 text-red-400 font-semibold">{state.email.message}</div>
              </Transition>
            </div>
            <div className="mb-4">
              <input onChange={(e) => dispatch({ type: "usernameDirect", value: e.target.value })} id="username-register" name="username" type="text" placeholder="Pick a username" autoComplete="off" className={state.username.hasErrors ? "focus:outline-none focus:shadow-outline bg-gray-100 border-2 border-red-400 placeholder-gray-500 text-gray-900 py-2 px-4 w-full appearance-none leading-normal" : "focus:outline-none focus:shadow-outline bg-gray-100 border-2 border-gray-300 placeholder-gray-500 text-gray-900 py-2 px-4 w-full appearance-none leading-normal"}></input>
              <Transition show={state.username.hasErrors} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="text-sm pl-1 mt-1 text-red-400 font-semibold">{state.username.message}</div>
              </Transition>
            </div>
            <div className="mb-4">
              <input onChange={(e) => dispatch({ type: "passwordDirect", value: e.target.value })} id="password-register" name="password" type="text" placeholder="Choose a password" autoComplete="off" className={state.password.hasErrors ? "focus:outline-none focus:shadow-outline bg-gray-100 border-2 border-red-400 placeholder-gray-500 text-gray-900 py-2 px-4 w-full appearance-none leading-normal" : "focus:outline-none focus:shadow-outline bg-gray-100 border-2 border-gray-300 placeholder-gray-500 text-gray-900 py-2 px-4 w-full appearance-none leading-normal"}></input>
              <Transition show={state.password.hasErrors} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                <div className="text-sm pl-1 mt-1 text-red-400 font-semibold">{state.password.message}</div>
              </Transition>
            </div>
            <button type="submit" className="inline-block text-md font-semibold w-full mt-2 px-4 py-4 leading-none border text-white text-center border-red-600 bg-red-600 hover:border-transparent hover:bg-red-800">
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GuestHero
