'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Styled = exports.prepareStyled = undefined;

var _jss = require('jss');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _jssPresetDefault = require('jss-preset-default');

var _jssPresetDefault2 = _interopRequireDefault(_jssPresetDefault);

var _domElements = require('./dom-elements');

var _domElements2 = _interopRequireDefault(_domElements);

var _prepareStyles = require('./prepare-styles');

var _prepareStyles2 = _interopRequireDefault(_prepareStyles);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

const JSS = (0, _jss.create)((0, _jssPresetDefault2.default)());

const getClasses = ({ composes = [], classes = {} }) => composes.reduce((acc, className) => acc.concat(classes[className] || []), []).join(' ');

const prepareStyled = ({ jss = JSS } = {}) => styles => {
  const stylesPrepared = (0, _prepareStyles2.default)(styles);

  const sheet = jss.createStyleSheet(stylesPrepared).attach();

  const createStyledElement = (tag, name = tag) => class StyledElement extends _react.PureComponent {
    render() {
      const _props = this.props,
            { children } = _props,
            data = _objectWithoutProperties(_props, ['children']);

      const { props, composes, attrs } = Object.entries(data).reduce((acc, [key, value]) => {
        if (key.startsWith(`$${_prepareStyles.styledClassFlag}`)) {
          return !value ? acc : Object.assign(acc, {
            composes: acc.composes.add(name + key.slice(1))
          });
        }

        if (key.startsWith('$')) {
          return !value ? acc : Object.assign(acc, {
            composes: acc.composes.add(key.slice(1))
          });
        }

        if (key.startsWith('_')) {
          return Object.assign(acc, {
            props: Object.assign({}, acc.props, { [key.slice(1)]: value })
          });
        }

        return Object.assign(acc, {
          attrs: Object.assign({}, acc.attrs, { [key]: value })
        });
      }, { props: {}, attrs: {}, composes: new Set([name]) });

      if (Object.keys(props).length) {
        if (!this.dynamicSheet) {
          const dynamicStyles = (0, _jss.getDynamicStyles)({ [name]: stylesPrepared[name] });

          this.dynamicSheet = jss.createStyleSheet(dynamicStyles, {
            meta: 'ComponentDynamic',
            link: true
          }).update(props).attach();
        } else {
          this.dynamicSheet.update(props);
        }

        const classes = Object.entries(this.dynamicSheet.classes).reduce((acc, [key, value]) => Object.assign({}, acc, {
          [key]: acc[key] ? `${value} ${acc[key]}` : value
        }), sheet.classes);

        return _react2.default.createElement(tag, Object.assign({}, attrs, {
          className: getClasses({
            classes,
            composes: [...composes]
          })
        }), children);
      }

      return _react2.default.createElement(tag, Object.assign({}, attrs, {
        className: getClasses({
          classes: Object.assign({}, sheet.classes),
          composes: [...composes]
        })
      }), children);
    }
  };

  const get = (...classes) => classes.reduce((acc, name) => name ? acc.concat(name.split(' ')) : acc, []).map(name => sheet.classes[name]).filter(Boolean).join(' ');

  return Object.keys(stylesPrepared).reduce((acc, key) => {
    const [elem, name] = key.split(_prepareStyles.styledClassFlag);

    const isDomeElem = _domElements2.default.has(elem);

    if (!isDomeElem) {
      return Object.assign({}, acc, { [elem]: createStyledElement('div', elem) });
    }

    if (name) {
      return Object.assign({}, acc, {
        [elem]: Object.assign(acc[elem] || {}, {
          [name]: createStyledElement(elem, key)
        })
      });
    }

    return Object.assign({}, acc, {
      [elem]: Object.assign(createStyledElement(elem), acc[elem])
    });
  }, { get });
};

exports.prepareStyled = prepareStyled;
const Styled = exports.Styled = prepareStyled();

const extend = (obj1, obj2 = {}) => Object.entries(obj1).reduce((acc, [key, value]) => Object.assign({}, acc, { [key]: Object.assign({}, value, obj2[key]) }), {});

exports.default = (styles, StyledFunc = Styled) => Element => {
  return class StyledComponent extends _react.Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.setStyles = (propStyles = {}) => Object.assign({}, extend(styles, propStyles.extend), propStyles.assign), this.render = () => _react2.default.createElement(Element, Object.assign({}, this.props, {
        styled: this.styled,
        $: this.styled,
        styles: this.styles
      })), _temp;
    }

    componentWillMount() {
      this.styles = this.setStyles(this.props.styles);
      this.styled = StyledFunc(this.styles);
    }

  };
};