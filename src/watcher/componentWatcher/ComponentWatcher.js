import Component from '../../component/Component';
import { ComponentManager } from '../../component/ComponentManager';

import { toArray, objectAssign, randomId, deepClone, toHump } from '../../utilityFunc/utilityFunc';

import { NOR_STATEMENT_TYPE, ONCE_STATEMENT_TYPE, CONST_STRING } from '../../parser/statementExtract';
import { all, get, del } from '../../model/modelSettlement';

export default class ComponentWatcher {
  static nodeNames = ['component'];
  static instructions = ['data-from'];
  static components = {};
  constructor(base, BaseWatcher) {
    this.base = base;
    this.BaseWatcher = BaseWatcher;
    this.modelExtractId = randomId();
    this.instruction = this.__getInstruction();
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
    this.childWatcher = []; 
  }
  render(cb = () => { }) {
    if (!this.componentManager) return;
    this.child = this.__renderComponent();
    this.resolvedProps = this.__bindProps();
    this.component.init(this.base, this.child, this.resolvedProps);
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
      let count = 0, len = 0;
      resetWatcherList.forEach((items) => {
        items && items.forEach((item) => {
          len ++;
          item.reset(this.data, () => {
            count ++;
            if(count === len) {
              cb();
            }
          });
        });
      })
    }
  }
  __removeRootNode() {
    const element = this.base.element;
    element.parentNode.removeChild(element);
  }
  __setChildWatcher() {
    let previous = null;
    return this.child.map((item, index) => {
      return new this.BaseWatcher(
        item,
        objectAssign({}, this.data),
        previous,
        null,
        this.modelExtractId,
        this.component.components,
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
    return props;
  }
  __renderComponent() {
    if (!this.component) return;
    const frg = document.createDocumentFragment();
    const template = document.createElement('div');
    const parent = this.base.pastDOMInformation.parentNode;
    template.innerHTML = this.component.template;
    const child = toArray(template.childNodes);
    while (template.childNodes[0]) {
      frg.appendChild(template.childNodes[0]);
    }
    parent.insertBefore(frg, this.base.pastDOMInformation.nextSibling);
    return child;
  }
  __getComponentManager() {
    const componentDataFrom = this.base.execStatement(this.instruction.value);
    let componentManager = null;
    if (typeof componentDataFrom === 'string') {
      if (ComponentWatcher.components[componentDataFrom]) {
        componentManager = ComponentWatcher.components[componentDataFrom];
      } else if (this.base.components[componentDataFrom]) {
        componentManager = this.base.components[componentDataFrom];
      }
    } else if (componentDataFrom instanceof ComponentManager) {
      componentManager = componentDataFrom;
    }
    return componentManager;
  }
  __getInstruction() {
    return this.base.__filterAttr(ComponentWatcher.instructions, true)[0];
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
    this.base.modelExtract(this.instruction.value).forEach((item) => {
      res.push(item.value);
    });
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