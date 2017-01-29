import { statementType } from './statementExtract';
import TextWatcherStatementToString from './TextWatcherStatementToString';
import { toArray } from './utilityFunc';

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
    render(cb = () => {}) {
        this.view = this.__parseView();
        if(this.watcherType === TextWatcher.textNodeWatcher) {
            this.base.element.textContent = this.view;
        } else {
            this.base.element.innerHTML = this.view;
        }
    }
    reset(cb = () => {}, prevData, nextData) {
        if(prevData !== nextData)
            this.render(cb);
    }
    __getViewModel() {
        let content = this.watcherType === TextWatcher.textNodeWatcher ? this.base.pastDOMInformation.textContent : this.base.pastDOMInformation.innerHTML;
        return this.__replaceOnceStatement(this.base.statementExtract(content)); 
    }
    __replaceOnceStatement(statementList) {
        return statementList.map((item) => {
            if(item.type === statementType[1]) {
                item.type = statementType[2];
                item.value = this.base.execStatement(item.value);
            }
            return item;
        })
    }
    __parseView() {
        if(this.vm.length === 1) {
            let data = this.vm[0];
            return (data.type === statementType[0] ? this.base.execStatement(data.value) : data.value);
        }
        return this.vm.reduce((prev, next) => {
            const v1 = (prev.type === statementType[0] ? this.base.execStatement(prev.value) : prev.value),
                  v2 = (next.type === statementType[0] ? this.base.execStatement(next.value) : next.value);
            return {type: statementType[2], value: this.__toString(v1) + this.__toString(v2)};
        }).value;
    }
    __toString(val) {
        return TextWatcherStatementToString(val);
    }
    __parseModel() {
        const res = [];
        this.vm.filter((item) => {
            return item.type === statementType[0];
        }).forEach((item) => {
            this.base.modelExtract(item.value).forEach((model) => {
                res.push(model.value);
            });
        });
        return res;
    }
}