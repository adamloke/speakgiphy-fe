import { Transition } from "@tailwindui/react"
import React, { useContext } from "react"
import Container from "./Container"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

function ChatWindow() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)

  function handleSearch(e) {
    e.preventDefault()
    appDispatch({ type: "searchOpen" })
  }

  return (
    <Container>
      <div className="flex flex-col justify-end border text-white border-white h-64 p-2">
        <div className="border border-white h-full w-full">
          <p>CHAT FEED</p>
        </div>
        <form onSubmit={handleSearch} className="flex flex-row items-baseline justify-between border-t-white py-4 px-2">
          <input name="search" type="text" placeholder="Search GIPHY.." autoComplete="off" className="w-full h-full text-black px-2"></input>
          <button type="submit" className="inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800">
            Search
          </button>
        </form>
        <Transition show={appState.searchWindow} enter="transition-opacity duration-500" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="border border-white h-20">
            <p>GIF GRID</p>
          </div>
        </Transition>
      </div>
    </Container>
  )
}

export default ChatWindow
