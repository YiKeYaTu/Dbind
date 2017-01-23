export class Tokenizer {
    static variableStartExp = /[a-zA-Z_$]/;
    static variableAfterExp = /[a-zA-Z_$0-9]/;
    static variablePropertyExp = /\[/;

    static constStringExp = /['"]/;
    static constPropertyExp = /\./;

    static type = ['variable', 'constString', 'constProperty', 'speicalChar', 'variableProperty'];

    static speicalChar = ['in'];

    static parse(str) {
        const len = str.length;
        const tokenizerStack = [];
        const varibaleVector = [];
        let prevType = null;
        let current = -1,
            vectorP = -1;
        while(++ current < len) {
            let char = str[current];
            if(char === '\s') continue;
            else if(char.match(Tokenizer.variableStartExp)) {
                ++ vectorP;
                varibaleVector[vectorP] = {
                    type: prevType || Tokenizer.type[0],
                    value: ''
                };
                varibaleVector[vectorP].value += char;
                while(++ current !== len && (char = str[current]) && char.match(Tokenizer.variableAfterExp)) {
                    varibaleVector[vectorP].value += char;
                }
                if(Tokenizer.speicalChar.indexOf(varibaleVector[vectorP].value) > -1) {
                    varibaleVector[vectorP].type = Tokenizer.type[3];
                }
                -- current;
                prevType = null;
            } else if(char.match(Tokenizer.constStringExp)) {
                ++ vectorP;
                tokenizerStack.push(char);
                varibaleVector[vectorP] = {
                    type: Tokenizer.type[1],
                    value: ''
                };
                while(++ current !== len && (char = str[current])) {
                    if(char === tokenizerStack[tokenizerStack.length - 1] && str[current - 1] !== '\\') {
                        break;
                    }
                    varibaleVector[vectorP].value += char;
                }
                tokenizerStack.pop();
            } else if(char.match(Tokenizer.constPropertyExp)) {
                prevType = Tokenizer.type[2];
            } else if(char.match(Tokenizer.variablePropertyExp)) {
                prevType = Tokenizer.type[4];
            }
        }
        return varibaleVector;
    }
}
export class VmParser {
    static interpolationStartExp = '{';
    static interpolationEndExp = '}';

    static normalInterpolationStartExp = '{{';
    static normalInterpolationEndExp = '}}';
    static speicalInterpolationStartExp = '{{{';
    static speicalInterpolationEndExp = '}}}';

    static constString = 'constString';
    static variableNoraml = 'variableNoraml'
    static variableSpecial = 'variableSpecial'; 

    static parse(str) {
        const len = str.length;
        const vector = [];
        const markStack = [];
        let startStack = [],
            endStack = [];
        let i = -1, p = 0;
        while(++ i < len) {
            const char = str[i];
            if((char === VmParser.interpolationStartExp || char === VmParser.interpolationEndExp) && markStack.length > 0) {
                vector[p].value += char;
                continue;
            }
            if (char === VmParser.interpolationStartExp) {
                while(i < len && str[i] === VmParser.interpolationStartExp) {
                    startStack.push(i);
                    ++ i;
                }
                if(startStack.length !== VmParser.normalInterpolationStartExp.length && startStack.length !== VmParser.speicalInterpolationStartExp.length) {
                    throw `${str}语法错误`;
                }
                ++ p;
            } else if(char === VmParser.interpolationEndExp) {
                while(i < len && str[i] === VmParser.interpolationEndExp) {
                    endStack.push(i);
                    ++ i;
                }
                if(endStack.length !== startStack.length) {
                    throw `${str}语法错误`;
                } else {
                    endStack = startStack = [];
                }
                ++ p;   
            } else {
                if(!vector[p]) {
                    vector[p] = {
                        type: null,
                        value: ''
                    };
                }
                vector[p].value += char;
                if(startStack.length > 0) {
                    if(startStack.length === VmParser.normalInterpolationStartExp.length) {
                        vector[p].type = VmParser.variableNoraml;
                    } else {
                        vector[p].type = VmParser.variableSpecial;
                    }
                    if(char.match(/['"]/)) {
                        if(markStack.length > 0) {
                            if(char === markStack[0] && str[i - 1] !== '\\') {
                                markStack.pop();
                            }
                        } else {
                            markStack.push(char);
                        }
                    }
                } else {
                     vector[p].type = VmParser.constString;
                }
            }
        } 
        return vector;
    }
    
}