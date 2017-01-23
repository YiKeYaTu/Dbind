const variableExp = {
    start: /[a-zA-Z_$]/,
    after: /[a-zA-Z_$0-9]/,
};
const symbolExp = {
    marks: /['"]/,
    point: /\./,
    bracketStart: /\[/,
    bracketEnd: /\]/,
    braceStart: /\{/,
    braceEnd: /\}/,
    parenthesesStart: /\(/,
    parenthesesEnd: /\)/,
    comma: /,/,
    colon: /:/,
    space: /\s/,
    backSlant: /\\/,
    
};

/**
 * 
 * 
 * @export
 * @param {string} str
 * @returns
 */
export default function modelExtract(str) {
    const len =    str.length, 
          resolvedVector = [],
          symbolStack    = [],
          bracketsStack  = [];
    let i = -1, p = -1;
    while(++ i < len) {
        const char = str[i];
        const bracketsTop = bracketsStack[bracketsStack.length - 1];
        const symbolTop = symbolStack[symbolStack.length - 1];
        if(char.match(symbolExp.space)) {
            continue;
        } else if(char.match(variableExp.start)) {
            if(symbolTop && symbolTop.match(symbolExp.point)) {
                while(++ i < len && str[i].match(variableExp.after)) {}
            } else if((symbolTop && symbolTop.match(symbolExp.colon)) || !bracketsTop || (bracketsTop && !bracketsTop.match(symbolExp.braceStart))) {
                resolvedVector[++ p] = {}
                resolvedVector[p].index = i;
                resolvedVector[p].value = char;
                while(++ i < len && str[i].match(variableExp.after)) {
                    resolvedVector[p].value += str[i];
                }
            } else {
                while(++ i < len && str[i].match(variableExp.after)) {}
            }
            i --;
            symbolStack.pop();
        } else if(char.match(symbolExp.marks)) {
            while(++ i < len && (str[i] !== char || str[i - 1].match(symbolExp.backSlant)));
            symbolStack.pop();
        } else if(char.match(symbolExp.braceStart) || char.match(symbolExp.bracketStart) || char.match(symbolExp.parenthesesStart)) {
            symbolStack.pop();
            bracketsStack.push(char);
        } else if(char.match(symbolExp.braceEnd) || char.match(symbolExp.bracketEnd) || char.match(symbolExp.parenthesesEnd)) {
            bracketsStack.pop();
        } else if(char.match(symbolExp.colon) || char.match(symbolExp.point)) {
            symbolStack.push(char);
        } else {
            symbolStack.pop();
        }
    }
    return resolvedVector;
}