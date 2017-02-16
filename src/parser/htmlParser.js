const TAG_START = '<';
const TAG_END = '>';
const TAG_CLOSE = '/';

const SYB_REG = /['"]/;

const ATTR_NAME_REPLACE = /[A-Z]/;
const ATTR_NAME_REPLACE_AFTER = '-';

export default function (str) {
  let resStr = '';

  for (let i = 0, len = str.length; i < len; i++) {
    let char = str[i];
    let nextChar = str[i + 1];

    if (char === TAG_START) {
      let start = i;
      let tagName = '';
      let col = null;
      let repeat = false;
      let tagStr = '';

      for(; i < len; i ++) {
        let char = str[i];
        if(!col && ATTR_NAME_REPLACE.test(char)) {
          tagStr += ATTR_NAME_REPLACE_AFTER + char.toLowerCase();
        } else {
          tagStr += char; 
          if(SYB_REG.test(char)) {
            if(!col) {
              col = char;
            } else {
              if(col === char) {
                col = null;
              }
            }
          }
        }
        if(!col && char === TAG_END) {
          if(str[i -1] === TAG_CLOSE) {
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
}