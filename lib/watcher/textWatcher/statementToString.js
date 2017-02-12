'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (val) {
    if (val instanceof HTMLElement) {
        return handleDOMValue(val);
    } else {
        return handleTextValue(val);
    }
};

function handleDOMValue(DOM) {
    var nodeName = DOM.nodeName.toLowerCase();
    var attrs = toArray(DOM.attributes).map(function (item) {
        return item.name + '=\'' + item.value + '\'';
    }).join('\s');
    return '<' + nodeName + ' ' + attrs + '>' + DOM.innerHTML + '</' + nodeName + '>';
}
function handleTextValue(text) {
    return text;
}