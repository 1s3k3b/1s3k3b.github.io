const getel = id => document.getElementById(id);

const greekify = str => str
.replace(/a/gi, "α")
.replace(/b/gi, "β")
.replace(/c/gi, "ς")
.replace(/d/gi, "δ")
.replace(/e/gi, "ε")
.replace(/i/gi, "ι")
.replace(/k/gi, "κ")
.replace(/n/gi, "η")
.replace(/o/gi, "θ")
.replace(/p/gi, "ρ")
.replace(/q/gi, "μ")
.replace(/r/gi, "π")
.replace(/t/gi, "τ")
.replace(/u/gi, "υ")
.replace(/v/gi, "ν")
.replace(/w/gi, "ω")
.replace(/x/gi, "χ")
.replace(/y/gi, "γ");

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    
    const inp = getel("inp");
    const outp = getel("outp");
    const btn = getel("btn");
    
    if (params.get("text")) inp.value = params.get("text");
    
    btn.addEventListener("click", () => {
        if (inp.value) outp.value = greekify(inp.value);
    });
};
