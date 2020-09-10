import React from "react"

//Components
import Menu from "./Menu"
import Container from "./Container"
import Feed from "./Feed"
import SearchBox from "./SearchBox"

function MainWindow() {
  return (
    <>
      <Menu />
      <Container>
        <Feed />
        <SearchBox />
      </Container>
    </>
  )
}

export default MainWindow
