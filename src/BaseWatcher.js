import { toArray, deepClone, randomId, objectAssign } from './utilityFunc';

import ManagerWatcher from './ManagerWatcher';
import ElementWatcher from './ElementWatcher';
import ComponentWatcher from './ComponentWatcher';
import TextWatcher from './TextWatcher';
import TemplateWatcher from './TemplateWatcher';

import modelExtract from './modelExtract';
import statementExtract from './statementExtract';

import { set } from './modelSettlement';

import { delay } from './utilityFunc';
/**
 * 
 * 
 * @export
 * @class BaseWatcher
 */
export default class BaseWatcher {
    static ManagerWatcher   = 1;
    static ElementWatcher   = 2;
    static TextWatcher      = 3;
    static ComponentWatcher = 4;
    static TemplateWatcher  = 5;
    /**
     * Creates an instance of BaseWatcher.
     * 
     * @param {DOM} element
     * @param {object} obdata
     * @param {watcher} [previous=null]
     * 
     * @memberOf BaseWatcher
     */
    constructor(element, obdata, previous = null, forceWatcherType = null, modelExtractId = null, components = null, parentWatcher = null) {
        this.element = element;
        this.components = components;
        this.parentWatcher = parentWatcher;
        this.obdata = obdata;
        this.previous = previous;
        this.rendering = false;
        this.pastDOMInformation = this.__getPastDOMInformation();
        this.modelExtractId = this.__getModelExtractId(modelExtractId);
        this.obtype = this.__getType(forceWatcherType);
        this.obwatcher = this.__getWatcher();
        this.__hangonModel(this.modelExtractId);

        this.render();
    }
    render(cb = () => {}, func = 'render') {
        this.obwatcher.render();
    }
    reset(cb = () => {}, prevData, nextData) {
        if(this.rendering !== true) {
            this.__setRendering(true);
            delay((time) => {
                this.obwatcher.reset(cb, prevData, nextData);
                cb(time);
                this.__setRendering(false);
            });
        }
    }
    setObData(cb = () => {}) {
        const prevData = objectAssign({}, this.obdata);
        const nextData = objectAssign({}, this.obdata);
        if(arguments.length === 3) {
            const key = arguments[1],
                  val = arguments[2];
            nextData[key] = val;
        } else {
            if(typeof arguments[1] !== 'object') {
                throw '';
            } else {
                const dataObj = arguments[1];
                for(let key in dataObj) {
                    nextData[key] = dataObj[key];
                }
            }
        }
        this.obdata = nextData;
        this.reset(cb, prevData, nextData);
    }
    __getModelExtractId(modelExtractId) {
        if(this.obtype === BaseWatcher.ComponentWatcher) {
            return randomId();
        } else {
            return modelExtractId;
        }
    }
    __setRendering(rendering) {
        this.rendering = rendering;
    }
    __getWatcher() {
        let watcherClass = null;
        switch(this.obtype) {
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
            case BaseWatcher.TemplateWatcher:
                watcherClass = TemplateWatcher;
                break;
        }
        return new watcherClass(this, BaseWatcher);
    }
    /**
     * 
     * 
     * @returns
     * 
     * @watcher的type
     */
    __getType(forceWatcherType) {
        if(forceWatcherType !== null) {
            return forceWatcherType;
        }
        const nodeType = this.element.nodeType,
              nodeName = this.element.nodeName.toLowerCase();
        if(nodeType === 3) {
            return BaseWatcher.TextWatcher;
        } else if(nodeType === 1) {
            const attrName = this.pastDOMInformation.attr.map(item => item.name);
            if(attrName.indexOf(ManagerWatcher.instructions[0]) > -1) {
                return BaseWatcher.ManagerWatcher;
            } else if(ComponentWatcher.nodeNames.indexOf(nodeName) > -1) {
                if(nodeName === ComponentWatcher.nodeNames[0] && attrName.indexOf(ComponentWatcher.instructions[0]) === -1) {
                    return BaseWatcher.TemplateWatcher;
                } else {
                    return BaseWatcher.ComponentWatcher;
                }
            } else if(ComponentWatcher.components[nodeName]) {
                return BaseWatcher.ComponentWatcher;
            }
            else {
                return BaseWatcher.ElementWatcher;
            }
        } else {
            throw 'watcher只能接受元素节点或者文本节点';
        }
    }
    
    /**
     * 
     * 
     * @returns
     * 
     * @该Watcher被实例化之前的DOM信息
     */
    __getPastDOMInformation() {
        return {
            parentNode: this.element.parentNode,
            nextSibling: this.element.nextSibling,
            textContent: this.element.textContent,
            innerHTML: this.element.innerHTML,
            nodeType: this.element.nodeType,
            nodeName: this.element.nodeName,
            attr: this.__getAttr(),
            display: this.element.nodeType !== BaseWatcher.TextWatcher && getComputedStyle(this.element).display,
        };
    }
    /**
     * 
     * 
     * @returns
     * 
     * @数组化的attributes
     */
    __getAttr() {
        return this.element.attributes ? toArray(this.element.attributes) : [];
    }
    /**
     * 
     * 
     * @param {any} watcher
     * @returns
     * 
     * @watcher的类型
     */
    __getWatcherType(watcher) {
        return watcher.type;
    }
    /**
     * 
     * 
     * @param {any} [keeplist=[]]
     * @param {boolean} [type=true]
     * @returns
     * 
     * @memberOf BaseWatcher
     */
    __filterAttr(keeplist = [], type = true) {
        return this.pastDOMInformation.attr.filter((item) => {
            return type ? keeplist.indexOf(item.name) > -1 : keeplist.indexOf(item.name) === -1;
        });
    }
    __hangonModel() {
        const model = this.obwatcher.model;
        if(model) {
            model.forEach((item) => {
                set(this.modelExtractId, item, this);
            });
        }
    }
    removeAttr(name) {
        this.element.removeAttribute(name);
    }
    /**
     * 
     * 
     * @param {any} val
     * 
     * @memberOf BaseWatcher
     */
    set(name, val) {
        this.element[name] = val;
    } 
    /**
     * 
     * 
     * @param {string} str
     * @returns
     * 
     * @memberOf BaseWatcher
     */
    modelExtract(str) {
        return modelExtract(str);
    }
    /**
     * 
     * 
     * @param {function} cb
     * 
     * @memberOf BaseWatcher
     */
    traversalPrevious(cb) {
        let previousWatcher = this.previous;
        while(previousWatcher) {
            if(cb(previousWatcher) === false) break;
            previousWatcher = previousWatcher.previous;
        }
    }
    /**
     * 
     * 
     * @param {string} str
     * @returns
     * 
     * @memberOf BaseWatcher
     */
    statementExtract (str) {
        return statementExtract(str);
    }
    execStatement(statement) {
        return (new Function('data', `with(data) { return ${statement};}`)).call(this.obdata, this.obdata);
    }
}