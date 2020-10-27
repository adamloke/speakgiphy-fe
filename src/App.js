import React, { useEffect } from "react"
import { useImmerReducer } from "use-immer"
import "./styles/App.scss"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import GuestHeader from "./comp/GuestHeader"
import GuestHero from "./comp/GuestHero"
import ChatHeader from "./comp/ChatHeader"
import ChatFeed from "./comp/ChatFeed"

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("speakgiphyToken")),
    user: {
      token: localStorage.getItem("speakgiphyToken"),
      username: localStorage.getItem("speakgiphyUsername"),
    },
    sideMenu: false,
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
      case "fetchPosts":
        draft.postFeed = action.data
        break
      case "getPosts":
        draft.postFeed.push(action.data)
        break
      case "addNewPost":
        draft.postFeed.push(action.data)
        break
      case "openMenu":
        draft.sideMenu = true
        break
      case "closeMenu":
        draft.sideMenu = false
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
        {state.loggedIn ? (
          <div className="flex flex-col justify-between h-screen w-full">
            <ChatHeader />
            <ChatFeed />
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
