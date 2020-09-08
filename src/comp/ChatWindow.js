import React from "react"
import Container from "./Container"

function ChatWindow() {
  return (
    <Container>
      <div className="flex flex-col justify-end border border-white h-screen">
        <form className="flex flex-row justify-between border-t-white">
          <input name="search" type="text" placeholder="Search GIPHY.." autoComplete="off" className="w-full"></input>
          <button type="submit" className="inline-block text-md font-semibold mx-2 px-4 py-3 leading-none border text-white border-purple-700 bg-purple-700 hover:border-transparent hover:bg-purple-800 mt-4 lg:mt-0">
            Search
          </button>
        </form>
      </div>
    </Container>
  )
}

export default ChatWindow
