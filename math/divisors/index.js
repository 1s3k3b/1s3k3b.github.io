const getel = id => document.getElementById(id);

const getDivisors = num => {
    const divisors = [];
    let mod = num;
        
    while (mod > 0) {
        if (num % mod === 0) divisors.push([num / mod, mod]);
        mod--;
    }
        
    return paginate(Array.from(new Set(divisors.flat(69))));
};
const paginate = (arr, max = 2) => {
    const mapped = arr;
    if (mapped.length <= max) return mapped;
    const res = [];
    const maxLen = Math.ceil(mapped.length / max);
    for (let i = 0; i < maxLen; i++) res[i] = mapped.slice(i * max, (i + 1) * max);
    return res;
};
const formatDivisors = arr => arr.map(p => p.join("; ")).join("\n");

window.onload = () => {
    const inp = getel("inp");
    const btn = getel("btn");
    const outp = getel("outp");
    
    const params = new URLSearchParams(window.location.search);
    
    if (params.get("number")) inp.value = params.get("number");
    
    btn.addEventListener("click", () => {
        const n = parseInt(inp.value.replace(/\D/, ""));
        if (!n) {
            outp.value = "Invalid number";
            return;
        }
        outp.value = formatDivisors(getDivisors(n));
    });
};
