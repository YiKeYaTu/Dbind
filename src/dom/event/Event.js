export const events = [
  'onafterprint',
  'onbeforeprint',
  'onbeforeunload',
  'onerror',
  'onhaschange',
  'onload',
  'onmessage',
  'onoffline',
  'ononline',
  'onpagehide',
  'onpageshow',
  'onpopstate',
  'onredo',
  'onresize',
  'onstorage',
  'onundo',
  'onunload',
  'onblur',
  'onchange',
  'oncontextmenu',
  'onfocus',
  'onformchange',
  'onforminput',
  'oninvalid',
  'onreset',
  'onselect',
  'onsubmit',
  'onkeydown',
  'onkeypress',
  'onkeyup',
  'onclick',
  'ondblclick',
  'ondrag',
  'ondragend',
  'ondragenter',
  'ondragleave',
  'ondragover',
  'ondragstart',
  'ondrop',
  'onmousedown',
  'onmousemove',
  'onmouseout',
  'onmouseover',
  'onmouseup',
  'onmousewheel',
  'onscroll',
  'onabort',
  'oncanplay',
  'oncanplaythrough',
  'ondurationchange',
  'onemptied',
  'onended',
  'onerror',
  'onloadeddata',
  'onloadedmetadata',
  'onloadstart',
  'onpause',
  'onplay',
  'onplaying',
  'onprogress',
  'onratechange',
  'onreadystatechange',
  'onseeked',
  'onseeking',
  'onstalled',
  'onsuspend',
  'ontimeupdate',
  'onvolumechange',
  'onwaiting'
];

export const noBubblesEvents = [
  'abort',
  'blur',
  
];

let eventPool = {};

for(let i = 0, len = events.length; i < len; i ++) {
  let eventName = events[i].slice(2);
  bindEvent(document, eventName, function(event) {
    let dom = event.target;
    let obId = getObId(dom);
    let eventHandles = eventPool[obId] && eventPool[obId][eventName];
    eventHandles && eventHandles.map(eventHandle => eventHandle(event));
  });
}

function bindEvent(dom, eventType, eventHandle) {
  if(dom.addEventListener) {
    dom.addEventListener(eventType, eventHandle);
  } else if(dom.attachEvent) {
    dom.attachEvent('on' + eventType, eventHandle);
  } else {
    dom['on' + eventType] = eventHandle;
  }
}

function getObId(dom) {
  return dom.dataset && dom.dataset.obId;;
}

export function on(dom, eventType, eventHandle) {
  let obId = getObId(dom);
  if(!eventPool[obId]) {
    eventPool[obId] = {
      [eventType]: [eventHandle]
    };
  } else {
    if(eventPool[obId][eventType]) {
      eventPool[obId][eventType].push(eventHandle);
    } else {
      eventPool[obId][eventType] = [eventHandle];
    }
  }
}