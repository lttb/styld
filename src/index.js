import { create as createJSS } from 'jss'
import React from 'react'
import injectSheet from 'react-jss'
import preset from 'jss-preset-default'

import domElements from './dom-elements'


const JSS = createJSS(preset())


export const prepareStyled = ({ jss = JSS } = {}) => (styles) => {
  const sheet = jss.createStyleSheet(styles).attach()

  const Injector = injectSheet(styles)

  const createStyledElement = (tag, name = tag) => ({ children, attrs, ...data }) => {
    const Element = ({ classes }) => React.createElement(
      tag,
      {
        ...attrs,

        /*
         * some problems with static/dynamic styles
         * @see https://github.com/cssinjs/react-jss/issues/75
         */
        className: classes[name] || sheet.classes[name],
      },
      children,
    )

    if (Object.keys(data).length) {
      return React.createElement(Injector(Element), data)
    }

    return React.createElement(Element, sheet)
  }

  return Object
    .keys(styles)
    .reduce((acc, key) => {
      const [elem, name] = key.split('__')

      const isDomeElem = domElements.has(elem)

      if (isDomeElem && name) {
        return {
          ...acc,
          [elem]: Object.assign(acc[elem] || {}, {
            [name]: createStyledElement(elem, key),
          }),
        }
      }

      if (isDomeElem) {
        return {
          ...acc,
          [elem]: Object.assign(createStyledElement(elem), acc[elem]),
        }
      }

      return { ...acc, [elem]: createStyledElement('div', elem) }
    }, {})
}

export default prepareStyled()
