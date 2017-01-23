import objectAssign from 'object-assign';
import { Tokenizer, VmParser } from './parse';

class Watcher {
    static orderList = ['data-each', 'data-if', 'data-else', 'data-else-if'];
    static componentWatcherNodeName = 'component';

    static getWatcher(DOM) {
        const type = DOM.nodeType;
        let watcherType;
        if(type === 3) {
            watcherType = TextWatcherType;
        } else if(type === 1) {
            if(DOM.attributes[Watcher.orderList[0]]) {
                watcherType = ManagerWatcherType;
            } else {
                if(DOM.nodeName.toLowerCase() === Watcher.componentWatcherNodeName) {
                    if(DOM.getAttribute('componentName')) {
                        watcherType = ComponentWathcherType;
                    } else {
                        watcherType = TemplateWatcherType;
                    }
                } else {
                    watcherType = ElementWatcherType;
                }
            }
        }
        return watcherHashtable[watcherType];
    }
    static getVaribale(str) {
        return Tokenizer.parse(str)
            .filter(item => (item.type === Tokenizer.type[0] || item.type === Tokenizer.type[4]));
    }
    constructor(DOM, bindData, prevWatcher) {
        this.DOM = DOM;
        this.parentWatcher;
        this.prevWatcher = prevWatcher;
        this.parentNode = this.DOM.parentNode;
        this.nextSibling = this.DOM.nextSibling;
        this.previousSibling = this.DOM.previousSibling;
        this.bindData = bindData;
        this.order = this.__getOrder();
    }
    reRender() {}
    __render() {}
    __getModel() {}
    __hasOrder(orderType) {
        return this.order[Watcher.orderList[orderType]] !== undefined;
    }
    __getOrder() {
        const attributes = this.DOM.attributes;
        if(!attributes) {
            return null;
        } else {
            const order = {};
            [].slice.call(attributes).filter((item) => {
                return Watcher.orderList.indexOf(item.name) > -1;
            }).map((item) => {
                order[item.name] = item.value;
            });
            return order;
        }
    }
    __createChildWatcher() {
        return toArray(this.DOM.childNodes).map((item) => {
            return new Watcher(item);
        });
    }
}
class ElementWatcher extends Watcher {
    static ElementWatcherType = 2;

    constructor() {
        super(...arguments);
        this.__initialize();
    }
    reRender() {
        const resolvedOrder = this.__parseOrder();
        this.show = resolvedOrder.show;
        if(!this.childWatcherList)
            this.childWatcherList = this.__createChildWatcher();
        this.__render();
    }
    __render() {
        setTimeout(() => {
            if(this.show) {
                this.DOM.style.display = this.initStyle.display;
            } else if(this.show === false) {
                this.DOM.style.display = 'none';
            }
        });
    }
    __initialize() {
        const resolvedOrder = this.__parseOrder();
        this.initStyle = getComputedStyle(this.DOM);
        this.model = resolvedOrder.model;
        console.log(this.model);
        this.show = resolvedOrder.show;
        this.childWatcherList = this.__createChildWatcher();
        this.__render();
    }
    __parseOrder() {
        const condition = this.__parsecConditionOrder();
        let show = null;
        if(condition) {
            try {
                show = condition.execute(this.bindData);
            } catch(e) {
                throw e;
            }
        }
        return {
            model: condition && condition.model,
            show: show
        }
    }
    __parsecConditionOrder() {
        let conditionOrderList = [
            this.order[Watcher.orderList[1]],
            this.order[Watcher.orderList[2]],
            this.order[Watcher.orderList[3]]
        ].filter(item => item !== undefined);
        const conditionOrder = conditionOrderList[0];
        if(conditionOrderList.length > 1) 
            throw '不能同时含有data-if，data-else，data-else-if指令';
        if(conditionOrderList.length === 0)
            return null;
        if(this.__hasOrder(1)) {
            return this.__parseIfOrder(conditionOrder);
        } else if(this.__hasOrder(2)) {
            return this.__parseElseOrder();
        } else if(this.__hasOrder(3)) {
            return this.__parseElseIfOrder(conditionOrder);
        }
    }
    __parseIfOrder(conditionOrder) {
        const fnText = `with(data) {
            return (${conditionOrder});
        }`;
        const model = Watcher.getVaribale(conditionOrder);
        const execute = new Function('data', fnText);
        return {
            model: {
               [Watcher.orderList[1]] :model
            },
            execute
        }
    }
    __parseElseOrder() {
        let hasIf = false;
        let show = true;
        this.__walkPrevElementConditionWatcher((watcher) => {
            if(watcher.__hasOrder(1)) hasIf = true;
            if(watcher.show) show = false;
        });
        if(!hasIf) throw 'else指令之前的watcher必须要有if或者else-if指令';
        return {
            model: null,
            execute: () => show
        }
    }
    __parseElseIfOrder(conditionOrder) {
        const resolvedElseOrder = this.__parseElseOrder(),
              resolvedIfOrder = this.__parseIfOrder(conditionOrder);
        if(!resolvedElseOrder.execute())
            resolvedIfOrder.execute = resolvedElseOrder.execute;
        return resolvedIfOrder;
    }
    __walkPrevElementConditionWatcher(cb) {
        let watcher = this.prevWatcher;
        while(watcher) {
            if(!(watcher instanceof TextWatcher)) {
                if(watcher instanceof ManagerWatcher || watcher.show === null || watcher.__hasOrder(2)) break;
                cb(watcher);
                if(watcher.__hasOrder(1)) break;
            }
            watcher = watcher.prevWatcher;
        }
    }
    __createChildWatcher() {
        if(this.show === false)
            return null;
        let prevWatcher = null;
        return [].slice.call(this.DOM.childNodes)
            .filter(item => item.nodeType !== 8)
            .map((item, index) => {
                const watcherClass = Watcher.getWatcher(item);
                const childWatcher = new watcherClass(
                    item, 
                    this.bindData,
                    prevWatcher
                );
                prevWatcher = childWatcher;
                return childWatcher;
            });
    }
}

