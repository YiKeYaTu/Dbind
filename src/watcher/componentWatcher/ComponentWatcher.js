import Component from '../../component/Component';
import { ComponentManager } from '../../component/ComponentManager';
import Dbind from '../../observer/Dbind';

import { toArray, objectAssign, randomId, deepClone, toHump } from '../../utilityFunc/utilityFunc';

import htmlParser from '../../parser/htmlParser';
import { NOR_STATEMENT_TYPE, ONCE_STATEMENT_TYPE, CONST_STRING } from '../../parser/statementExtract';
import { all, get, deleteAll } from '../../model/modelSettlement';

export default class ComponentWatcher {
  static nodeName = 'component';
  static instructions = ['data-from', 'data-props'];
  static components = {};
  constructor(base, BaseWatcher) {
    this.base = base;
    this.BaseWatcher = BaseWatcher;
    this.modelExtractId = randomId();
    this.instructions = this.__getInstructions();
    this.props = this.__getProps();
    this.model = this.__getModel();
    this.componentManager = this.__getComponentManager();
    this.component = this.componentManager && this.componentManager.createComponent();
    this.__removeRootNode();
  }
  destructor() {
    this.childWatcher && this.childWatcher.forEach((item) => {
      item.destructor();
    }); 
    deleteAll(this.modelExtractId);
    this.childWatcher = []; 
  }
  render(cb = () => { }) {
    if (!this.componentManager) return;
    this.resolvedProps = this.__bindProps();
    this.component.init(this.base, this.resolvedProps);
    this.child = this.__renderComponent();
    this.component.setDOMElement(this.child);
    this.component.willMount();
    this.data = objectAssign({}, this.component.props, this.component.data);
    this.childWatcher = this.__setChildWatcher();
    this.component.didMount();
    cb();
  }
  reset(cb = () => { }, prevData, nextData) {
    let componentManager =  this.__getComponentManager();
    if (componentManager && (!this.componentManager || componentManager.id !== this.componentManager.id)) {
      this.componentManager = componentManager;
      this.component = this.componentManager.createComponent();
      this.destructor();
      this.render(cb);
    } else if(!componentManager) {
      this.destructor();
    } else {
      const oldProps = this.resolvedProps;
      const resetWatcherList = [];
      this.resolvedProps = this.__bindProps();
      if (!this.component.shouldUpdate(oldProps, this.resolvedProps)) {
        return;
      }
      this.component.setProps(this.resolvedProps);
      this.component.willUpdate(oldProps, this.resolvedProps);
      for (let key in oldProps) {
        if (oldProps[key] !== this.component.props[key]) {
          let cb = get(this.modelExtractId, key);
          this.data[key] = this.component.props[key];
          cb && resetWatcherList.push(cb);
        }
      }
      for (let key in this.component.data) {
        if (this.component.data[key] !== this.data[key]) {
          let cb = get(this.modelExtractId, key);
          this.data[key] = this.component.data[key]
          cb && resetWatcherList.push(cb);
        }
      }
      this.base.runResetWatcher(resetWatcherList, this.data, cb);
    }
  }
  __removeRootNode() {
    const element = this.base.element;
    element.parentNode.removeChild(element);
  }
  __setChildWatcher() {
    let previous = null;
    let modelExtractId = this.modelExtractId;
    let components = this.component.components;
    let data = this.data;
    if(this.componentManager) {
      if(this.componentManager.childModelExtractId) {
        modelExtractId = this.componentManager.childModelExtractId;
        data = this.componentManager.childObData;
        components = this.componentManager.childComponents;
      }
    }
    return this.child.map((item, index) => {
      return new this.BaseWatcher(
        item,
        objectAssign({}, data),
        previous,
        null,
        modelExtractId,
        components,
        this.base,
        this.base.getChildId(index)
      );
      previous = item;
    });
  }
  __bindProps() {
    const props = {};
    this.props.normalProps.forEach((item) => {
      props[item.name] = item.value[0].value;
    });
    this.props.obProps.forEach((prop) => {
      let str = null;
      prop.value.forEach((item) => {
        if (item.type === NOR_STATEMENT_TYPE || item.type === ONCE_STATEMENT_TYPE) {
          let val = this.base.execStatement(item.value);
          if (str === null) {
            str = val;
          } else {
            str += val;
          }
        } else {
          if (str === null) {
            str = item.value;
          } else {
            str += item.value;
          }
        }
      });
      props[prop.name] = str;
    });
    this.__bindChildrenProps(props);
    return props;
  }
  __bindChildrenProps(props) {
    let children = this.base.element.innerHTML;
    if(children.replace(/\s/g, '')) {
      this.base.element.innerHTML = '';
      let childrenComponent = Dbind.createClass({
        data: this.base.obdata,
        template: children
      });
      childrenComponent.childObData = this.base.obdata;
      childrenComponent.childModelExtractId = this.base.modelExtractId;
      childrenComponent.childComponents = this.base.components;
      if(props.children) {
        throw new TypeError('You should not use children props');
      }
      props.children = childrenComponent;
    }
  }
  __renderComponent() {
    if (!this.component) return;
    const frg = document.createDocumentFragment();
    const template = document.createElement('div');
    const parent = this.base.pastDOMInformation.parentNode;
    if(typeof this.component.template === 'string') {
      template.innerHTML = htmlParser(this.component.template);
    } else if(typeof this.component.template === 'function') {
      template.innerHTML = htmlParser(this.component.template());
    }
    const child = toArray(template.childNodes);
    while (template.childNodes[0]) {
      frg.appendChild(template.childNodes[0]);
    }
    parent.insertBefore(frg, this.base.pastDOMInformation.nextSibling);
    return child;
  }
  __getComponentManager() {
    const componentDataFrom = this.base.execStatement(this.instructions[ComponentWatcher.instructions[0]]);
    const componentName = this.base.pastDOMInformation.nodeName.toLowerCase();
    let componentManager = null;

    if(componentName === ComponentWatcher.nodeName) {
      if (typeof componentDataFrom === 'string') {
        if (this.base.components && this.base.components[componentDataFrom]) {
          componentManager = this.base.components[componentDataFrom];
        } else if (ComponentWatcher.components[componentDataFrom]) {
          componentManager = ComponentWatcher.components[componentDataFrom];
        }  
      } else if (componentDataFrom instanceof ComponentManager) {
        componentManager = componentDataFrom;
      }
    } else {
      if(this.base.components && this.base.components[componentName]) {
        componentManager = this.base.components[componentName];
      } else if(ComponentWatcher.components[componentName]) {
        componentManager = ComponentWatcher.components[componentName];
      }
    }

    return componentManager;
  }
  __getInstructions() {
    const ins = {};
    this.base.__filterAttr(ComponentWatcher.instructions, true).forEach((item) => {
      ins[item.name] = item.value;
    });
    return ins;
  }
  __getProps() {
    const props = this.base.__filterAttr(ComponentWatcher.instructions, false);
    const obProps = [],
      normalProps = [];
    props.forEach((prop) => {
      let parsed = this.base.statementExtract(prop.value);
      let type = null, ob = false;
      let obj = {};
      obj.name = toHump(prop.name);
      obj.value = parsed.map((item) => {
        if (item.type === NOR_STATEMENT_TYPE || item.type === ONCE_STATEMENT_TYPE) {
          ob = true;
        }
        return item;
      });
      if (ob === true) {
        obProps.push(obj);
      } else {
        normalProps.push(obj);
      }
    });
    return { obProps, normalProps };
  }
  __getModel() {
    const instructionModel = this.__getInstructionsModel(),
      propsModel = this.__getPropsModel();
    return instructionModel.concat(propsModel);
  }
  __getInstructionsModel() {
    const res = [];
    for(let key in this.instructions) {
      this.base.modelExtract(this.instructions[key]).forEach((item) => {
        res.push(item.value);
      });
    }
    return res;
  }
  __getPropsModel() {
    const res = [];
    this.props.obProps.forEach((prop) => {
      prop.value.forEach((item) => {
        if (item.type === NOR_STATEMENT_TYPE) {
          this.base.modelExtract(item.value).forEach((model) => {
            res.push(model.value);
          });
        }
      });
    });
    return res;
  }
}