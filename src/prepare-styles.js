export const pullOutStylesReducerByElem = elem => (elemStyles, [prop, val]) => ({
  ...elemStyles,
  ...prop.startsWith('_')
    ? { [elem + prop]: val }
    : { [elem]: { ...elemStyles[elem], [prop]: val } },
})

export const pullOutStyles = (elem, styles) => Object
  .entries(styles)
  .reduce(pullOutStylesReducerByElem(elem), { [elem]: {} })

export const prepareStylesReducer = (acc, [elem, styles]) => ({
  ...acc,
  ...pullOutStyles(elem, styles),
})

export default styles => Object
  .entries(styles)
  .reduce(prepareStylesReducer, {})
