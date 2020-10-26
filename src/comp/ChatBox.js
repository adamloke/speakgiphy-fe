import React, { useEffect, useContext } from "react"
import Axios from "axios"
import { useImmer } from "use-immer"
import { Transition } from "@headlessui/react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import ScrollToBottom from "react-scroll-to-bottom"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import io from "socket.io-client"

const socket = io("http://localhost:8080")

function ChatBox() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    searchQuery: "",
    searchOpen: false,
    searchResult: [],
    postFeed: [],
    activeUsers: [],
  })

  // fetch all posts from db and connect user to socket
  useEffect(() => {
    socket.emit("connectUser", { username: appState.user.username })
    async function fetchPosts() {
      try {
        const response = await Axios.get("http://localhost:8080/posts", { token: appState.user.token })
        setState((draft) => {
          draft.postFeed = response.data
        })
      } catch (e) {
        console.log("Error fetching posts")
      }
    }
    fetchPosts()
  }, [])

  // get new posts and active users
  useEffect(() => {
    let mounted = true
    socket.on("chatFromServer", (post) => {
      if (mounted) {
        setState((draft) => {
          draft.postFeed.push(post)
        })
      }
    })
    socket.on("activeUsers", (users) => {
      console.log(users)
      if (mounted) {
        setState((draft) => {
          draft.activeUsers = users
        })
      }
    })
    return () => (mounted = false)
  }, [])

  // if user click happy face icon, then ....
  const handleLike = () => {
    console.log("like")
  }

  // if user click happy face icon, then ....
  const handleDislike = () => {
    console.log("dislike")
  }

  // send search query to state
  function handleSearchQuery(e) {
    const value = e.target.value
    setState((draft) => {
      draft.searchQuery = value
    })
  }

  const closeSearch = () => {
    setState((draft) => {
      draft.searchOpen = false
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

  // show gifs from search result
  const showSearchResult = state.searchResult.map(function (gif) {
    return (
      <div key={gif.id} className="flex justify-center my-2">
        <img className="border border-black hover:border-white" onClick={handlePost} src={gif.images.fixed_width.url} title={gif.title} alt={gif.title}></img>
      </div>
    )
  })

  // send clicked gif to db and close search window
  async function handlePost(e) {
    const value = e.target.title
    const source = e.target.src
    try {
      console.log(value)
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

  // open side menu
  const closeMenu = () => {
    appDispatch({ type: "closeMenu" })
  }

  // display active users in side menu
  const showActiveUsers = state.activeUsers.map((username, index) => {
    return (
      <div key={index} className="flex flex-row items-center my-2">
        <span className="flex h-2 w-2 mr-4">
          <span className="animate-ping relative inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-15 bg-green-700"></span>
        </span>
        <p className="text-lg text-spacegray font-semibold">{username}</p>
      </div>
    )
  })

  // logout user
  const handleLogout = () => {
    socket.emit("removeUser", { username: appState.user.username })
    appDispatch({ type: "logout" })
  }

  return (
    <>
      <ScrollToBottom className="max-w-screen-md w-full h-full overflow-auto mx-auto bg-trueblack">
        {
          // show gifs in feed
          state.postFeed.map((post, index) => {
            // if gif is posted by user, then show on right side of feed
            if (post.username === appState.user.username) {
              return (
                <div key={index} className="flex justify-end mx-5 md:mx-10 my-4 bg-trueblack">
                  <div className="flex flex-col p-2 bg-black">
                    <img src={post.body} alt={post.title}></img>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-row items-center">
                        <p className="text-spacegray font-semibold text-md">{post.username}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            } else {
              return (
                // if gif is not posted by user, then show on left side of feed
                <div key={index} className="flex justify-start mx-5 md:mx-10 my-4 bg-trueblack">
                  <div className="flex flex-col p-2 bg-black">
                    <img src={post.body} alt={post.title}></img>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex flex-row items-center">
                        <p className="text-spacegray font-semibold text-md">{post.username}</p>
                      </div>
                      <div className="flex flex-row items-center">
                        <svg className="mr-1 w-6 h-6 text-spacegray" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path onClick={handleDislike} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <svg className="ml-1 w-6 h-6 text-spacegray" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path onClick={handleLike} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }
          })
        }
      </ScrollToBottom>

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
      {/* Show side menu  */}
      <Transition show={appState.sideMenu} enter="transition ease-out duration-100 transform" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="transition ease-in duration-75 transform" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
        {(ref) => (
          <div ref={ref} className="flex flex-col origin-right absolute right-0 w-3/4 md:w-1/4 shadow-2xl h-screen">
            <div className="flex flex-col bg-gray-900 shadow-xs h-full p-5 md:p-10">
              <div className="flex flex-start">
                <button onClick={closeMenu} type="submit" className="flex items-center inline-block text-md font-semibold px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800">
                  Close
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className="h-full pt-10 pb-10">
                <h3 className="text-gray-100 text-xl lg:text-2xl font-semibold border-b-2 border-spacegray">Currently online:</h3>
                <div className="mt-5">{showActiveUsers}</div>
              </div>
              <div className="flex flex-end">
                <button onClick={handleLogout} type="submit" className="flex items-center inline-block text-md font-semibold px-4 py-3 leading-none border text-white border-spacegray hover:border-transparent hover:bg-purple-800">
                  Logout
                  <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  )
}

export default ChatBox
