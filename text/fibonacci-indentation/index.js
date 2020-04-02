const getel = id => document.getElementById(id);

const indent = code => {
    const mult = n => {
        let a = 1, b = 0, temp;
        while (n >= 0){
            temp = a;
            a = a + b;
            b = temp;
            n--;
        }
        return b;
    };
    let lvl = 0;
    return code.split("\n").map(l => {
        l = l.trim();
        
        if ((!l.includes("{") && !l.includes("}")) || /{[\s\S]*}/.test(l)) {
            const str = `${" ".repeat(mult(lvl + 1))}${l}`;
            
            if (l.includes("[") && !l.includes("]")) ++lvl;
            if (l.includes("]") && !l.includes("[")) {
                --lvl;
                return `${" ".repeat(mult(lvl + 1))}${l}`;
            }
            
            if (l.includes("(") && !l.includes(")")) ++lvl;
            if (l.includes(")") && !l.includes("(")) {
                --lvl;
                return `${" ".repeat(mult(lvl + 1))}${l}`
            }
            
            return str;
        }
        
        if (l.includes("{") && l.includes("}")) return `${" ".repeat(mult(lvl))}${l}`;
        if (l.includes("}")) return `${" ".repeat(mult(lvl--))}${l}`;
        return `${" ".repeat(mult(++lvl))}${l}`;
    }).join("\n");
};

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    
    const inp = getel("inp");
    const btn = getel("btn");
    const link = getel("link");
    const outp = getel("outp");
    
    if (params.get("code")) inp.value = atob(params.get("code"));
    
    btn.addEventListener("click", () => {
        if (inp.value) outp.value = indent(inp.value);
    });
    link.addEventListener("click", () => {
        outp.value = "https://1s3k3b.github.io/text/fibonacci-indentation?code=" + btoa(inp.value);
    });
};
