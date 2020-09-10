import React, { useState, useContext } from "react"
import Axios from "axios"
import DispatchContext from "../../DispatchContext"

function Header() {
  const appDispatch = useContext(DispatchContext)

  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const handleUsername = (e) => setUsername(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/login", { username, password })
      if (response.data) {
        appDispatch({ type: "login", data: response.data })
      } else {
        console.log("Oops! Incorrect username or password!")
      }
    } catch (e) {
      console.log(e.response.data)
    }
  }
  return (
    <nav className="flex items-center justify-between flex-wrap my-6 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <span className="font-bold text-4xl tracking-tight">SpeakGIPHY</span>
      </div>
      <div className="flex justify-end w-2/4 items-center">
        <form onSubmit={handleSubmit}>
          <input onChange={handleUsername} name="username" type="text" placeholder="Username" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-600 placeholder-gray-700 border border-gray-600 text-white mx-2 py-2 px-4 w-64 appearance-none leading-normal"></input>
          <input onChange={handlePassword} name="password" type="password" placeholder="Password" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-600 placeholder-gray-700 border border-gray-600 text-white mx-2 py-2 px-4 w-64 appearance-none leading-normal"></input>
          <button className="inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800 mt-4 lg:mt-0">Login</button>
        </form>
      </div>
    </nav>
  )
}

export default Header
