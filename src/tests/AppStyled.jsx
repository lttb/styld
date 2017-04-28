import React from 'react'

import injectStyled from '../'


const styles = {
  app: {
    margin: '50px',
  },
  header: {
    padding: '10px',
  },
  section: {
    _content: {
      color: 'red',
    },
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
}

const Header = ({ styled }) => (
  <styled.header>
    <styled.h1>Just H1</styled.h1>
    <styled.h1 $text>Force test</styled.h1>
  </styled.header>
)

const Content = ({ styled }) => (
  <styled.section $content _padding={20} data-name="content">
    <styled.p $text $h1>compose multiple classes test</styled.p>

    <styled.button>primitive test</styled.button>
    <styled.button _margin={10}>dynamic primitive test</styled.button>
  </styled.section>
)

export default injectStyled(styles)(({ styled }) => (
  <styled.app>
    <Header styled={styled} />

    <Content styled={styled} />
  </styled.app>
))
