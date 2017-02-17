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
    component = objectAssign(component, deepClone(this.componentInf));
    component.components = this.componentInf.components;
    const scope = createScope(component);
    bindComponentFunc(component.data, scope);
    checkComponentsName(component.components);
    return component;
  }
}

function createScope(component) {
  return {
    data: component.data,
    trackingUpdate: component.trackingUpdate.bind(component)
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