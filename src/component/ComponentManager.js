import Component from './Component';
import checkComponentName from './checkComponentName';

import { randomId, objectAssign, deepClone, is } from '../utilityFunc/utilityFunc';

export class ComponentManager {
  constructor(id, componentInf) {
    this.id = id;
    this.componentInf = componentInf;
    this.trackingUpdate = null;
    this.childObData = null;
    this.childModelExtactId = null;
    this.cbFuncs = [];
  }
  createComponent() {
    let component = new Component();
    const data = this.componentInf.data;
    const components = this.componentInf.components;

    delete this.componentInf.data;
    delete this.componentInf.components;

    component = objectAssign(component, deepClone(this.componentInf));

    this.componentInf.data = data;
    this.componentInf.components = components;

    component.data = (typeof data === 'function') && data() || data;    
    component.components = components;

    bindComponentFunc(component.data, component);
    checkComponentsName(component.components);
    return component;
  }
}

function bindComponentFunc(data, scope) {
  for(let key in data) {
    if(is(data[key], 'function')) {
      data[key] = data[key].bind(scope);
    }
  }
}

function checkComponentsName(components) {
  for(let key in components) {
    checkComponentName(key);
  }
}

export function createComponentManager(componentInf) {
  return new ComponentManager(randomId(), componentInf);  
}