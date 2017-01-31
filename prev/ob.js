import Component from './Component';
import ComponentWatcher from './ComponentWatcher';
import Watch from './Watch';
import { createComponentManager } from './ComponentManager';
import { objectAssign } from './utilityFunc';

class Observer {    
    static createClass(componentInf) {
        return createComponentManager(componentInf);
    }
    static registerComponent(key, component) {
        ComponentWatcher.components[key] = component;
    }
    static render(element, component, props) {

    }
    static watch(element, data) {
        return new Watch(...arguments);
    }
}

(function() {
    if(typeof moudle !== 'undefined' && moudle.exports) {
        moudle.exports = Observer;
    } else {
        window.Observer = Observer;
    }
}(window));