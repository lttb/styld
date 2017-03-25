import { create as createJSS } from 'jss'
import React, { Component } from 'react'
import injectSheet from 'react-jss'
import preset from 'jss-preset-default'

import domElements from './dom-elements'
import prepareStyles, { styledClassFlag } from './prepare-styles'


const JSS = createJSS(preset())


const getClasses = ({ composes = [], classes = {} }) => composes
  .reduce((acc, className) => acc.concat(classes[className] || []), [])
  .join(' ')


export const prepareStyled = ({ jss = JSS } = {}) => (styles) => {
  const stylesPrepared = prepareStyles(styles)

  const sheet = jss.createStyleSheet(stylesPrepared).attach()
  const Injector = injectSheet(stylesPrepared)

  const createStyledElement = (tag, name = tag) => ({ children, ...data }) => {
    const { props, composes, attrs } = Object
      .entries(data)
      .reduce((acc, [key, value]) => {
        if (key.startsWith(`$${styledClassFlag}`) && value) {
          return Object.assign(acc, {
            composes: acc.composes.add(name + key.slice(1)),
          })
        }

        if (key.startsWith('$') && value) {
          return Object.assign(acc, {
            composes: acc.composes.add(key.slice(1)),
          })
        }

        if (key.startsWith('_') && value) {
          return Object.assign(acc, {
            attrs: { ...acc.attrs, [key.slice(1)]: value },
          })
        }

        return Object.assign(acc, {
          props: { ...acc.props, [key]: value },
        })
      }, { props: {}, attrs: {}, composes: new Set([name]) })

    const Element = ({ classes }) => React.createElement(
      tag,
      {
        ...attrs,

        /*
         * some problems with static/dynamic styles
         * @see https://github.com/cssinjs/react-jss/issues/75
         */
        className: getClasses({
          classes: { ...sheet.classes, ...classes },
          composes: [...composes],
        }),
      },
      children,
    )

    if (Object.keys(props).length) {
      return React.createElement(Injector(Element), props)
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

export const Styled = prepareStyled()

const extend = (obj1, obj2 = {}) => Object
  .entries(obj1)
  .reduce((acc, [key, value]) => ({ ...acc, [key]: { ...value, ...obj2[key] } }), {})

export default (styles, StyledFunc = Styled) => Element =>
  class StyledComponent extends Component {
    componentWillMount() {
      this.styles = this.setStyles(this.props.styles)
      this.styled = StyledFunc(this.styles)
    }

    setStyles = (propStyles = {}) =>
      ({ ...extend(styles, propStyles.extend), ...propStyles.assign })

    render = () => React.createElement(Element, {
      ...this.props,
      styled: this.styled,
      $: this.styled,
      styles: this.styles,
    })
  }
