import { walkElement, objectAssign } from '../utilityFunc/utilityFunc';
import { all, get, deleteAll } from '../model/modelSettlement';

export const ComponentLifecycle = ['didMount', 'willMount', 'willUpdate', 'shouldUpdate'];

export default class Component {

  constructor() {
    this.watcher = null;
    this.element = null;
    this.refs = null;
    this.template = null;
    this.props = null;
    this.data = null;
    this.propTypes = null;
  }
  init(watcher, props) {
    this.watcher = watcher;
    this.props = props;
  }
  setDOMElement(element) {
    this.element = element;
    this.__setRefs();
  }
  trackingUpdate(data, cb = () => { }) {
    this.watcher.trackingUpdate(data, cb, this.watcher.obwatcher.modelExtractId);
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