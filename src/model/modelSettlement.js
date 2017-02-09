import BaseWatcher from '../watcher/baseWatcher/BaseWatcher';

const modelSettlement = {};

export function set(modelExtractId, key, watcher) {
  if (!(watcher instanceof BaseWatcher))
    throw new TypeError('watcher must extends from BaseWatcher');
  if (!modelSettlement[modelExtractId]) {
    modelSettlement[modelExtractId] = {};
  }
  const target = modelSettlement[modelExtractId];
  if (target[key]) {
    target[key][watcher.obId] = watcher;
  } else {
    target[key] = {
      [watcher.obId]: watcher
    };
  }
}
export function get(modelExtractId, key) {
  return (modelSettlement[modelExtractId] && modelSettlement[modelExtractId][key]) || null;
}
export function all(modelExtractId) {
  return modelSettlement[modelExtractId];
}
export function deleteOne(modelExtractId, key) {
  delete modelSettlement[modelExtractId][key];
}
export function deleteAll(modelExtractId) {
  modelSettlement[modelExtractId] = null;
}