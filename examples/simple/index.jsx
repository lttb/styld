import React from 'react'
import { render } from 'react-dom'

import Styled from '../../lib'


const styled = Styled({
  app: {
    margin: '50px',
  },
  header: {
    padding: '10px',
  },
  content: {
    padding: ({ padding }) => padding,
  },
  h1: {
    color: 'red',
  },
  text: {
    color: 'green',
  },
  button: {
    margin: ({ margin = 0 }) => margin,
  },
})

const Header = () => (
  <styled.header>
    <styled.h1>Styled JSS simple example</styled.h1>
  </styled.header>
)

const Content = () => (
  <styled.section
    mix="content"
    attrs={{
      'data-name': 'content',
      ref: (c) => { console.log('SECTION REF', c) },
    }}
    padding={20}
  >
    <styled.p mix="text">check this out</styled.p>

    <styled.button>first button</styled.button>
    <styled.button margin={10}>second button</styled.button>
  </styled.section>
)

const App = () => (
  <styled.app>
    <Header />

    <Content />
  </styled.app>
)


render(<App />, document.querySelector('#app'))
