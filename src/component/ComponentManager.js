import Component from './Component';

import { randomId, objectAssign, deepClone, is } from '../utilityFunc/utilityFunc';

export class ComponentManager {
  constructor(id, componentInf) {
    this.id = id;
    this.componentInf = componentInf;
    this.trackingUpdate = null;
  }
  createComponent() {
    let component = new Component();
    component = objectAssign(component, deepClone(this.componentInf));
    component.components = this.componentInf.components;
    let scope = {
      data: component.data,
      trackingUpdate: component.trackingUpdate.bind(component)
    };
    for(let key in component.data) {
      if(is(component.data[key], 'function')) {
        component.data[key] = component.data[key].bind(scope);
      }
    }
    return component;
  }
}

export function createComponentManager(componentInf) {
  return new ComponentManager(randomId(), componentInf);  
}