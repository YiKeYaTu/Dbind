'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetStatementSyb = resetStatementSyb;
exports.default = statementExtract;
var NOR_STATEMENT = {
  start: '{{',
  end: '}}'
};
var ONCE_STATEMENT = {
  start: '{{{',
  end: '}}}'
};
var MARKS = /['"]/;

var NOR_STATEMENT_TYPE = exports.NOR_STATEMENT_TYPE = 'normalStatement';
var ONCE_STATEMENT_TYPE = exports.ONCE_STATEMENT_TYPE = 'onceStatement';
var CONST_STRING = exports.CONST_STRING = 'constString';

var checkNorStart = checkStatement(NOR_STATEMENT.start);
var checkNorEnd = checkStatement(NOR_STATEMENT.end);
var checkOnceStart = checkStatement(ONCE_STATEMENT.start);
var checkOnceEnd = checkStatement(ONCE_STATEMENT.end);

function checkStatement(statementSyb) {
  return function (str, index) {
    var i = 0,
        len = statementSyb.length;
    for (; i < len; i++, index++) {
      if (str[index] !== statementSyb[i]) return -1;
    }
    return i - 1;
  };
}

function resetStatementSyb(type, sybObj) {
  if (type === NOR_STATEMENT_TYPE) {
    target = NOR_STATEMENT;
  } else if (type === ONCE_STATEMENT_TYPE) {
    target = ONCE_STATEMENT;
  } else {
    throw new TypeError('type need to be normalStatement or onceStatement');
  }
  target.start = sybObj.start;
  target.end = sybObj.end;
}

function statementExtract(str) {
  var len = str.length;
  var res = [];
  var stmStack = [];
  var mrkStack = [];

  var i = -1,
      p = 0;

  while (++i < len) {
    var char = str[i];
    var mrkLen = mrkStack.length;
    var stmLen = stmStack.length;
    if (mrkLen === 0) {
      var norStart = checkNorStart(str, i);
      var onceStart = checkOnceStart(str, i);
      var norEnd = checkNorEnd(str, i);
      var onceEnd = checkOnceEnd(str, i);

      if (norStart > -1 && onceStart === -1) {
        stmStack.push(NOR_STATEMENT_TYPE);
        if (stmLen === 0) i += norStart;
      } else if (onceStart > -1) {
        stmStack.push(ONCE_STATEMENT_TYPE);
        if (stmLen === 0) i += onceStart;
      }
      if (norStart > -1 || onceStart > -1) {
        if (stmLen === 0) {
          res[p] && p++;
        } else {
          res[p].value += str.slice(i, i += norStart > -1 ? norStart : onceStart);
        }
        continue;
      }

      if (norEnd > -1 && stmStack[stmLen - 1] === NOR_STATEMENT_TYPE || onceEnd > -1 && stmStack[stmLen - 1] === ONCE_STATEMENT_TYPE) {
        stmStack.pop();
        if (stmLen === 1) {
          if (onceEnd > -1) {
            i += onceEnd;
          } else if (norEnd > -1) {
            i += norEnd;
          }
          p++;
        } else {
          res[p].value += str.slice(i, i += norEnd > -1 ? norEnd : onceEnd);
        }
        continue;
      }
    }

    if (!res[p]) {
      res[p] = {
        type: stmLen === 0 ? CONST_STRING : stmStack[0],
        value: ''
      };
    }
    if (MARKS.test(char) && stmLen.length > 0) {
      if (mrkLen > 0) {
        if (str[i - 1] !== '\\') {
          mrkStack.pop();
        }
      } else {
        mrkStack.push(char);
      }
    }
    res[p].value += char;
  }

  if (mrkStack.length !== 0) {
    throw new SyntaxError('Unexpected ' + mrkStack.pop());
  }
  return res;
}