'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = traversalVector;

var _utilityFunc = require('../../utilityFunc/utilityFunc');

function traversalVector(vector, cb) {
  if (!(0, _utilityFunc.is)(cb, 'function')) {
    throw new TypeError('cb is not a function');
  }
  if ((0, _utilityFunc.is)(vector, 'array')) {
    vector.forEach(function (item, index) {
      cb(index, index);
    });
  } else if ((0, _utilityFunc.is)(vector, 'object')) {
    var count = 0;
    for (var key in vector) {
      if (vector.hasOwnProperty(key)) {
        cb(key, count++);
      }
    }
  }
}