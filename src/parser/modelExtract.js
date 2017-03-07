const VAR_START = /[a-zA-Z_$]/;
const VAR_AFTER = /[a-zA-Z_$0-9]/;

const MARKS = /['"]/;
const POINT = /\./;
const BRK_START = /\[/;
const BRK_END = /\]/;
const BRC_START = /\{/;
const BRC_END = /\}/;
const TH_START = /\(/;
const TH_END = /\)/;
const COMMA = /,/;
const COLON = /:/;
const SPACE = /\s/;
const BAK_SLANT = /\\/;

const UN_EXPECT_CHAR = {
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
  let len = str.length;
  let res = [];
  let sybStk = [];
  let brkStk = [];
  let modelHashTable = { };
  
  let i = -1, p = -1;
  while (++ i < len) {
    let char = str[i];
    let brkTop = brkStk[brkStk.length - 1];
    let sybTop = sybStk[sybStk.length - 1];

    if(SPACE.test(char)) continue;
    /**
     * 捕获变量
     */
    if(char.match(VAR_START)) {
      if((sybTop && POINT.test(sybTop)) || (brkTop && BRC_START.test(brkTop) && !COLON.test(sybTop))) {
        while (++ i < len && VAR_AFTER.test(str[i]));
      } else {
        res[++ p] = {index: i, value: char};
        while (++ i < len && VAR_AFTER.test(str[i])) {
          res[p].value += str[i];
        }
        if(modelHashTable[res[p].value]) {
          p --;
          res.pop();
        } else {
          modelHashTable[res[p].value] = true;
        }
        if(UN_EXPECT_CHAR[res[p].value] === true) {
          throw new SyntaxError('Unexpected function, in Observer statement you can\'t use function');
        }
      }
      i --; sybStk.pop();
    } else if(MARKS.test(char)) {
      while (++ i < len && (str[i] !== char || BAK_SLANT.test(str[i - 1])));
      sybStk.pop();
    } else if(BRC_START.test(char) || BRK_START.test(char) || TH_START.test(char)) {
      sybStk.pop();
      brkStk.push(char);
    } else if(BRC_END.test(char) || BRK_END.test(char) || TH_END.test(char)) {
      brkStk.pop();
    } else if(COLON.test(char) || POINT.test(char)) {
      sybStk.push(char);
    } else {
      sybStk.pop();
    }
  }
  return res;
}
export default modelExtract;