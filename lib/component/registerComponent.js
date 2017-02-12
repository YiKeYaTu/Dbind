'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerComponent;

var _ComponentWatcher = require('../watcher/componentWatcher/ComponentWatcher');

var _ComponentWatcher2 = _interopRequireDefault(_ComponentWatcher);

var _checkComponentName = require('./checkComponentName');

var _checkComponentName2 = _interopRequireDefault(_checkComponentName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function registerComponent(key, componentWatcher) {
  (0, _checkComponentName2.default)(key);
  _ComponentWatcher2.default.components[key] = componentWatcher;
}