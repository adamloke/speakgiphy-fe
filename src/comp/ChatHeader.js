import React, { useContext } from "react"
import DispatchContext from "../DispatchContext"

function ChatHeader() {
  const appDispatch = useContext(DispatchContext)

  const menuOpen = () => {
    appDispatch({ type: "openMenu" })
  }
  return (
    <nav className="flex items-center justify-between flex-wrap p-3 md:p-6">
      <div className="flex text-white">
        <h1 className="font-bold text-2xl lg:text-4xl tracking-tight">SpeakGIPHY</h1>
      </div>
      <div className="flex justify-end lg:w-2/4 ">
        <button onClick={menuOpen} type="submit" className="flex items-center inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800">
          Menu
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
    </nav>
  )
}

export default ChatHeader
