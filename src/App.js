import React, { useReducer, useEffect } from "react"
import { useImmerReducer } from "use-immer"
import "./styles/App.scss"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// Components
import HeaderLoggedOut from "./comp/LoggedOut/HeaderLoggedOut"
import HeroLoggedOut from "./comp/LoggedOut/HeroLoggedOut"
import Header from "./comp/Header"
import ChatWindow from "./comp/ChatWindow"

function App() {
  // Check if user is logged in
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("speakgiphyToken")),
    user: {
      token: localStorage.getItem("speakgiphyToken"),
      username: localStorage.getItem("speakgiphyUsername"),
    },
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
    }
  }

  const [state, dispatch] = useImmerReducer(Reducer, initialState)

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
      <DispatchContext.Provider value={dispatch}>
        {state.loggedIn ? <Header /> : <HeaderLoggedOut />}
        {state.loggedIn ? <ChatWindow /> : <HeroLoggedOut />}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
