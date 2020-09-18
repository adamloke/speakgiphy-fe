import { Transition } from "@tailwindui/react"
import React, { useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

function SearchBox() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  // send search query from input field to state
  const handleSearchQuery = (e) => appDispatch({ type: "searchQuery", data: e.target.value })

  // fetch gifs when user click search btn
  async function handleSearch(e) {
    e.preventDefault()
    try {
      const searchResponse = await Axios.get("http://api.giphy.com/v1/gifs/search", {
        params: {
          q: appState.searchQuery,
          api_key: process.env.REACT_APP_GIPHY_API_KEY,
          limit: 25,
        },
      })
      // send search result to state and open search result window
      appDispatch({ type: "searchResult", data: searchResponse.data.data })
      appDispatch({ type: "searchOpen" })
    } catch (e) {
      console.log("Api call unsuccessful.")
    }
  }

  // map search result to gif grid within search result window
  const showSearchResult = appState.searchResult.map(function (gif) {
    return (
      <div key={gif.id} className="my-2">
        <img className="border border-black hover:border-white" onClick={handlePost} src={gif.images.fixed_width.url} title={gif.title}></img>
      </div>
    )
  })

  // when user click on a gif send gif to server and update state
  async function handlePost(e) {
    try {
      await Axios.post("http://localhost:8080/create-post", { title: e.target.title, body: e.target.src, token: appState.user.token })
      appDispatch({ type: "searchQuery", data: "" })
      appDispatch({ type: "searchClose" })
    } catch (e) {
      console.log("Post unsuccessful.")
    }
  }

  return (
    <div className="max-w-screen-xl w-full mx-auto px-2 border border-white">
      <form onSubmit={handleSearch} className="flex flex-row items-baseline justify-between py-4">
        <input onChange={handleSearchQuery} name="search" type="text" placeholder="Speak GIPHY.." value={appState.searchQuery} autoComplete="off" className="w-full h-10 text-black px-2"></input>
        <button type="submit" className={appState.searchQuery ? "inline-block text-md font-semibold ml-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800" : "inline-block border-purple-700 bg-purple-700 text-md text-white font-semibold mx-2 px-4 py-3 leading-none border opacity-50 cursor-not-allowed"}>
          Search
        </button>
      </form>

      <Transition show={appState.searchOpen} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="mx-auto">
          <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 4, 900: 6 }}>
            <Masonry>{showSearchResult}</Masonry>
          </ResponsiveMasonry>
        </div>
      </Transition>
    </div>
  )
}

export default SearchBox
