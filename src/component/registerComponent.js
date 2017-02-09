import ComponentWatcher from '../watcher/componentWatcher/ComponentWatcher';
import checkComponentName from './checkComponentName';

export default function registerComponent(key, componentWatcher) {
  checkComponentName(key);
  ComponentWatcher.components[key] = componentWatcher;
}