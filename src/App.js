import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import "./styles/App.scss"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

//components
import GuestHeader from "./comp/GuestHeader"
import GuestHero from "./comp/GuestHero"
import ChatMenu from "./comp/ChatMenu"
import ChatBox from "./comp/ChatBox"

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("speakgiphyToken")),
    user: {
      token: localStorage.getItem("speakgiphyToken"),
      username: localStorage.getItem("speakgiphyUsername"),
    },
    searchQuery: "",
    searchOpen: false,
    searchResult: [],
    postFeed: [],
  }

  function Reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        break
      case "logout":
        draft.loggedIn = false
        break
      case "searchQuery":
        draft.searchQuery = action.data
        break
      case "searchOpen":
        draft.searchOpen = true
        break
      case "searchClose":
        draft.searchOpen = false
        break
      case "searchResult":
        draft.searchResult = action.data
        break
      case "postFeed":
        draft.postFeed = action.data
        break
      default:
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
        {state.loggedIn ? (
          <div className="flex flex-col justify-between h-screen w-full">
            <ChatMenu />
            <ChatBox />
          </div>
        ) : (
          <>
            <GuestHeader />
            <GuestHero />
          </>
        )}
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
