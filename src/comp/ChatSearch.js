import React, { useContext } from "react"
import { useImmer } from "use-immer"
import { Transition } from "@headlessui/react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import io from "socket.io-client"
import Axios from "axios"

const socket = io("https://speakgiphy.herokuapp.com")

function ChatSearch() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  const [state, setState] = useImmer({
    searchQuery: "",
    searchOpen: false,
    searchResult: [],
  })

  // send search query to state
  function handleSearchQuery(e) {
    const value = e.target.value
    setState((draft) => {
      draft.searchQuery = value
    })
  }

  // fetch gifs when user click search btn
  async function handleSearch(e) {
    e.preventDefault()
    try {
      const searchResponse = await Axios.get("https://api.giphy.com/v1/gifs/search", {
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

  // close search window when user click "close" btn
  const closeSearch = () => {
    setState((draft) => {
      draft.searchOpen = false
    })
  }

  // show gifs from search result
  const showSearchResult = state.searchResult.map((gif) => {
    return (
      <div key={gif.id} className="flex justify-center my-2">
        <img className="border border-black hover:border-white" onClick={handlePost} src={gif.images.fixed_width.url} title={gif.title} alt={gif.title}></img>
      </div>
    )
  })

  // send clicked gif to db and close search window
  async function handlePost(e) {
    const post = {
      title: e.target.title,
      body: e.target.src,
      username: appState.user.username,
      token: appState.user.token,
    }
    try {
      socket.emit("chatFromBrowser", { title: post.title, body: post.body, token: post.token, username: post.username })
      await Axios.post("/create-post", { title: post.title, body: post.body, token: post.token, username: post.username })
      appDispatch({ type: "newPost", data: post })
      setState((draft) => {
        draft.searchQuery = ""
        draft.searchOpen = false
      })
    } catch (e) {
      console.log("Post unsuccessful.")
    }
  }

  return (
    <div className="max-w-screen-md w-full mx-auto px-2">
      {state.searchOpen ? (
        // if searchwindow is open, then show a "close" button for user to close window without posting a gif
        <form onSubmit={closeSearch} className="flex flex-row items-baseline justify-between py-4">
          <input onChange={handleSearchQuery} name="search" type="text" placeholder="Speak GIPHY.." value={state.searchQuery} autoComplete="off" className="w-full h-10 text-black px-2"></input>
          <button type="submit" className={state.searchQuery ? "flex items-center inline-block text-md font-semibold ml-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800" : "flex items-center inline-block border-purple-700 bg-purple-700 text-md text-white font-semibold mx-2 px-4 py-3 leading-none border opacity-50 cursor-not-allowed"}>
            Close
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </form>
      ) : (
        // if searchwindow is not open, then show a "search" button for user to make a giphy api call
        <form onSubmit={handleSearch} className="flex flex-row items-baseline justify-between py-4">
          <input onChange={handleSearchQuery} name="search" type="text" placeholder="Speak GIPHY.." value={state.searchQuery} autoComplete="off" className="w-full h-10 text-black px-2"></input>
          <button type="submit" className={state.searchQuery ? "flex items-center inline-block text-md font-semibold ml-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800" : "flex items-center inline-block border-purple-700 bg-purple-700 text-md text-white font-semibold mx-2 px-4 py-3 leading-none border opacity-50 cursor-not-allowed"}>
            Search
            <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
          </button>
        </form>
      )}
      {/* Show gifs from search result in masonry grid */}
      <Transition show={state.searchOpen} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="mx-auto">
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 650: 3 }}>
            <Masonry className="flex justify-center">{showSearchResult}</Masonry>
          </ResponsiveMasonry>
        </div>
      </Transition>
    </div>
  )
}

export default ChatSearch
