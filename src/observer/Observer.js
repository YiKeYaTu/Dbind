import Component from '../component/Component';
import ObserverWatch from './ObserverWatch';
import registerComponent from '../component/registerComponent';
import { createComponentManager } from '../component/ComponentManager';

const Observer = {
  createClass(componentInf) {
    return createComponentManager(componentInf);
  },
  registerComponent(key, component) {
    return registerComponent(key, component);
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
