import React from 'react'
import { render } from 'react-dom'

import Styled from '../../src'


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
      composes: '$content',
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
      ref: (c) => { console.log('SECTION REF', c) },
    }}
    padding={20}
  >
    <styled.p>compose multiple classes test</styled.p>

    <styled.button>primitive test</styled.button>
    <styled.button margin={10}>dynamic primitive test</styled.button>
  </styled.section.content>
)

const App = () => (
  <styled.app>
    <Header />

    <Content />
  </styled.app>
)


render(<App />, document.querySelector('#app'))
