import React from 'react'

import Styled from '../'


const styled = Styled({
  app: {
    margin: '50px',
  },
  header: {
    padding: '10px',
  },
  content: {
    padding: ({ padding }) => `${padding}px`,
  },
  h1: {
    color: 'red',
  },
  p: {
    border: '1px solid black',
  },
  text: {
    color: 'green',
  },
  button: {
    margin: ({ margin = 0 }) => `${margin}px`,
  },
})

const Header = () => (
  <styled.header>
    <styled.h1>Just H1</styled.h1>
    <styled.h1 force composes="text">Force test</styled.h1>
  </styled.header>
)

const Content = () => (
  <styled.section
    composes="content"
    attrs={{
      'data-name': 'content',
    }}
    padding={20}
  >
    <styled.p composes="text h1">compose multiple classes test</styled.p>

    <styled.button>primitive test</styled.button>
    <styled.button margin={10}>dynamic primitive test</styled.button>
  </styled.section>
)

export default () => (
  <styled.app>
    <Header />

    <Content />
  </styled.app>
)
