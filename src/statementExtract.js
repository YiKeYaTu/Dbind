const normalStatement = {start: '{{', end: '}}',};
const onceStatement = {start: '{{{', end: '}}}'};
const statementStart = '{';
const statementEnd = '}';
const marksExp = /['"]/; 
export const statementType = ['normalStatement', 'onceStatement', 'constString'];

export default function statementExtract(str) {
    const len = str.length;
    const resolvedVector = [];
    const stack =         [];
    const marksStack =    [];
    let i = -1, p = 0;
    while(++ i < len) {
        const char = str[i];
        if(char === statementStart && marksStack.length === 0) {
            while(i < len && str[i] === statementStart) {
                stack.push(char);
                i ++;
            }
            i --;
            if(stack.join('') === normalStatement.start || stack.join('') === onceStatement.start) {
                if(resolvedVector[p])
                    p ++;
            } else {
                throw `${str}模版语句中${str.slice(i - 3, i + 3)}语法错误`;
            }
        } else if(char === statementEnd && marksStack.length === 0) {
            while(i < len && str[i] === statementEnd) {
                stack.pop();
                i ++;
            }
            i --;
            if(stack.length !== 0) {
                throw `${str}模版语句中${str.slice(i - 3, i + 3)}语法错误`;
            }
            p ++;
        } else {
            if(!resolvedVector[p]) {
                resolvedVector[p] = {
                    type: stack.length === 0 ? statementType[2] : (stack.length === 2 ? statementType[0] : statementType[1]),
                    value: ''
                };
            }
            if(char.match(marksExp) && stack.length > 0) {
                if(marksStack.length > 0) {
                    if(str[i - 1] !== '\\') {
                        marksStack.pop();
                    }
                } else {
                    marksStack.push(char);
                }
            }
            resolvedVector[p].value += char;
        }
    }
    return resolvedVector;
}