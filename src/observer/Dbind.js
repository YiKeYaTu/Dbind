import Component from '../component/Component';
import watch from './watch';
import registerComponent from '../component/registerComponent';
import { createComponentManager } from '../component/ComponentManager';

export default {
  createClass(componentInf) {
    return createComponentManager(componentInf);
  },
  registerComponent(key, component) {
    return registerComponent(key, component);
  },
  watch(element, data) {
    return new watch(...arguments);
  }
}