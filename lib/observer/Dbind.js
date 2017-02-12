'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Component = require('../component/Component');

var _Component2 = _interopRequireDefault(_Component);

var _watch2 = require('./watch');

var _watch3 = _interopRequireDefault(_watch2);

var _registerComponent2 = require('../component/registerComponent');

var _registerComponent3 = _interopRequireDefault(_registerComponent2);

var _ComponentManager = require('../component/ComponentManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createClass: function createClass(componentInf) {
    return (0, _ComponentManager.createComponentManager)(componentInf);
  },
  registerComponent: function registerComponent(key, component) {
    return (0, _registerComponent3.default)(key, component);
  },
  watch: function watch(element, data) {
    return new (Function.prototype.bind.apply(_watch3.default, [null].concat(Array.prototype.slice.call(arguments))))();
  }
};