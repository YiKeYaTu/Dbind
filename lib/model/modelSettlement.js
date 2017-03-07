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

var modelSettlement = {};

function set(modelExtractId, key, watcher) {
  if (!(watcher instanceof _BaseWatcher2.default)) throw new TypeError('watcher must extends from BaseWatcher');
  if (!modelSettlement[modelExtractId]) {
    modelSettlement[modelExtractId] = {};
  }
  var target = modelSettlement[modelExtractId];
  if (target[key]) {
    target[key].push(watcher);
  } else {
    target[key] = [watcher];
  }
}
function get(modelExtractId, key) {
  return modelSettlement[modelExtractId] && modelSettlement[modelExtractId][key] || null;
}
function all(modelExtractId) {
  return modelSettlement[modelExtractId];
}
function deleteOne(modelExtractId, key) {
  // modelSettlement[modelExtractId] = sa
  delete modelSettlement[modelExtractId][key];
}
function deleteAll(modelExtractId) {
  modelSettlement[modelExtractId] = null;
}