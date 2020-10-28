import React, { useEffect, useContext } from "react"
import ChatMenu from "./ChatMenu"
import ChatSearch from "./ChatSearch"
import ScrollToBottom from "react-scroll-to-bottom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import io from "socket.io-client"
import Axios from "axios"

const socket = io("https://speakgiphy.herokuapp.com")

function ChatFeed() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // fetch posts from db on mount
  useEffect(() => {
    let mounted = true
    socket.emit("connectUser", { username: appState.user.username })
    async function fetchPosts() {
      try {
        const response = await Axios.get("/posts", { token: appState.user.token })
        appDispatch({ type: "fetchPosts", data: response.data })
      } catch (e) {
        console.log("Error fetching posts")
      }
    }
    fetchPosts()
    return () => (mounted = false)
  }, [])

  // listen for new posts
  useEffect(() => {
    let mounted = true
    socket.on("chatFromServer", (post) => {
      if (mounted) {
        appDispatch({ type: "getPosts", data: post })
      }
    })
    return () => (mounted = false)
  }, [])

  return (
    <>
      <ScrollToBottom className="max-w-screen-md w-full h-full overflow-auto mx-auto bg-trueblack">
        {appState.postFeed.map((post, index) => {
          if (post.username === appState.user.username) {
            return (
              <div key={index} className="flex justify-end mx-5 md:mx-10 my-4 bg-trueblack">
                <div className="flex flex-col p-2 bg-black">
                  <img src={post.body} alt={post.title}></img>
                  <div className="flex justify-end items-center mt-2">
                    <div className="flex items-center">
                      <p className="text-spacegray font-semibold text-md">{post.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          } else {
            return (
              <div key={index} className="flex justify-start mx-5 md:mx-10 my-4 bg-trueblack">
                <div className="flex flex-col p-2 bg-black">
                  <img src={post.body} alt={post.title}></img>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-spacegray font-semibold text-md">{post.username}</p>
                  </div>
                </div>
              </div>
            )
          }
        })}
      </ScrollToBottom>
      <ChatSearch />
      <ChatMenu />
    </>
  )
}

export default ChatFeed
