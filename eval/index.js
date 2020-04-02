const getel = id => document.getElementById(id);

const fibIndent = code => {
    const mult = n => {
        let a = 1, b = 0, temp;
        while (n >= 0) {
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
    }).map(l => l.substring(1)).join("\n");
};

const inspect = (obj, { indent = 2, string = 1, depth = 3 } = {}, __depth__ = 0, __indentLevel__ = indent) => {
    if (depth < 2) throw new RangeError("\"depth\" option must be greater than 1");
    
    const strW = ["'", 1].includes(string) ? "'" : '"';
    const recurse = object => inspect(object, { indent, string, depth }, __depth__ + 1, __indentLevel__ + indent);
    
    if (__depth__ > depth) return typeof obj === "string" ? `${strW}${obj}${strW}` : `[${obj && obj.constructor ? obj.constructor.name : typeof obj}]`;
    
    if (typeof obj === "string") return `${strW}${obj}${strW}`;
    if (["boolean", "number", "undefined"].includes(typeof obj)) return `${obj}`;
    if (typeof obj === "symbol") return String(obj);

    if (typeof obj === "function" || obj instanceof Function) return `[Function${obj.name ? " " + obj.name : ""}: ${obj.length}]`;
    if (obj instanceof Array || obj instanceof Set) {
        const mapped = (obj instanceof Set ? Array.from(obj) : obj).map(recurse).join(", ");
        const keys = Object.keys(obj).filter(k => isNaN(parseInt(k))).map(k => `${k}: ${recurse(obj[k])}`).join(",\n" + " ".repeat(__indentLevel__));
        return `${obj.constructor === Array ? "" : obj.constructor.name} [${keys.length ? "\n" + " ".repeat(__indentLevel__) : " "}${mapped}${keys.length ? ",\n" + " ".repeat(__indentLevel__) : " "}${keys.length ? keys + "\n": ""}]`;
    }
    if (obj instanceof Map) {
        const entries = [...obj.entries()].map(([ k, v ]) => `${recurse(k)} => ${recurse(v)}`).join(",\n" + " ".repeat(__indentLevel__));
        return `${obj.constructor.name} {\n${" ".repeat(__indentLevel__) + entries}\n${" ".repeat(__indentLevel__ - indent)}}`;
    }
    if (obj instanceof Promise) return `${obj.constructor.name} { <pending> }`;
    
    const keys = Object.keys(obj).map(k => `${recurse(k)}: ${recurse(obj[k])}`).join(",\n" + " ".repeat(__indentLevel__));
    return `${obj.constructor === Object ? "" : obj.constructor.name + " "}{\n${" ".repeat(__indentLevel__) + keys}\n${" ".repeat(__indentLevel__ - indent)}}`;
};

const evalStr = async (str, awaitO, opts) => {
    let res;
    let info;
    const stdout = [];
    
    const consoleFn = (...args) => stdout.push(args.map(x => (opts.indent === "fib" ? fibIndent(inspect(x, { indent: 4, string: opts.string, depth: opts.depth })) : inspect(x, opts))).join(" "));
    
    try {
        console.log = consoleFn;
        console.info = consoleFn;
        console.warn = consoleFn;
        console.error = consoleFn;
            
        let evaled = eval(str);
        while (awaitO && evaled && evaled instanceof Promise && typeof evaled.then === "function") evaled = await evaled;
        consoleFn(evaled);
        res = stdout.join("\n");
        info = "Type: " + typeof evaled + " - Constructor: " + (evaled && evaled.constructor ? evaled.constructor.name : evaled);
    } catch (e) {
        res = stdout.join("\n") + (stdout.length ? "\n" : "") + e.name + ": " + e.message;
        info = "Type: " + typeof e + " - Constructor: " + (e && e.constructor ? e.constructor.name : e);
    }
    
    return { res, info };
}

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    
    const inp = getel("inp");
    const outp = getel("outp");
    const btn = getel("btn");
    const linkgen = getel("link");
    
    const awaitRes = getel("awaitr");
    const showInfo = getel("showi");
    const depth = getel("depth");
    const string = getel("string");
    const indent = getel("indent");
    
    if (params.get("code")) inp.value = atob(params.get("code"));
    
    if (params.get("depth")) depth.value = params.get("depth");
    if (params.get("indent")) indent.value = params.get("indent");
    if (params.get("string")) string.value = params.get("string");
    
    if (params.get("await") == "1") awaitRes.checked = true;
    if (params.get("info") == "1") showInfo.checked = true;
    
    btn.addEventListener("click", async () => {
        outp.value = "";
        const { res, info } = await evalStr(inp.value, awaitRes.checked, {
            depth: parseInt(depth.value) || 3,
            string: parseInt(string.value) || string.value,
            indent: parseInt(indent.value) || (["fibonacci", "fib"].includes(indent.value.trim().toLowerCase()) ? "fib" : 2) 
        });
        outp.value = res;
        if (showInfo.checked) alert(info);
    });
    linkgen.addEventListener("click", () => {
        const obj = {
            depth: parseInt(depth.value) || 3,
            string: parseInt(string.value) || string.value,
            indent: parseInt(indent.value) || (["fibonacci", "fib"].includes(indent.value.trim().toLowerCase()) ? "fib" : 2) 
        };
        outp.value = "https://1s3k3b.github.io/eval?code=" + btoa(inp.value) + "&indent=" + obj.indent + "&string=" + obj.string + "&depth=" + obj.depth + "&await=" + (awaitRes.checked ? 1 : 0) + "&info=" + (showInfo.checked ? 1 : 0);
    });
};

window.onbeforeunload = () => true;
