'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentLifecycle = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utilityFunc = require('../utilityFunc/utilityFunc');

var _htmlParser = require('../parser/htmlParser');

var _htmlParser2 = _interopRequireDefault(_htmlParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentLifecycle = exports.ComponentLifecycle = ['didMount', 'willMount', 'willUpdate', 'shouldUpdate'];

var Component = function () {
  function Component() {
    _classCallCheck(this, Component);

    this.watcher = null;
    this.element = null;
    this.refs = null;
    this.template = null;
    this.props = null;
    this.data = null;
    this.propTypes = null;
  }

  _createClass(Component, [{
    key: 'init',
    value: function init(watcher, props) {
      this.watcher = watcher;
      this.props = props;
      this.template = this.__handleTemplate();
    }
  }, {
    key: 'setDOMElement',
    value: function setDOMElement(element) {
      this.element = element;
      this.__setRefs();
    }
  }, {
    key: 'trackingUpdate',
    value: function trackingUpdate(data) {
      var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

      var prevData = (0, _utilityFunc.objectAssign)({}, this.data);
      for (var key in data) {
        this.data[key] = data[key];
      }
      this.watcher.obwatcher.reset(cb, prevData, this.data);
    }
  }, {
    key: 'setProps',
    value: function setProps(props) {
      this.props = props;
    }
  }, {
    key: '__setRefs',
    value: function __setRefs() {
      var refs = {};
      (0, _utilityFunc.walkElement)(this.element, function (element) {
        var ref = element.getAttribute && element.getAttribute('ref');
        ref && (refs[ref] = element);
      });
      this.refs = refs;
    }
  }, {
    key: '__handleTemplate',
    value: function __handleTemplate() {
      return (0, _htmlParser2.default)(this.template);
    }
  }, {
    key: 'didMount',
    value: function didMount() {}
  }, {
    key: 'willMount',
    value: function willMount() {}
  }, {
    key: 'willUpdate',
    value: function willUpdate() {}
  }, {
    key: 'shouldUpdate',
    value: function shouldUpdate() {
      return true;
    }
  }]);

  return Component;
}();

exports.default = Component;