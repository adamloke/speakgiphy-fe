import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import "./styles/App.scss"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// Components
import MainWindow from "./comp/MainWindow"
import MainGuest from "./comp/guest/MainGuest"

function App() {
  // Initial state
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("speakgiphyToken")),
    user: {
      token: localStorage.getItem("speakgiphyToken"),
      username: localStorage.getItem("speakgiphyUsername"),
    },
    searchWindow: false,
  }

  // Change state with appDispatch
  function Reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        break
      case "logout":
        draft.loggedIn = false
        break
      case "searchOpen":
        draft.searchWindow = true
        break
      default:
        break
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState)

  // Checks value of state.loggedIn, then add or remove local storage token.
  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("speakgiphyToken", state.user.token)
      localStorage.setItem("speakgiphyUsername", state.user.username)
    } else {
      localStorage.removeItem("speakgiphyToken")
      localStorage.removeItem("speakgiphyUsername")
    }
  }, [state.loggedIn])
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>{state.loggedIn ? <MainWindow /> : <MainGuest />}</DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
