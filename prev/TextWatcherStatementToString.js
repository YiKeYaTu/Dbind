function handleDOMValue(DOM) {
    let nodeName = DOM.nodeName.toLowerCase();
    let attrs = toArray(DOM.attributes).map((item) => {
        return `${item.name}='${item.value}'`;
    }).join('\s');
    return `<${nodeName} ${attrs}>${DOM.innerHTML}</${nodeName}>`;
}
function handleTextValue(text) {
    return text;
}
export default function(val) {
    if(val instanceof HTMLElement) {
        return handleDOMValue(val);
    } else {
        return handleTextValue(val);
    }
}