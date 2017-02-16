'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toArray = toArray;
exports.delay = delay;
exports.clearDelay = clearDelay;
exports.is = is;
exports.deepClone = deepClone;
exports.randomId = randomId;
exports.objectAssign = objectAssign;
exports.walkElement = walkElement;
exports.toHump = toHump;
exports.toHumpBack = toHumpBack;
exports.getTagText = getTagText;
function toArray(arrayLike) {
  return [].slice.call(arrayLike);
}
function delay(fn) {
  var t = Date.now();
  return setTimeout(function () {
    fn(Date.now() - t);
  });
}
function clearDelay(delay) {
  clearTimeout(delay);
}
function is(target, type) {
  return Object.prototype.toString.call(target).toLowerCase() === '[object ' + type.toLowerCase() + ']';
}
function deepClone(t) {
  if (is(t, 'array')) {
    return t.map(function (item) {
      return deepClone(item);
    });
  } else if (is(t, 'object')) {
    var nt = {};
    for (var key in t) {
      if (t.hasOwnProperty(key)) nt[key] = deepClone(t[key]);
    }
    nt.__proto__ = t.__proto__;
    return nt;
  } else {
    return t;
  }
}
function randomId() {
  return Date.now() + Math.random();
}
function objectAssign() {
  var arg = [].slice.call(arguments, 1);
  var target = arguments[0];
  arg.forEach(function (item) {
    for (var key in item) {
      target[key] = item[key];
    }
  });
  return target;
}
function walkElement(dom, cb) {
  if (is(dom, 'array')) {
    dom.forEach(function (item) {
      while (item) {
        cb(item);
        walkElement(item.firstElementChild, cb);
        item = item.nextElementSibling;
      }
    });
  } else {
    while (dom) {
      cb(dom);
      walkElement(dom.firstElementChild, cb);
      dom = dom.nextElementSibling;
    }
  }
}
function toHump(str) {
  return str.replace(/-(.)/g, function (a, b) {
    return String.fromCharCode(b.charCodeAt(0) - 32);
  });
}

function toHumpBack(str) {
  var strArr = str.split('');
  strArr = strArr.map(function (item) {
    var code = item.charCodeAt(0);
    if (code >= 65 && code <= 90) {
      return '-' + String.fromCharCode(code + 32);
    }
    return item;
  });
  return strArr.join('');
}
function getTagText(tag) {
  var tagName = tag.nodeName.toLowerCase();
  var attrStr = toArray(tag.attributes).map(function (item) {
    return item.name + '="' + item.value + '"';
  }).join('\n  ');
  return '<' + tagName + ' ' + attrStr + '>';
}