import React, { useEffect, useContext } from "react"
import { useImmer } from "use-immer"
import { Transition } from "@headlessui/react"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import io from "socket.io-client"

const socket = io("https://speakgiphy.herokuapp.com")

function ChatMenu() {
  const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [state, setState] = useImmer({
    activeUsers: [],
  })

  // get all socket connected users
  useEffect(() => {
    let mounted = true
    socket.on("activeUsers", (users) => {
      if (mounted) {
        setState((draft) => {
          draft.activeUsers = users
        })
      }
    })
    return () => (mounted = false)
  }, [])

  // close side menu
  const closeMenu = () => {
    appDispatch({ type: "closeMenu" })
  }

  // display list of active users
  const showActiveUsers = state.activeUsers.map((username, index) => {
    if (state.activeUsers) {
      return (
        <div key={index} className="flex flex-row items-center my-2">
          <span className="flex h-2 w-2 mr-4">
            <span className="animate-ping relative inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-15 bg-green-700"></span>
          </span>
          <p className="text-lg text-spacegray font-semibold">{username}</p>
        </div>
      )
    } else {
      return console.log("No active users")
    }
  })

  // logout user from app
  const handleLogout = () => {
    socket.emit("removeUser", { username: appState.user.username })
    appDispatch({ type: "logout" })
  }

  return (
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
  )
}

export default ChatMenu
