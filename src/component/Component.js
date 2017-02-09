import { walkElement, objectAssign } from '../utilityFunc/utilityFunc';

export const ComponentLifecycle = ['didMount', 'willMount', 'willUpdate', 'shouldUpdate'];

export default class Component {

  constructor() {
    this.watcher = null;
    this.element = null;
    this.refs = null;
    this.template = null;
    this.props = null;
    this.data = null;
  }
  init(watcher, props) {
    this.watcher = watcher;
    this.props = props;
    this.__setRefs();
  }
  setDOMElement(element) {
    this.element = element;
  }
  trackingUpdate(data, cb = () => { }) {
    const prevData = objectAssign({}, this.data);
    for (let key in data) {
      this.data[key] = data[key];
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
  didMount() { }
  willMount() { }
  willUpdate() { }
  shouldUpdate() {
    return true;
  }
}