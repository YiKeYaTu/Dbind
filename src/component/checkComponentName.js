export default function checkComponentName(componentName) {
  let code = componentName.charCodeAt(0);
  if(code < 65 || code > 90) {
    throw new SyntaxError('component frist name is not A-Z');
  }
}