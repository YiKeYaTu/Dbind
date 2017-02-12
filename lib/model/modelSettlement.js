'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.set = set;
exports.get = get;
exports.all = all;
exports.deleteOne = deleteOne;
exports.deleteAll = deleteAll;

var _BaseWatcher = require('../watcher/baseWatcher/BaseWatcher');

var _BaseWatcher2 = _interopRequireDefault(_BaseWatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var modelSettlement = {};

function set(modelExtractId, key, watcher) {
  if (!(watcher instanceof _BaseWatcher2.default)) throw new TypeError('watcher must extends from BaseWatcher');
  if (!modelSettlement[modelExtractId]) {
    modelSettlement[modelExtractId] = {};
  }
  var target = modelSettlement[modelExtractId];
  if (target[key]) {
    target[key][watcher.obId] = watcher;
  } else {
    target[key] = _defineProperty({}, watcher.obId, watcher);
  }
}
function get(modelExtractId, key) {
  return modelSettlement[modelExtractId] && modelSettlement[modelExtractId][key] || null;
}
function all(modelExtractId) {
  return modelSettlement[modelExtractId];
}
function deleteOne(modelExtractId, key) {
  delete modelSettlement[modelExtractId][key];
}
function deleteAll(modelExtractId) {
  modelSettlement[modelExtractId] = null;
}