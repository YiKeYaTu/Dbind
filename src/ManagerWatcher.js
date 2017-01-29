import { is, objectAssign } from './utilityFunc';
import { all } from './modelSettlement';
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
    render(cb = () => {}) {
        this.childWacther = this.__setChildWatcher();
        this.__appendChildWatcherToDOM();
    }
    reset(cb = () => {}, prevData, nextData) {
        if(prevData[this.vector].length !== nextData[this.vector].length) {
            this.childWacther.forEach((item) => {
                const node = item.element;
                node.parentNode.removeChild(node);
            });
            this.render();
        }
    }
    __appendChildWatcherToDOM() {
        const frg = document.createDocumentFragment(),
              next = this.base.pastDOMInformation.nextSibling;
        this.childWacther.forEach((item) => {
            frg.appendChild(item[0]);
        });
        if(next) {
            next.parentNode.insertBefore(frg, next);
        } else {
            this.base.pastDOMInformation.parentNode.appendChild(frg);
        }
        this.childWacther = this.childWacther.map((item) => {
            return new this.BaseWatcher(...item);
        });
    }
    __check() {
        const res = /[a-zA-Z_$][a-zA-Z_$0-9]*(\s*,\s*[a-zA-Z_$][a-zA-Z_$0-9]*){0,2}\s*in\s*/.test(this.instruction.value);
        if(!res) {
            throw '';        
        }
    }
    __setChildWatcher() {
        const vector = (new Function('data', `with(data) { return ${this.vector} }`)(this.base.obdata));
        if(is(vector, 'array')) {
            return vector.map((item, index) => {
                let obdata = objectAssign({}, this.base.obdata);
                obdata[this.parameter[0]] = index;
                this.parameter[1] && (obdata[this.parameter[1]] = index);
                return [
                    this.__cloneElement(this.base.element.innerHTML),
                    obdata,
                    this.base.previous,
                    null, 
                    this.base.modelExtractId,
                    this.base.components,
                    this.base,
                    this.base.obId + `.${index}`,
                ];
            });
        } else if(is(vector, 'object')) {
            const child = [];
            let i = 0;
            for(let key in vector) {
                let obdata = objectAssign({}, this.base.obdata);
                obdata[this.parameter[0]] = key;
                this.parameter[1] && (obdata[this.parameter[1]] = i);
                child.push([
                    this.__cloneElement(this.base.element.innerHTML),
                    obdata,
                    this.base.previous,
                    null,
                    this.base.modelExtractId,
                    this.base.components,
                    this.base,
                    this.base.getChildId(i)
                ]);
                i ++;
            }
            return child;
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
            if(item.value === ManagerWatcher.eachSplitInstructionChar) { 
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
            if(item.value === ManagerWatcher.eachSplitInstructionChar) flag = true;
            !flag && res.push(item.value);
        });
        return res;
    }
    __getInstruction() {
        return this.base.__filterAttr(ManagerWatcher.instructions, true)[0];
    }
    __execInstructions() {
        
    }
}