class ManagerWatcher extends Watcher {
    static ManagerWatcherType = 1;

    constructor() {
        super(...arguments);
        this.__removeRealDom();
        this.__initialize();
    }

    reRender() {
        this.managerWatcherList.forEach((item) => {
            item.DOM.parentNode.removeChild(item.DOM);
        });
        this.managerWatcherList = this.__createManagerWatcherList();
        this.__render();
    }

    __getModel(resolvedOrder) {
        const modelArr = [];
        const extendsDataToManagerListModelArr = [];
        let flag = false;
        for(let i = 0, len = resolvedOrder.length; i < len; i ++) {
            if(resolvedOrder[i].type === Tokenizer.type[3]) {
                flag = true;
                continue;
            }
            flag && modelArr.push(resolvedOrder[i]);
            !flag && extendsDataToManagerListModelArr.push(resolvedOrder[i].value);
        }
        return {
            model: {
                [Watcher.orderList[0]]: modelArr
            }, 
            extendsDataToManagerListModel: extendsDataToManagerListModelArr
        };
    }

    __render() {
        setTimeout(() => {
            const tmplate = document.createDocumentFragment();
            this.managerWatcherList = this.managerWatcherList.map((item) => {
                const watcherClass = Watcher.getWatcher(item[0]);
                tmplate.appendChild(item[0]);
                return new watcherClass(item[0], item[1], item[2]);
            });
            this.__insertFragment(tmplate);
        });
    }

    __initialize() {
        const resolvedOrder = this.__parseOrder();
        const resolvedModel = this.__getModel(resolvedOrder);
        this.model = resolvedModel.model;
        this.extendsDataToManagerList = resolvedModel.extendsDataToManagerListModel;
        this.managerWatcherList = this.__createManagerWatcherList();
        this.__render();
    }

    __removeRealDom() {
        this.DOM.parentNode.removeChild(this.DOM);
    }

    __parseOrder() {
        const eachOrder = this.order[Watcher.orderList[0]];
        const resolvedOrder = Tokenizer.parse(eachOrder);
        return resolvedOrder;
    }

    __createManagerWatcherList() {
        const generatorModel = this.bindData[
            this.model[
                [Watcher.orderList[0]]
            ][0].value
        ];
        const list = [];
        this.__ergodic(generatorModel, (val, key, index) => {
            const newData = {};
            const cloneDOM = this.__cloneDOMWithoutEach();
            newData[this.extendsDataToManagerList[0]] = val;
            this.extendsDataToManagerList[1] && (newData[this.extendsDataToManagerList[1]] = key);
            this.extendsDataToManagerList[2] && (newData[this.extendsDataToManagerList[2]] = key);
            const data = objectAssign({}, newData, this.bindData);
            list.push([cloneDOM, data, this.prevWatche]);
        });
        return list;
    }

    __ergodic(data, cb) {
        if(data.length) {
            data.forEach((item, index) => {
                cb(item, index, index);
            })
        } else if(typeof data === 'object') {
            let cont = 0;
            for(let key in data) {
                count ++;
                cb(key, data[key], count);
            }
        }
    }

    __cloneDOMWithoutEach() {
        const cloneDOM = this.DOM.cloneNode();
        cloneDOM.removeAttribute(Watcher.orderList[0]);
        cloneDOM.innerHTML = this.DOM.innerHTML;
        return cloneDOM;
    }

    __insertFragment(f) {
        this.parentNode.insertBefore(f, this.nextSibling);
    }
}

class TextWatcher extends Watcher {
    constructor() {
        super(...arguments);
        this.__initialize();
    }
    reRender() {

    }
    __render() {
        // if(this.DOM.par)
    }
    __initialize() {
        this.vm = this.DOM.textContent;
        const resolvedVm = this.__parseVm();
        const resolvedModel = this.__getModel(resolvedVm);
        // console.log(this.vm);
    }
    __parseVm() {
        let resolvedVm = VmParser.parse(this.vm);
        resolvedVm = resolvedVm.map((item) => {
            if(item.type !== VmParser.constString) {
                 item.value = (new Function('data', `with(data) { return ${item.value}; }`))(this.bindData);
            }
            return item;
        });
        console.log(resolvedVm);
    }
}

class TemplateWatcher extends Watcher {

}

class ComponentWathcher extends Watcher {

}

const ManagerWatcherType = 1,    // 附带有each指令的watcher，            负责管理多个watcher
      ElementWatcherType = 2,    // 不附带each指令的watcher，            负责管理单个DOM
      ComponentWathcherType = 3, // 组件watcher，有一个componentName属性，负责管理一个组件
      TemplateWatcherType = 4,   // 
      TextWatcherType = 5;       // 文本watcher，                       负责管理一段文本

const watcherHashtable = {
    [ManagerWatcherType]: ManagerWatcher,
    [ElementWatcherType]: ElementWatcher,
    [ComponentWathcherType]: ComponentWathcher,
    [TemplateWatcherType]: TemplateWatcher,
    [TextWatcherType]: TextWatcher,
}

var a = new ElementWatcher(document.body, {
    name: 'lc',
    arr: [1, 3 ,5],
    b: 2,
    div: 'hsahsafha<div>1221</div>'
});
global.a = a;