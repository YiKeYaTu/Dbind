const NOR_STATEMENT = {
  start: '{{',
  end: '}}'
};
const ONCE_STATEMENT = {
  start: '{{{',
  end: '}}}'
};
const MARKS = /['"]/;

export const NOR_STATEMENT_TYPE = 'normalStatement';
export const ONCE_STATEMENT_TYPE = 'onceStatement';
export const CONST_STRING = 'constString';

const checkNorStart = checkStatement(NOR_STATEMENT.start);
const checkNorEnd = checkStatement(NOR_STATEMENT.end);
const checkOnceStart = checkStatement(ONCE_STATEMENT.start);
const checkOnceEnd = checkStatement(ONCE_STATEMENT.end);

function checkStatement(statementSyb) {
  return function(str, index) {
    let i = 0, len = statementSyb.length;
    for(; i < len; i ++, index ++) {
      if(str[index] !== statementSyb[i]) return -1;
    }
    return i;
  }
}

export function resetStatementSyb(type, sybObj) {
  if(type === NOR_STATEMENT_TYPE) {
    target = NOR_STATEMENT;
  } else if(type === ONCE_STATEMENT_TYPE) {
    target = ONCE_STATEMENT;
  } else {
    throw new TypeError('type need to be normalStatement or onceStatement');
  }
  target.start = sybObj.start;
  target.end = sybObj.end;
}

export default function statementExtract(str) {
  let len = str.length;
  let res = [];
  let stmStack = [];
  let mrkStack = [];
  
  let i = -1, p = 0;

  while(++ i < len) {
    let char = str[i];
    let mrkLen = mrkStack.length;
    let stmLen = stmStack.length;
    if(mrkLen === 0) {
      let norStart = checkNorStart(str, i);
      let onceStart = checkOnceStart(str, i);
      let norEnd = checkNorEnd(str, i);
      let onceEnd = checkOnceEnd(str, i);

      if(norStart > -1 && onceStart === -1) {
        stmStack.push(NOR_STATEMENT_TYPE);
        if(stmLen === 0) i += norStart;
      } else if(onceStart > -1) {
        stmStack.push(ONCE_STATEMENT_TYPE);
        if(stmLen === 0) i += onceStart;
      }
      if((norStart > -1 || onceStart > -1)) {
        if(stmLen === 0) {
          res[p] && p ++;
        } else {
          res[p].value += str.slice(i, i += (norStart > -1 ? norStart : onceStart));
        }
        continue;
      }

      if((norEnd > -1 && stmStack[stmLen - 1] === NOR_STATEMENT_TYPE) || (onceEnd > -1 && stmStack[stmLen - 1] === ONCE_STATEMENT_TYPE)) {
        stmStack.pop();
        if(stmLen === 1) {
          i += norEnd > -1 ? norEnd : onceEnd;
          p ++;
        } else {
          res[p].value += str.slice(i, i += (norEnd > -1 ? norEnd : onceEnd));
        }
        continue;
      }
    }
      
    if(!res[p]) {
      res[p] = {
        type: stmLen === 0 ? CONST_STRING : stmStack[0],
        value: ''
      };
    }
    if(MARKS.test(char) && stmLen.length > 0) {
      if(mrkLen > 0) {
        if(str[i - 1] !== '\\') {
          mrkStack.pop();
        }
      } else {
        mrkStack.push(char);
      }
    }
    res[p].value += char;
  }

  if(mrkStack.length !== 0) {
    throw new SyntaxError(`Unexpected ${mrkStack.pop()}`);
  }
  return res;
}
