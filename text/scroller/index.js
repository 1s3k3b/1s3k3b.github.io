const getel = id => document.getElementById(id);

const gen1 = str => {
    let res = "";
    const resArr = [];
    for (const char of str) {
        res += char;
        resArr.push(res);
    } 
    resArr.slice(0, -1).reverse().map(v => resArr.push(v));
    return resArr.join("\n");
};
const gen2 = str => {
    let res = str;
    const resArr = [];
    for (let i = str.length; i > 0; i--) {
        console.log(i)
        res = res.slice(0, i);
        resArr.push(res);
    } 
    resArr.slice(0, -1).reverse().map(v => resArr.push(v));
    return resArr.join("\n")
};
const gen3 = str => {
    const resArr = [];
    for (let i = 0; i < str.length; i++) resArr.push(" ".repeat(i) + str);
    resArr.slice(0, -1).reverse().map(v => resArr.push(v));
    return resArr.join("\n");
};
const gen4 = str => {
    const resArr = [];
    for (let i = 0; i < str.length; i++) resArr.push(" ".repeat(i) + str.split("").join(" "));
    resArr.slice(0, -1).reverse().map(v => resArr.push(v));
    return resArr.join("\n");
};
const gen5 = str => {
    let res = "";
    for (let i = 0; i < str.length; i++) {
        for (let j = 0; j < 10; j++) {
            res += str.slice(0, i) + " ".repeat(j) + str.slice(i) + "\n";
        }
    }
    return res + res.split("\n").reverse().join("\n");
};

const gen = str => ((gen1(str) + "\n").repeat(2) + (gen2(str) + "\n").repeat(2) + (gen3(str) + "\n").repeat(2) + (gen4(str) + "\n").repeat(2) + gen5(str).repeat(2)).repeat(10);

window.onload = () => {
    const inp = getel("inp");
    const outp = getel("outp");
    const btn = getel("btn");

    btn.addEventListener("click", () => {
        if (inp.value) outp.value = gen(inp.value);
    });
};
