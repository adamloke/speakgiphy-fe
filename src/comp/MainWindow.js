import React from "react"

//Components
import Menu from "./Menu"
import Feed from "./Feed"
import SearchBox from "./SearchBox"

function MainWindow() {
  return (
    <div className="flex flex-col justify-between h-screen w-full">
      <Menu />
      <Feed />
      <SearchBox />
    </div>
  )
}

export default MainWindow
