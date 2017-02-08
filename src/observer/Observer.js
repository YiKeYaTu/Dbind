import Component from '../component/Component';
import ComponentWatcher from '../watcher/componentWatcher/ComponentWatcher';
import ObserverWatch from './ObserverWatch';
import { createComponentManager } from '../component/ComponentManager';
import { objectAssign } from '../utilityFunc/utilityFunc';

const Observer = {
  createClass(componentInf) {
    return createComponentManager(componentInf);
  },
  registerComponent(key, component) {
    ComponentWatcher.components[key] = component;
  },
  watch(element, data) {
    return new ObserverWatch(...arguments);
  }
}

if(typeof moudle !== 'undefined' && module.exports) {
  module.exports = Observer;
} else {
  window.Observer = Observer;
}
