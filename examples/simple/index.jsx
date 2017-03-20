import React from 'react'
import { render } from 'react-dom'

import injectStyled from '../../src'


const styles = {
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
  text: {
    color: 'green',
  },
  button: {
    margin: ({ margin = 0 }) => `${margin}px`,
  },
}

const Header = ({ styled }) => (
  <styled.header>
    <styled.h1>Styled JSS simple example</styled.h1>
  </styled.header>
)

const Content = ({ styled }) => (
  <styled.section
    composes="content"
    attrs={{
      'data-name': 'content',
      ref: (c) => { console.log('SECTION REF', c) },
    }}
    padding={20}
  >
    <styled.p composes="text">check this out</styled.p>

    <styled.button>first button</styled.button>
    <styled.button margin={10}>second button</styled.button>
  </styled.section>
)

const App = injectStyled(styles)(({ styled }) => (
  <styled.app>
    <Header styled={styled} />

    <Content styled={styled} />
  </styled.app>
))


render(<App />, document.querySelector('#app'))
