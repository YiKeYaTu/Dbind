import Component from './Component';
import ComponentWatcher from './ComponentWatcher';
import Watch from './Watch';
import { objectAssign } from './utilityFunc';

class Observer {    
    static createComponent(componentInf) {
        const component = objectAssign(new Component, componentInf);
        return component;
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