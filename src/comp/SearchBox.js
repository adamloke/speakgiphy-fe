import { Transition } from "@tailwindui/react"
import React, { useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

// Components
import SearchResult from "./SearchResult"

function SearchBox() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function handleSearch(e) {
    e.preventDefault()
    appDispatch({ type: "searchOpen" })
  }
  return (
    <>
      <form onSubmit={handleSearch} className="flex flex-row items-baseline justify-between border border-white py-4 px-2">
        <input name="search" type="text" placeholder="Speak GIPHY.." autoComplete="off" className="w-full h-10 text-black px-2"></input>
        <button type="submit" className="inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800">
          Search
        </button>
      </form>
      <Transition show={appState.searchWindow} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
        <SearchResult />
      </Transition>
    </>
  )
}

export default SearchBox
