'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ComponentManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createComponentManager = createComponentManager;

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _checkComponentName = require('./checkComponentName');

var _checkComponentName2 = _interopRequireDefault(_checkComponentName);

var _utilityFunc = require('../utilityFunc/utilityFunc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ComponentManager = exports.ComponentManager = function () {
  function ComponentManager(id, componentInf) {
    _classCallCheck(this, ComponentManager);

    this.id = id;
    this.componentInf = componentInf;
    this.trackingUpdate = null;
  }

  _createClass(ComponentManager, [{
    key: 'createComponent',
    value: function createComponent() {
      var component = new _Component2.default();
      component = (0, _utilityFunc.objectAssign)(component, (0, _utilityFunc.deepClone)(this.componentInf));
      component.components = this.componentInf.components;
      var scope = createScope(component);
      bindComponentFunc(component.data, scope);
      checkComponentsName(component.components);
      return component;
    }
  }]);

  return ComponentManager;
}();

function createScope(component) {
  return {
    data: component.data,
    trackingUpdate: component.trackingUpdate.bind(component)
  };
}

function bindComponentFunc(data, scope) {
  for (var key in data) {
    if ((0, _utilityFunc.is)(data[key], 'function')) {
      data[key] = data[key].bind(scope);
    }
  }
}

function checkComponentsName(components) {
  for (var key in components) {
    (0, _checkComponentName2.default)(key);
  }
}

function createComponentManager(componentInf) {
  return new ComponentManager((0, _utilityFunc.randomId)(), componentInf);
}