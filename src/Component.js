import { walkElement, objectAssign } from './utilityFunc';
export default class Component {
    constructor() {
        this.watcher = null;
        this.element = null;
        this.refs = null;
        this.template = null;
        this.props = null;
    }
    init(watcher, element, props) {
        this.watcher = watcher;
        this.element = element;
        this.props = props;
        this.__setRefs();
    }
    trackingUpdate(cb = () => {}) {
        const prevData = objectAssign({}, this.data);
        if(arguments.length === 3) {
            const key = arguments[1],
                  val = arguments[2];
            this.data[key] = val;
        } else {
            if(typeof arguments[1] !== 'object') {
                throw '';
            } else {
                const dataObj = arguments[1];
                for(let key in dataObj) {
                    this.data[key] = dataObj[key];
                }
            }
        }
        this.watcher.obwatcher.reset(cb, prevData, this.data);
    }
    setProps(props) {
        this.props = props;
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