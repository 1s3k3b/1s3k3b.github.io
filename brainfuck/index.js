const interpret = (str, input = '') => {
    const memory = [0];
    let output = '';
    let index = 0;
    let memoryPointer = 0;
    let inputIndex = 0;
    while (index < str.length) {
        switch (str[index]) {
        case '>':
            memoryPointer++;
            if (memoryPointer >= memory.length) memory.push(0);
            index++;
            break;
        case '<':
            memoryPointer--;
            if (memoryPointer < 0) throw new Error('Memory pointer out of bound.');
            index++;
            break;
        case '+':
            memory[memoryPointer]++;
            index++;
            break;
        case '-':
            memory[memoryPointer]--;
            index++;
            break;
        case '.':
            output += String.fromCharCode(memory[memoryPointer]);
            index++;
            break;
        case ',':
            memory[memoryPointer] = (input[inputIndex++] || '').charCodeAt(0) || 0;
            index++;
            break;
        case '[':
            if (memory[memoryPointer] === 0) {
                let ls = 0;
                let rs = 0;
                for (let i = index; i < str.length; i++) {
                    switch (str[i]) {
                    case '[':
                        ls++;
                        break;
                    case ']':
                        rs++;
                        break;
                    default:
                        break;
                    }
                    if (ls === rs) {
                        index = i + 1;
                        break;
                    }
                }
            }
            else {index++;}
            break;
        case ']':
            if (memory[memoryPointer] !== 0) {
                let ls = 0;
                let rs = 0;
                for (let i = index; i >= 0; i--) {
                    switch (str[i]) {
                    case '[':
                        ls++;
                        break;
                    case ']':
                        rs++;
                        break;
                    default:
                        break;
                    }
                    if (ls === rs) {
                        index = i + 1;
                        break;
                    }
                }
            }
            else {index++;}
            break;
        default:
            index++;
        }
    }
    return output;
};

const getel = id => document.getElementById(id);

window.onload = () => {
    const code = getel('code');
    const outp = getel('outp');
    const btn = getel('btn');

    btn.addEventListener('click', async () => {
        outp.value = '';
        const res = interpret(code.value, inp.value);
        outp.value = res;
    });
};