import React, { useState, useContext } from "react"
import Axios from "axios"
import Container from "../Container"
import DispatchContext from "../../DispatchContext"

function Hero() {
  const appDispatch = useContext(DispatchContext)
  const [email, setEmail] = useState()
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const handleEmail = (e) => setEmail(e.target.value)
  const handleUsername = (e) => setUsername(e.target.value)
  const handlePassword = (e) => setPassword(e.target.value)

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await Axios.post("http://localhost:8080/register", { username, email, password })
      console.log("Account created")
      appDispatch({ type: "login" })
    } catch (e) {
      console.log(e.response.data)
    }
  }

  return (
    <Container>
      <div className="flex mt-32 justify-center">
        <div className="w-1/2 px-2 my-auto">
          <h1 className="text-white font-bold text-6xl">Do you speak GIF?</h1>
          <p className="text-gray-600 text-2xl">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1500 BC.</p>
        </div>
        <div className="flex justify-center w-1/2 px-2">
          <div className="flex-row w-64 bg-white w-2/3 px-12 py-6">
            <h2 className="text-black font-semibold text-center text-3xl mb-6">Create your account</h2>
            <form onSubmit={handleSubmit}>
              <input onChange={handleEmail} id="email-register" name="email" type="text" placeholder="your@email.com" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 mb-4 py-2 px-4 w-full appearance-none leading-normal"></input>
              <input onChange={handleUsername} id="username-register" name="username" type="text" placeholder="Pick a username" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 mb-4 py-2 px-4 w-full appearance-none leading-normal"></input>
              <input onChange={handlePassword} id="password-register" name="password" type="text" placeholder="Choose a password" autoComplete="off" className="focus:outline-none focus:shadow-outline bg-gray-100 border border-gray-300 placeholder-gray-500 text-gray-900 mb-4 py-2 px-4 w-full appearance-none leading-normal"></input>
              <button type="submit" className="inline-block text-md font-semibold w-full mt-4 px-4 py-4 leading-none border text-white text-center border-red-600 bg-red-600 hover:border-transparent hover:bg-red-800">
                Get Started
              </button>
            </form>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Hero
