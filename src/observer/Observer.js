import Component from '../component/Component';
import ComponentWatcher from '../watcher/componentWatcher/ComponentWatcher';
import ObserverWatch from './ObserverWatch';
import { createComponentManager } from '../component/ComponentManager';
import { objectAssign } from '../utilityFunc/utilityFunc';

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
        return new ObserverWatch(...arguments);
    }
}

(function() {
    if(typeof moudle !== 'undefined' && moudle.exports) {
        moudle.exports = Observer;
    } else {
        window.Observer = Observer;
    }
}(window));