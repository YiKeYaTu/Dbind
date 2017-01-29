import { toArray, objectAssign, randomId } from './utilityFunc';
import { statementType } from './statementExtract';
import Component from './Component';
import { all, get } from './modelSettlement';
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
        this.component = this.__getComponent();
        this.model = this.__getModel();
        this.__remove();
    }
    render(cb = () => {}) {
        if(!this.component) return; 
        this.child = this.__renderComponent();
        this.resolvedProps = this.__bindProps();
        this.component.init(this.base, this.child, this.resolvedProps);
        this.component.willMount();
        this.data = objectAssign({}, this.component.props, this.component.data);
        this.childWatcher = this.__setChildWatcher();
        this.component.didMount();
    }
    reset(cb = () => {}, prevData, nextData) {
        if(this.__getComponent() !== this.component) {
            this.childWatcher.forEach((item) => {
                item.base.element.parent.removeChild(item.base.element);
            });
            this.render(cb);
        } else {
            const oldProps = this.resolvedProps;
            const resetWatcherList = [];
            this.resolvedProps = this.__bindProps();
            if(!this.component.shouldUpdate(oldProps, this.resolvedProps)) {
                return;
            }
            this.component.setProps(this.resolvedProps);
            this.component.willUpdate(oldProps, this.resolvedProps);
            for(let key in oldProps) {
                if(oldProps[key] !== this.component.props[key]) {
                    let cb = get(this.modelExtractId, key);
                    this.data[key] = this.component.props[key];
                    cb && resetWatcherList.push(cb);
                }
            }
            for(let key in this.component.data) {
                if(this.component.data[key] !== this.data[key]) {
                    let cb = get(this.modelExtractId, key);
                    this.data[key] = this.component.data[key]
                    cb && resetWatcherList.push(cb);
                }
            }
            resetWatcherList.forEach((items) => {
                items && items.forEach((item) => {
                    item.reset(cb = () => {}, this.data);
                });
            })
        }
    }
    __remove() {
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
                if(item.type === statementType[0] || item.type === statementType[1]) {
                    if(str === null) {
                        str = this.base.execStatement(item.value);
                    } else {
                        str += this.base.execStatement(item.value);
                    } 
                } else { 
                    if(str === null) {
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
        if(!this.component) return;
        const frg = document.createDocumentFragment();
        const template = document.createElement('div');
        const parent = this.base.pastDOMInformation.parentNode;
        template.innerHTML = this.component.template;
        const child = toArray(template.childNodes);
        while(template.childNodes[0]) {
            frg.appendChild(template.childNodes[0]);
        }
        parent.insertBefore(frg, this.base.pastDOMInformation.nextSibling);
        return child;
    }
    __getComponent() {
        const componentDataFrom = this.base.execStatement(this.instruction.value);
        let component = null;
        if(typeof componentDataFrom === 'string') {
            if(ComponentWatcher.components[componentDataFrom]) {
                component = ComponentWatcher.components[componentDataFrom];
            } else if(this.base.components[componentDataFrom]) {
                component = this.base.components[componentDataFrom];
            }
        } else if(componentDataFrom instanceof Component) {
            component = componentDataFrom;
        }
        return component;
    }
    __getInstruction() {
        return this.base.__filterAttr(ComponentWatcher.instructions, true)[0];
    }
    __getProps() {
        const props = this.base.__filterAttr(ComponentWatcher.instructions, false);
        const obProps     = [],
              normalProps = [];
        props.forEach((prop) => {
            let parsed = this.base.statementExtract(prop.value);
            let type = null, ob = false;
            let obj = {};
            obj.name = prop.name.replace(/-(.)/, (a, b) => {
                return String.fromCharCode(b.charCodeAt(0) - 32);
            });
            obj.value = parsed.map((item) => {
                if(item.type === statementType[0] || item.type === statementType[1]) {
                    ob = true;
                }
                return item;
            });
            if(ob === true) {
                obProps.push(obj);
            } else {
                normalProps.push(obj);
            }
        });
        return {obProps, normalProps};
    }
    __getModel() {
        const instructionModel = this.__getInstructionsModel(),
              propsModel       = this.__getPropsModel();
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
                if(item.type === statementType[0]) {
                    this.base.modelExtract(item.value).forEach((model) => {
                        res.push(model.value);
                    });
                }
            });
        });
        return res;
    }
}