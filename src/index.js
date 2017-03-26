import { create as createJSS, getDynamicStyles } from 'jss'
import React, { PureComponent, Component } from 'react'
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

  const createStyledElement = (tag, name = tag) =>
    class StyledElement extends PureComponent {
      render() {
        const { children, ...data } = this.props

        const { props, composes, attrs } = Object
          .entries(data)
          .reduce((acc, [key, value]) => {
            if (key.startsWith(`$${styledClassFlag}`)) {
              return !value ? acc : Object.assign(acc, {
                composes: acc.composes.add(name + key.slice(1)),
              })
            }

            if (key.startsWith('$')) {
              return !value ? acc : Object.assign(acc, {
                composes: acc.composes.add(key.slice(1)),
              })
            }

            if (key.startsWith('_')) {
              return Object.assign(acc, {
                props: { ...acc.props, [key.slice(1)]: value },
              })
            }

            return Object.assign(acc, {
              attrs: { ...acc.attrs, [key]: value },
            })
          }, { props: {}, attrs: {}, composes: new Set([name]) })

        if (Object.keys(props).length) {
          if (!this.dynamicSheet) {
            const dynamicStyles = getDynamicStyles({ [name]: stylesPrepared[name] })

            this.dynamicSheet = jss.createStyleSheet(
              dynamicStyles,
              {
                meta: 'ComponentDynamic',
                link: true,
              },
            ).update(props).attach()
          } else {
            this.dynamicSheet.update(props)
          }

          const classes = Object.entries(this.dynamicSheet.classes).reduce((acc, [key, value]) => ({
            ...acc,
            [key]: acc[key]
              ? `${value} ${acc[key]}`
              : value,
          }), sheet.classes)

          return React.createElement(
            tag,
            {
              ...attrs,
              className: getClasses({
                classes,
                composes: [...composes],
              }),
            },
            children,
          )
        }

        return React.createElement(
          tag,
          {
            ...attrs,
            className: getClasses({
              classes: { ...sheet.classes },
              composes: [...composes],
            }),
          },
          children,
        )
      }
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
