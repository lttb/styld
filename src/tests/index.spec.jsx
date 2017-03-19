import renderer from 'react-test-renderer'

import React from 'react'

import App from './App'
import AppStyled from './AppStyled'


it('renders correctly App', () => {
  const tree = renderer.create(<App />).toJSON()

  expect(tree).toMatchSnapshot()
})

it('renders correctly AppStyled', () => {
  const tree = renderer.create(<AppStyled />).toJSON()

  expect(tree).toMatchSnapshot()
})
