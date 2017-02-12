'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = on;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var events = exports.events = ['onafterprint', 'onbeforeprint', 'onbeforeunload', 'onerror', 'onhaschange', 'onload', 'onmessage', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onredo', 'onresize', 'onstorage', 'onundo', 'onunload', 'onblur', 'onchange', 'oncontextmenu', 'onfocus', 'onformchange', 'onforminput', 'oninvalid', 'onreset', 'onselect', 'onsubmit', 'onkeydown', 'onkeypress', 'onkeyup', 'onclick', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'onmousedown', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onscroll', 'onabort', 'oncanplay', 'oncanplaythrough', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreadystatechange', 'onseeked', 'onseeking', 'onstalled', 'onsuspend', 'ontimeupdate', 'onvolumechange', 'onwaiting'];

var noBubblesEvents = exports.noBubblesEvents = ['abort', 'blur'];

var eventPool = {};

var _loop = function _loop(i, len) {
  var eventName = events[i].slice(2);
  bindEvent(document, eventName, function (event) {
    var dom = event.target;
    var obId = getObId(dom);
    var eventHandles = eventPool[obId] && eventPool[obId][eventName];
    eventHandles && eventHandles.map(function (eventHandle) {
      return eventHandle(event);
    });
  });
};

for (var i = 0, len = events.length; i < len; i++) {
  _loop(i, len);
}

function bindEvent(dom, eventType, eventHandle) {
  if (dom.addEventListener) {
    dom.addEventListener(eventType, eventHandle);
  } else if (dom.attachEvent) {
    dom.attachEvent('on' + eventType, eventHandle);
  } else {
    dom['on' + eventType] = eventHandle;
  }
}

function getObId(dom) {
  return dom.dataset && dom.dataset.obId;;
}

function on(dom, eventType, eventHandle) {
  var obId = getObId(dom);
  if (!eventPool[obId]) {
    eventPool[obId] = _defineProperty({}, eventType, [eventHandle]);
  } else {
    if (eventPool[obId][eventType]) {
      eventPool[obId][eventType].push(eventHandle);
    } else {
      eventPool[obId][eventType] = [eventHandle];
    }
  }
}