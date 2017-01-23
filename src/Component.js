import { randomId, walkElement } from './utilityFunc';
export default class Component {
    constructor(props = null) {
        this.element = null;
        this.props = props;
        this.data = null;
        this.refs = null;
        this.template = null;
        this.modelId = randomId();
    }
    init(element, props) {
        this.element = element;
        this.props = props;
    }
    getRefs() {
        const refs = {};
        walkElement(this.element, (element) => {
            const ref = element.getAttribute('ref');
            ref && (refs[ref.name] = element);
        });
    }
    setProps(props) {
        this.props = props;
    }
    didMount() {}
    propsUpdate(prevProps, nextProps) {}
    shouldUpdate(prevProps, nextProps) {}
}