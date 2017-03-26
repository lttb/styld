'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const styledClassFlag = exports.styledClassFlag = '_';

const pullOutStylesReducerByElem = exports.pullOutStylesReducerByElem = elem => (elemStyles, [prop, val]) => Object.assign({}, elemStyles, prop.startsWith(styledClassFlag) ? { [elem + prop]: val } : { [elem]: Object.assign({}, elemStyles[elem], { [prop]: val }) });

const pullOutStyles = exports.pullOutStyles = (elem, styles) => Object.entries(styles).reduce(pullOutStylesReducerByElem(elem), { [elem]: {} });

const prepareStylesReducer = exports.prepareStylesReducer = (acc, [elem, styles]) => Object.assign({}, acc, pullOutStyles(elem, styles));

exports.default = styles => Object.entries(styles).reduce(prepareStylesReducer, {});