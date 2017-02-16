'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (str) {
  var resStr = '';

  for (var i = 0, len = str.length; i < len; i++) {
    var char = str[i];
    var nextChar = str[i + 1];

    if (char === TAG_START) {
      var start = i;
      var tagName = '';
      var col = null;
      var repeat = false;
      var tagStr = '';

      for (; i < len; i++) {
        var _char = str[i];
        if (!col && ATTR_NAME_REPLACE.test(_char)) {
          tagStr += ATTR_NAME_REPLACE_AFTER + _char.toLowerCase();
        } else {
          tagStr += _char;
          if (SYB_REG.test(_char)) {
            if (!col) {
              col = _char;
            } else {
              if (col === _char) {
                col = null;
              }
            }
          }
        }
        if (!col && _char === TAG_END) {
          if (str[i - 1] === TAG_CLOSE) {
            repeat = true;
          }
          break;
        }
      }
      resStr += tagStr;
      continue;
    }
    resStr += char;
  }
  return resStr;
};

var TAG_START = '<';
var TAG_END = '>';
var TAG_CLOSE = '/';

var SYB_REG = /['"]/;

var ATTR_NAME_REPLACE = /[A-Z]/;
var ATTR_NAME_REPLACE_AFTER = '-';