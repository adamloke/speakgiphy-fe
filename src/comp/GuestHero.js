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
      <div className="w-full lg:w-1/2 pl-1 my-auto">
        <h1 className="text-gray-100 font-bold text-4xl lg:text-6xl mb-4">Do you speak GIF?</h1>
        <p className="text-spacegray text-xl lg:text-2xl">GIF is not a spoken language. It's a language of emotions and humor. Join and chat directly with others around the world, using only the GIPHY API. It's going to get weird.</p>
        <div className="flex flex-col mt-10">
          <p className="flex items-center text-spacegray text-md lg:text-sm">
            Created by Adam Loke
            <a href="https://github.com/adamloke">
              <svg class="flex ml-4 w-5 h-5 hover:text-gray-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
            <a href="https://twitter.com/adamloke">
              <svg class="flex ml-4 w-5 h-5 hover:text-gray-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />{" "}
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/adamloke">
              <svg class="flex ml-4 w-5 h-5 hover:text-gray-100" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z" />{" "}
              </svg>
            </a>
          </p>
        </div>
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
            <button type="submit" className="flex items-center justify-center inline-block text-md font-semibold w-full mt-2 px-4 py-4 leading-none border text-white text-center border-red-600 bg-red-600 hover:border-transparent hover:bg-red-800">
              Get Started
              <svg class="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GuestHero
