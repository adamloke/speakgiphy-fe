import React, { useContext } from "react"
import DispatchContext from "../DispatchContext"

function Header(props) {
  const appDispatch = useContext(DispatchContext)

  function handleLogout() {
    appDispatch({ type: "logout" })
  }
  return (
    <nav className="flex items-center justify-between flex-wrap my-6 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-bold text-4xl tracking-tight">SpeakGIPHY</span>
      </div>
      <div className="flex justify-end w-2/4 items-center">
        <button onClick={handleLogout} type="submit" className="inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800 mt-4 lg:mt-0">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Header
