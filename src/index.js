import { create as createJSS } from 'jss'
import React from 'react'
import injectSheet from 'react-jss'
import preset from 'jss-preset-default'

import domElements from './dom-elements'
import prepareStyles, { styledClassFlag } from './prepare-styles'


const JSS = createJSS(preset())


export const prepareStyled = ({ jss = JSS } = {}) => (styles) => {
  const stylesPrepared = prepareStyles(styles)

  const sheet = jss.createStyleSheet(stylesPrepared).attach()
  const Injector = injectSheet(stylesPrepared)

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
    .keys(stylesPrepared)
    .reduce((acc, key) => {
      const [elem, name] = key.split(styledClassFlag)

      const isDomeElem = domElements.has(elem)

      if (!isDomeElem) {
        return { ...acc, [elem]: createStyledElement('div', elem) }
      }

      if (name) {
        return {
          ...acc,
          [elem]: Object.assign(acc[elem] || {}, {
            [name]: createStyledElement(elem, key),
          }),
        }
      }

      return {
        ...acc,
        [elem]: Object.assign(createStyledElement(elem), acc[elem]),
      }
    }, {})
}

export default prepareStyled()
