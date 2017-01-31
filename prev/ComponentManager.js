import Component from './Component';
import { randomId, objectAssign, deepClone } from './utilityFunc';

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
    return component;
  }
}

export function createComponentManager(componentInf) {
  return new ComponentManager(randomId(), componentInf);  
}