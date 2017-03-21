import React from 'react'

import { Styled } from '../'


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
  section: {
    _content: {
      color: 'red',
    },
  },
  text: {
    color: 'green',
  },
  h1: {
    color: 'red',

    _text: {
      composes: '$text',
    },
  },
  p: {
    border: '1px solid black',
    composes: '$text $h1'.split(' '),
  },
  button: {
    margin: ({ margin = 0 }) => `${margin}px`,
  },
})

const Header = () => (
  <styled.header>
    <styled.h1>Just H1</styled.h1>
    <styled.h1.text>Force test</styled.h1.text>
  </styled.header>
)

const Content = () => (
  <styled.section.content
    attrs={{
      'data-name': 'content',
    }}
    padding={20}
  >
    <styled.p>compose multiple classes test</styled.p>

    <styled.button>primitive test</styled.button>
    <styled.button margin={10}>dynamic primitive test</styled.button>
  </styled.section.content>
)

export default () => (
  <styled.app>
    <Header />

    <Content />
  </styled.app>
)
