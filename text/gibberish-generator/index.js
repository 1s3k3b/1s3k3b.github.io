const getel = id => document.getElementById(id);
const gen = len => new Array(len).fill(() => String.fromCharCode(Math.floor(Math.random() * 1000))).map(f => f()).join("").replace(/\s/g, "");

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    const len = getel("len");
    const btn = getel("btn");
    const outp = getel("outp");
    
    if (params.get("len")) len.value = params.get("len");
    
    btn.addEventListener("click", () => {
        outp.value = gen(parseInt(len.value) || 10000);
    });
};
