import { is, objectAssign } from '../../utilityFunc/utilityFunc';
import { all } from '../../model/modelSettlement';
import traversalVector from './traversalVector';

export default class ManagerWatcher {
  static instructions = ['data-each'];
  static eachSplitInstructionChar = 'in';

  constructor(base, BaseWatcher) {
    this.base = base;
    this.BaseWatcher = BaseWatcher;
    this.instruction = this.__getInstruction();
    this.vector = null;
    this.model = this.__getModel();
    this.parameter = this.__getParameter();
    this.childWacther = null;
    this.__check();
    this.__removeRootElement();
  }
  render(childIndex = 0) {
    this.__setChildWatcher(childIndex);
    this.__appendChildWatcherToDOM(childIndex);
  }
  reset(cb = () => { }, prevData, nextData) {
    let prevLen = prevData[this.vector].length;
    let nextLen = nextData[this.vector].length;
    if (prevLen < nextLen) {
      this.render(prevLen);
    } else if (prevLen > nextLen) {
      for(let i = nextLen; i < prevLen; i ++) {
        let node = this.childWacther[i].element;
        node.parentNode.removeChild(node);
      }
    }
  }
  __appendChildWatcherToDOM(childIndex) {
    const frg = document.createDocumentFragment(),
      next = this.base.pastDOMInformation.nextSibling;
    for (let i = childIndex, len = this.childWacther.length; i < len; i++) {
      frg.appendChild(this.childWacther[i][0]);
    }
    if (next) {
      next.parentNode.insertBefore(frg, next);
    } else {
      this.base.pastDOMInformation.parentNode.appendChild(frg);
    }
    for (let i = childIndex, len = this.childWacther.length; i < len; i++) {
      this.childWacther[i] = new this.BaseWatcher(...this.childWacther[i]);
    }
  }
  __check() {
    const res = /[a-zA-Z_$][a-zA-Z_$0-9]*(\s*,\s*[a-zA-Z_$][a-zA-Z_$0-9]*){0,2}\s*in\s*/.test(this.instruction.value);
    if (!res) {
      throw '';
    }
  }
  __setChildWatcher(childIndex) {
    const vector = (new Function('data', `with(data) { return ${this.vector} }`)(this.base.obdata)).slice(childIndex);
    const child = [];
    traversalVector(vector, (key, count) => {
      if(is(vector, 'array')) {
        key += childIndex;
      }
      count += childIndex;
      let obdata = objectAssign({}, this.base.obdata);
      obdata[this.parameter[0]] = key;
      this.parameter[1] && (obdata[this.parameter[1]] = count);
      child.push([
        this.__cloneElement(this.base.element.innerHTML),
        obdata,
        this.base.previous,
        null,
        this.base.modelExtractId,
        this.base.components,
        this.base,
        this.base.getChildId(count),
      ]);
    });
    if (childIndex > 0) {
      for (let i = 0, len = child.length; i < len; i ++) {
        this.childWacther.push(child[i]);
      }
    } else {
      this.childWacther = child;
    }
  }
  __removeRootElement() {
    const element = this.base.element;
    element.parentNode.removeChild(element);
  }
  __cloneElement(innerHTML = '') {
    const cloneNode = this.base.element.cloneNode();
    cloneNode.innerHTML = innerHTML;
    cloneNode.removeAttribute(ManagerWatcher.instructions[0]);
    return cloneNode;
  }
  __getModel() {
    let res = [];
    let flag = false;
    this.base.modelExtract(this.instruction.value).forEach((item) => {
      flag && res.push(item.value);
      if (item.value === ManagerWatcher.eachSplitInstructionChar) {
        flag = true;
        this.vector = this.instruction.value.slice(item.index + ManagerWatcher.eachSplitInstructionChar.length).replace(/\s/g, '');
      };
    });
    return res.length > 0 ? res : null;
  }
  __getParameter() {
    let res = [];
    let flag = false;
    this.base.modelExtract(this.instruction.value).forEach((item) => {
      if (item.value === ManagerWatcher.eachSplitInstructionChar) flag = true;
      !flag && res.push(item.value);
    });
    return res;
  }
  __getInstruction() {
    return this.base.__filterAttr(ManagerWatcher.instructions, true)[0];
  }
}