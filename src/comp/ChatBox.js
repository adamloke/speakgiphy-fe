import React, { useEffect, useContext } from "react"
import Axios from "axios"
import { useImmer } from "use-immer"
import { Transition } from "@tailwindui/react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import ScrollToBottom from "react-scroll-to-bottom"
import StateContext from "../StateContext"
import io from "socket.io-client"

const socket = io("http://localhost:8080")

function ChatBox() {
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    searchQuery: "",
    searchOpen: false,
    searchResult: [],
    postFeed: [],
  })

  // fetch all posts from db
  useEffect(() => {
    async function fetchPosts() {
      const response = await Axios.get("http://localhost:8080/posts", { token: appState.user.token })
      setState((draft) => {
        draft.postFeed = response.data
      })
    }
    fetchPosts()
  }, [])

  // get new posts from server and set state
  useEffect(() => {
    socket.on("chatFromServer", (post) => {
      setState((draft) => {
        draft.postFeed.push(post)
      })
    })
  }, [])

  // send search query to state
  const handleSearchQuery = (e) => {
    const value = e.target.value
    setState((draft) => {
      draft.searchQuery = value
    })
  }

  // fetch gifs when user click search btn
  async function handleSearch(e) {
    e.preventDefault()
    try {
      const searchResponse = await Axios.get("http://api.giphy.com/v1/gifs/search", {
        params: {
          q: state.searchQuery,
          api_key: process.env.REACT_APP_GIPHY_API_KEY,
          limit: 25,
        },
      })
      // send response data to state and open search result window
      setState((draft) => {
        draft.searchResult = searchResponse.data.data
        draft.searchOpen = true
      })
    } catch (e) {
      console.log("Api call unsuccessful.")
    }
  }

  // display search result in search window
  const showSearchResult = state.searchResult.map(function (gif) {
    return (
      <div key={gif.id} className="flex justify-center my-2">
        <img className="border border-black hover:border-white" onClick={handlePost} src={gif.images.fixed_width.url} title={gif.title}></img>
      </div>
    )
  })

  // send clicked gif to db and close search window
  async function handlePost(e) {
    const value = e.target.title
    const source = e.target.src
    try {
      socket.emit("chatFromBrowser", { title: value, body: source, token: appState.user.token, username: appState.user.username })
      await Axios.post("http://localhost:8080/create-post", { title: value, body: source, token: appState.user.token, username: appState.user.username })
      setState((draft) => {
        draft.postFeed.push({ title: value, body: source, token: appState.user.token, username: appState.user.username })
        draft.searchQuery = ""
        draft.searchOpen = false
      })
    } catch (e) {
      console.log("Post unsuccessful.")
    }
  }

  return (
    <>
      <ScrollToBottom className="max-w-screen-md w-full h-full overflow-auto border border-white mx-auto">
        {state.postFeed.map((post, index) => {
          if (post.username == appState.user.username) {
            return (
              <div key={index} className="flex justify-end mx-10 my-4">
                <div className="class">
                  <img className="" src={post.body} alt={post.title}></img>
                  <p className="text-white">{post.username}</p>
                </div>
              </div>
            )
          } else {
            return (
              <div key={index} className="flex justify-start mx-10 my-4">
                <div className="class">
                  <img className="" src={post.body} alt={post.title}></img>
                  <p className="text-white">{post.username}</p>
                </div>
              </div>
            )
          }
        })}
      </ScrollToBottom>

      <div className="max-w-screen-md w-full mx-auto px-2 border border-white">
        <form onSubmit={handleSearch} className="flex flex-row items-baseline justify-between py-4">
          <input onChange={handleSearchQuery} name="search" type="text" placeholder="Speak GIPHY.." value={state.searchQuery} autoComplete="off" className="w-full h-10 text-black px-2"></input>
          <button type="submit" className={state.searchQuery ? "inline-block text-md font-semibold ml-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800" : "inline-block border-purple-700 bg-purple-700 text-md text-white font-semibold mx-2 px-4 py-3 leading-none border opacity-50 cursor-not-allowed"}>
            Search
          </button>
        </form>

        <Transition show={state.searchOpen} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="mx-auto">
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 650: 3 }}>
              <Masonry className="flex justify-center">{showSearchResult}</Masonry>
            </ResponsiveMasonry>
          </div>
        </Transition>
      </div>
    </>
  )
}

export default ChatBox
