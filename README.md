# SpeakGIPHY

SpeakGIPHY is a full-stack chat application where users can create an account and chat directly with other users, only communicating through the GIPHY API.

See live demo -> [SpeakGIPHY.com](https://www.speakgiphy.com/).

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Setup](#setup)
- [Features](#features)
- [Contact](#contact)

## General info

This project is part of Wild Code School's full-stack Web Development Bootcamp. The mission was to build a React application that uses a REST API.

I choose to build a chat application where users can communicate with each other, only using the GIPHY API. Regardless of your country of origin, anybody can understand GIF:s. It's not a spoken language; it's a language of emotions and humor.

## Technologies

- Tailwind
- React
- Socket.io
- Node
- Express
- MongoDB

## Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Code Examples

The front-end of the application is built with React using Immer, Context, and Reducer.

```
function App() {

  const initialState = {
    loggedIn: Boolean(localStorage.getItem("speakgiphyToken")),
    user: {
      token: localStorage.getItem("speakgiphyToken"),
    ...

  function Reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        break
    ....

  const [state, dispatch] = useImmerReducer(Reducer, initialState)

```

## Features

- Create account
- Search GIPHY API
- Chat instantly with other users
- See other active online users
- Mobile responsive

## Contact

Created by Adam Loke (adam@adamloke.com) - feel free to contact me
