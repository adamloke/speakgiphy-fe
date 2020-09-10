import React from "react"
import Container from "../Container"
import Header from "./Header"
import Hero from "./Hero"
import Video from "./Video"
import TextLeft from "./TextLeft"
import TextCenter from "./TextCenter"
import Footer from "./Footer"

function MainGuest() {
  return (
    <>
      <Header />
      <Container>
        <Hero />
        <Video />
        <TextLeft />
        <TextCenter />
        <Footer />
      </Container>
    </>
  )
}

export default MainGuest
