import React, { useContext } from "react"
import StateContext from "../StateContext"

function Feed() {
  const appState = useContext(StateContext)

  // fetch all posts from backend

  return (
    <div className="max-w-screen-xl w-full h-full border border-white mx-auto px-2">
      <p className="text-white">FEED</p>
    </div>
  )
}

export default Feed
