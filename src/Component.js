import { walkElement } from './utilityFunc';
export default class Component {
    constructor() {
        this.element = null;
        this.refs = null;
        this.template = null;
    }
    init(element, data) {
        this.element = element;
        this.__setRefs();
    }
    __setRefs() {
        const refs = {};
        walkElement(this.element, (element) => {
            const ref = element.getAttribute && element.getAttribute('ref');
            ref && (refs[ref] = element);
        });
        this.refs = refs;
    }
    didMount() {}
    didUpdate(prevData, nextData) {}
    shouldUpdate(prevData, nextData) {}
}