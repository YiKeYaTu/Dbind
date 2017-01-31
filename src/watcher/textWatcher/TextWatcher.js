import statementToString from './statementToString';
import { NOR_STATEMENT_TYPE, ONCE_STATEMENT_TYPE, CONST_STRING } from '../../parser/statementExtract';
import { toArray } from '../../utilityFunc/utilityFunc';

export default class TextWatcher {
  static textNodeWatcher = 3;
  static innerHTMLWatcher = 1;
  constructor(base) {
    this.base = base;
    this.watcherType = this.base.pastDOMInformation.nodeType;
    this.vm = this.__getViewModel();
    this.model = this.__parseModel();
    this.view = null;
  }
  render(cb = () => { }) {
    this.view = this.__parseView();
    if (this.watcherType === TextWatcher.textNodeWatcher) {
      this.base.element.textContent = this.view;
    } else {
      this.base.element.innerHTML = this.view;
    }
  }
  reset(cb = () => { }, prevData, nextData) {
    if(prevData !== nextData) {
      this.render(cb);
    }
  }
  __getViewModel() {
    let isTextNode = this.watcherType === TextWatcher.textNodeWatcher;
    let content = isTextNode ? this.base.pastDOMInformation.textContent : this.base.pastDOMInformation.innerHTML;
    return this.__replaceOnceStatement(this.base.statementExtract(content));
  }
  __replaceOnceStatement(statementList) {
    return statementList.map((item) => {
      if (item.type === ONCE_STATEMENT_TYPE) {
        item.type = CONST_STRING;
        item.value = this.base.execStatement(item.value);
      }
      return item;
    })
  }
  __parseView() {
    let view = '';
    this.vm.forEach((item) => {
      if(item.type === NOR_STATEMENT_TYPE) {
        view += this.__toString(this.base.execStatement(item.value));
      } else {
        view += this.__toString(item.value);
      }
    })
    return view;
  }
  __toString(val) {
    return statementToString(val);
  }
  __parseModel() {
    const res = [];
    this.vm.forEach((item) => {
      if(item.type === NOR_STATEMENT_TYPE) {
        this.base.modelExtract(item.value).forEach((model) => {
          res.push(model.value);
        });
      }
    });
    return res;
  }
}