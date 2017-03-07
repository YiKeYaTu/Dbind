'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = checkComponentName;

var _utilityFunc = require('../utilityFunc/utilityFunc');

function checkComponentName(componentName) {
  for (var i = 0, len = componentName.length; i < len; i++) {
    var code = componentName.charCodeAt(i);
    if (code >= 65 && code <= 90) throw new SyntaxError('Unexpected token ' + componentName + ', You should not use an uppercase component name');
  }
  var dom = document.createElement(componentName);
  if (!(0, _utilityFunc.is)(dom, 'HTMLUnknownElement') && !(0, _utilityFunc.is)(dom, 'HTMLElement')) {
    throw new SyntaxError('Unexpected token ' + componentName + ', You should not use the tag name that already exists in HTML');
  }
}