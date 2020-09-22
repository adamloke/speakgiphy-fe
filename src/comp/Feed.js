import React, { useContext, useEffect, useRef } from "react"
import Axios from "axios"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function Feed() {
  const postFeedWindow = useRef(null)
  console.log(postFeedWindow)
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  useEffect(() => {
    async function fetchPosts() {
      const response = await Axios.get("http://localhost:8080/test", { token: appState.user.token })
      appDispatch({ type: "postFeed", data: response.data })
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    postFeedWindow.current.scrollTop = postFeedWindow.current.scrollHeight
    console.log(postFeedWindow.current.scrollTop)
    console.log(postFeedWindow.current.scrollHeight)
  }, [appState.postFeed])

  const showPosts = appState.postFeed.map((post) => {
    return (
      <div key={post._id} className="my-2 mx-2">
        <img className="border border-white" src={post.body} alt={post.title}></img>
      </div>
    )
  })

  return (
    <div className="max-w-screen-xl w-full h-full overflow-auto border border-white mx-auto px-2" ref={postFeedWindow}>
      {showPosts}
    </div>
  )
}

export default Feed
