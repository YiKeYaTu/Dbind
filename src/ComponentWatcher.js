import { toArray, randomId, objectAssign } from './utilityFunc';
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
        this.moudleId = randomId();
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
        this.data = objectAssign({}, this.component.data, this.resolvedProps);
        this.childWatcher = this.__setChildWatcher();
    }
    reset(cb = () => {}) {
        if(this.__getComponent() !== this.component) {
            this.childWatcher.forEach((item) => {
                item.base.element.parent.removeChild(item.base.element);
            });
            this.render(cb);
        } else {
            const oldProps = this.resolvedProps;
            const cbs = [];
            this.resolvedProps = this.__bindProps();
            for(let key in oldProps) {
                if(oldProps[key] !== this.resolvedProps[key]) {
                    this.data[key] = this.resolvedProps[key]
                    cbs.push(get(this.moudleId, key));
                }
            }
            cbs.forEach((fns) => {
                fns.forEach((fn) => {
                    fn();
                })
            })
        }
    }
    __remove() {
        const element = this.base.element;
        element.parentNode.removeChild(element);
    }
    __setChildWatcher() {
        let previous = null;
        return this.child.map((item) => {
            return new this.BaseWatcher(
                item,
                this.data,
                previous,
                null,
                this.moudleId,
                this.component.components
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
            let str = '';
            prop.value.forEach((item) => {
                if(item.type === statementType[0] || item.type === statementType[1])
                    str += this.base.execStatement(item.value);
                else 
                    str += item.value;
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
            obj.name = prop.name;
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
            this.instructionsModel[instruction.name] = item.value;
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