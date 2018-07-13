'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRedux = require('react-redux');

var _dompurify = require('dompurify');

var _utils = require('./utils');

var _styles = require('./styles');

var styles = _interopRequireWildcard(_styles);

var _themes = require('./themes');

var themes = _interopRequireWildcard(_themes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tooltip = function (_React$Component) {
  _inherits(Tooltip, _React$Component);

  function Tooltip() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Tooltip);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Tooltip.__proto__ || Object.getPrototypeOf(Tooltip)).call.apply(_ref, [this].concat(args))), _this), _this.state = {}, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Tooltip, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var place = nextProps.place,
          content = nextProps.content,
          children = nextProps.children;

      var origin = (0, _utils.originOrEl)(nextProps);
      if (origin) {
        this.updatePosition(nextProps);
      }
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(props) {
      var _this2 = this;

      // Render content into hidden DOM element to determine size
      var content = this.children(props);
      _reactDom2.default.render(React.createElement(
        'div',
        null,
        content
      ), this.shadow, function () {
        var state = (0, _utils.adjust)(_this2.shadow, props);
        _this2.setState(state);
      });
    }
  }, {
    key: 'children',
    value: function children() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
      var content = props.content;

      if (typeof content === 'string') {
        content = React.createElement('div', { dangerouslySetInnerHTML: { __html: (0, _dompurify.sanitize)(content) } });
      }
      return content ? content : props.children;
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _props = this.props,
          id = _props.id,
          className = _props.className,
          show = _props.show,
          onHover = _props.onHover,
          onLeave = _props.onLeave;

      var origin = (0, _utils.originOrEl)(this.props);
      var _state = this.state,
          place = _state.place,
          offset = _state.offset;

      var content = this.children();
      var visibility = origin && show ? 'visible' : 'hidden';
      var style = _extends({ visibility: visibility }, offset);

      return React.createElement(
        'div',
        { className: className },
        React.createElement(
          'div',
          {
            ref: function ref(e) {
              _this3.tooltip = e;
            },
            style: style,
            id: id,
            className: id + '-main',
            onMouseEnter: onHover,
            onMouseLeave: onLeave
          },
          React.createElement(
            'div',
            {
              ref: function ref(e) {
                _this3.content = e;
              },
              id: id + '-content',
              className: id + '-content'
            },
            content
          ),
          React.createElement('div', {
            id: id + '-arrow',
            className: id + '-arrow ' + id + '-arrow-' + place,
            key: 'a-' + place
          })
        ),
        React.createElement('div', {
          ref: function ref(e) {
            _this3.shadow = e;
          },
          id: id + '-shadow',
          className: id + '-shadow'
        })
      );
    }
  }]);

  return Tooltip;
}(React.Component);

Tooltip.defaultProps = {
  show: false,
  place: 'top',
  auto: true,
  id: 'tooltip',
  className: 'tooltip'
};


function select(state, ownProps) {
  var tooltips = state.tooltip;

  var names = (0, _utils.resolve)(ownProps);
  if (1 < names.length) {
    console.error('<Tooltip> does not accept a list of names as \'name\' props: ' + names);
  }
  var name = names[0];
  var tooltip = tooltips[name];
  return _extends({}, tooltip, ownProps);
}

exports.default = (0, _reactRedux.connect)(select)(Tooltip);