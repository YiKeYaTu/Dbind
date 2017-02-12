'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var VAR_START = /[a-zA-Z_$]/;
var VAR_AFTER = /[a-zA-Z_$0-9]/;

var MARKS = /['"]/;
var POINT = /\./;
var BRK_START = /\[/;
var BRK_END = /\]/;
var BRC_START = /\{/;
var BRC_END = /\}/;
var TH_START = /\(/;
var TH_END = /\)/;
var COMMA = /,/;
var COLON = /:/;
var SPACE = /\s/;
var BAK_SLANT = /\\/;

var UN_EXPECT_CHAR = {
  'function': true
};

/**
 * 
 * 
 * @param {string} str
 * @returns {array}
 * 该函数返回javascript表达式之中所使用的变量
 * 表达式之中不能含有函数作用域
 */
function modelExtract(str) {
  var len = str.length;
  var res = [];
  var sybStk = [];
  var brkStk = [];
  var modelHashTable = {};

  var i = -1,
      p = -1;
  while (++i < len) {
    var char = str[i];
    var brkTop = brkStk[brkStk.length - 1];
    var sybTop = sybStk[sybStk.length - 1];

    if (SPACE.test(char)) continue;
    /**
     * 捕获变量
     */
    if (char.match(VAR_START)) {
      if (sybTop && POINT.test(sybTop) || brkTop && BRC_START.test(brkTop) && !COLON.test(sybTop)) {
        while (++i < len && VAR_AFTER.test(str[i])) {}
      } else {
        res[++p] = { index: i, value: char };
        while (++i < len && VAR_AFTER.test(str[i])) {
          res[p].value += str[i];
        }
        if (modelHashTable[res[p].value]) {
          p--;
          res.pop();
        } else {
          modelHashTable[res[p].value] = true;
        }
        if (UN_EXPECT_CHAR[res[p].value] === true) {
          throw new SyntaxError('Unexpected function, in Observer statement you can\'t use function');
        }
      }
      i--;sybStk.pop();
    } else if (MARKS.test(char)) {
      while (++i < len && (str[i] !== char || BAK_SLANT.test(str[i - 1]))) {}
      sybStk.pop();
    } else if (BRC_START.test(char) || BRK_START.test(char) || TH_START.test(char)) {
      sybStk.pop();
      brkStk.push(char);
    } else if (BRC_END.test(char) || BRK_END.test(char) || TH_END.test(char)) {
      brkStk.pop();
    } else if (COLON.test(char) || POINT.test(char)) {
      sybStk.push(char);
    } else {
      sybStk.pop();
    }
  }
  return res;
}
exports.default = modelExtract;