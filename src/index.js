import { create as createJSS } from 'jss'
import React from 'react'
import injectSheet from 'react-jss'
import preset from 'jss-preset-default'

import domElements from './dom-elements'


const JSS = createJSS(preset())

const getClasses = ({ composes = [], classes = {} }) => composes
  .reduce((acc, className) => acc.concat(classes[className] || []), [])
  .join(' ')


export const prepareStyled = ({ jss = JSS } = {}) => (styles) => {
  const sheet = jss.createStyleSheet(styles).attach()

  const Injector = injectSheet(styles)

  const createStyledElement = (tag, name = tag) => ({ composes = '', children, attrs, force, ...data }) => {
    const Element = ({ classes }) => React.createElement(
      tag,
      {
        ...attrs,
        className: getClasses({
          classes,
          composes: composes.split(' ').concat(force ? [] : name),
        }),
      },
      children,
    )

    if (Object.keys(data).length) {
      return React.createElement(Injector(Element), data)
    }

    return React.createElement(Element, sheet)
  }

  return new Proxy({}, {
    get: (target, elem) => {
      if (domElements.includes(elem)) {
        return createStyledElement(elem)
      }

      return createStyledElement('div', elem)
    },
  })
}

export default prepareStyled()
