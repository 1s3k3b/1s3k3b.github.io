const getel = id => document.getElementById(id);
const mapToObj = map => {
    const obj = {};
    map.forEach((v, k) => {
        obj[k] = v;
    });
    return obj;
};

const resolveVal = (obj, seperator, lineBreaks) => {
    if (obj === "true") return "on";
    if (obj === "false") return "off";
    if (typeof obj === "number" || obj instanceof Number || typeof obj === "string" || obj instanceof String) return String(obj);
    if (typeof obj === "boolean" || obj instanceof Boolean) return obj ? "on" : "off";
    if (obj instanceof Array) return obj.join(", ");
    return getControls(obj, seperator, lineBreaks);
};

const getControls = (obj, seperator, lineBreaks) => {
    const resolveContrVal = v => {
        if (typeof v === "number" || v instanceof Number || v instanceof String || typeof v === "string") return String.fromCharCode(Number(v));
        if (v instanceof Array) return v.map(resolveContrVal).join(", ");
        return v;
    };
    
    const keys = Object.keys(obj).filter(k => obj[k]).map(k => [resolveKey(k), obj[k], k]);
    const transformed = mapToObj(new Map(keys));
    const str = Object.keys(transformed).map(k => k + (seperator.value ? seperator.value : ":") + " " + resolveContrVal(transformed[k])).join("\n".repeat(parseInt(lineBreaks.value ? lineBreaks.value : "1")));
    return str;
};

const resolveKey = txt => txt.split("").map((char, i) => {
    if (i === 0) return char.toUpperCase();
    if (char.toUpperCase() === char && txt[i - 1].toUpperCase() !== txt[i - 1]) return " " + char;
    return char;
}).join("");

window.onload = () => {
    const field = getel("txta");
    const btn = getel("btn");
    const output = getel("outp");
    const lineBreaks = getel("breaks");
    const includeControls = getel("controls");
    const seperator = getel("seperator");
    
    btn.addEventListener("click", () => {
        try {
            const data = JSON.parse(field.value);
            const keys = Object.keys(data).filter(k => (includeControls.checked ? true : k !== "controls") && data[k]).map(k => [resolveKey(k), data[k], k]);
            const transformed = mapToObj(new Map(keys));
            const str = Object.keys(transformed).map(k => k + (seperator.value ? seperator.value : ":") + " " + resolveVal(transformed[k], seperator, lineBreaks)).join("\n".repeat(parseInt(lineBreaks.value ? lineBreaks.value : "1")));
            outp.value = str;
        } catch (e) {
            console.error(e);
            outp.value = "Invalid syntax.";
        }
    });
};
