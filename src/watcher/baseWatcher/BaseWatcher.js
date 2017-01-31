import { toArray, deepClone, randomId, objectAssign } from '../../utilityFunc/utilityFunc';

import ManagerWatcher from '../managerWatcher/ManagerWatcher';
import ElementWatcher from '../elementWatcher/ElementWatcher';
import ComponentWatcher from '../componentWatcher/ComponentWatcher';
import TextWatcher from '../textWatcher/TextWatcher';

import modelExtract from '../../parser/modelExtract';
import statementExtract from '../../parser/statementExtract';

import { set, get } from '../../model/modelSettlement';

import { delay } from '../../utilityFunc/utilityFunc';

export default class BaseWatcher {
  static ManagerWatcher = 1;
  static ElementWatcher = 2;
  static TextWatcher = 3;
  static ComponentWatcher = 4;
  
  constructor(element, obdata, previous = null, forceWatcherType = null, modelExtractId = null, components = null, parentWatcher = null, obId = 0) {
    this.obId = obId;
    this.element = element;
    this.components = components;
    this.parentWatcher = parentWatcher;
    this.obdata = obdata;
    this.previous = previous;
    this.rendering = false;
    this.modelExtractId = modelExtractId;
    this.pastDOMInformation = this.__getPastDOMInformation();
    this.obtype = this.__getType(forceWatcherType);
    this.obwatcher = this.__getWatcher();
    this.__hangonModel(this.modelExtractId);

    this.render();
  }
  render(cb = () => { }) {
    this.obwatcher.render(cb);
  }
  reset(cb = () => { }) {
    if (this.rendering === true) {
      return;
    }
    const prevData = objectAssign({}, this.obdata);
    const nextData = objectAssign({}, this.obdata);
    this.rendering = true;
    if (arguments.length === 3) {
      const key = arguments[1],
        val = arguments[2];
      nextData[key] = val;
    } else {
      if (typeof arguments[1] !== 'object') {
        throw '';
      } else {
        const dataObj = arguments[1];
        for (let key in dataObj) {
          nextData[key] = dataObj[key];
        }
      }
    }
    this.obdata = nextData;
    delay((time) => {
      this.obwatcher.reset(cb, prevData, nextData);
      cb(time);
      this.rendering = false;
    });
  }
  trackingUpdate(cb = () => { }) {
    const resetWatcherList = [];
    const target = arguments[1];
    if (typeof target === 'object') {
      for (let key in target) {
        resetWatcherList.push(get(this.modelExtractId, key));
      }
    } else {
      resetWatcherList.push(get(this.modelExtractId, target));
    }
    resetWatcherList.forEach((items) => {
      items && items.forEach(item => item.reset(...arguments));
    })
  }
  __getWatcher() {
    let watcherClass = null;
    switch (this.obtype) {
      case BaseWatcher.ManagerWatcher:
        watcherClass = ManagerWatcher;
        break;
      case BaseWatcher.ElementWatcher:
        watcherClass = ElementWatcher;
        break;
      case BaseWatcher.TextWatcher:
        watcherClass = TextWatcher;
        break;
      case BaseWatcher.ComponentWatcher:
        watcherClass = ComponentWatcher;
        break;
    }
    return new watcherClass(this, BaseWatcher);
  }
  __getType(forceWatcherType) {
    if (forceWatcherType !== null) {
      return forceWatcherType;
    }
    const NODE_TYPE = this.element.nodeType,
          NODE_NAME = this.element.nodeName.toLowerCase();
    if (NODE_TYPE === 3) {
      return BaseWatcher.TextWatcher;
    } else if (NODE_TYPE === 1) {
      const attr = this.pastDOMInformation.attr;
      let isManagerWatcher = false;
      for(let i = 0, len = attr.length; i < len; i ++) {
        if(attr[i].name === ManagerWatcher.instructions[0]) {
          isManagerWatcher = true; 
          break;
        }
      }
      if (isManagerWatcher) {
        return BaseWatcher.ManagerWatcher;
      } else if (ComponentWatcher.nodeNames.indexOf(NODE_NAME) > -1) {
        return BaseWatcher.ComponentWatcher;
      } else if (ComponentWatcher.components[NODE_NAME]) {
        return BaseWatcher.ComponentWatcher;
      } else {
        return BaseWatcher.ElementWatcher;
      }
    } else {
      throw 'watcher只能接受元素节点或者文本节点';
    }
  }
  __getPastDOMInformation() {
    return {
      parentNode: this.element.parentNode,
      nextSibling: this.element.nextSibling,
      textContent: this.element.textContent,
      innerHTML: this.element.innerHTML,
      nodeType: this.element.nodeType,
      nodeName: this.element.nodeName,
      attr: this.__getAttr(),
      display: this.__getDisplay()
    };
  }
  __getDisplay() {
    return this.element.nodeType !== BaseWatcher.TextWatcher && getComputedStyle(this.element).display;
  }
  __getAttr() {
    return this.element.attributes ? toArray(this.element.attributes) : [];
  }
  __getWatcherType(watcher) {
    return watcher.type;
  }
  __filterAttr(keeplist = [], type = true) {
    return this.pastDOMInformation.attr.filter((item) => {
      return type ? keeplist.indexOf(item.name) > -1 : keeplist.indexOf(item.name) === -1;
    });
  }
  __hangonModel() {
    const model = this.obwatcher.model;
    if (model) {
      model.forEach((item) => {
        set(this.modelExtractId, item, this);
      });
    }
  }
  getChildId(i) {
    return `${this.obId}.${i}`;
  }
  removeAttr(name) {
    this.element.removeAttribute(name);
  }
  modelExtract(str) {
    return modelExtract(str);
  }
  traversalPrevious(cb) {
    let previousWatcher = this.previous;
    while (previousWatcher) {
      if (cb(previousWatcher) === false) break;
      previousWatcher = previousWatcher.previous;
    }
  }
  statementExtract(str) {
    return statementExtract(str);
  }
  execStatement(statement) {
    return (new Function('data', `with(data) { return ${statement};}`)).call(this.obdata, this.obdata);
  }
}