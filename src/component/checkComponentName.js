import { is } from '../utilityFunc/utilityFunc';
export default function checkComponentName(componentName) {
  for(let i = 0, len = componentName.length; i < len ; i ++) {
    let code = componentName.charCodeAt(i);
    if(code >= 65 && code <= 90) 
      throw new SyntaxError(`Unexpected token ${componentName}, You should not use an uppercase component name`);
  }
  const dom = document.createElement(componentName);
  if(!is(dom, 'HTMLUnknownElement'))
    throw new SyntaxError(`Unexpected token ${componentName}, You should not use the tag name that already exists in HTML`);
}