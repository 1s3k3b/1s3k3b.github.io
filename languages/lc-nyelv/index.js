const getel = id => document.getElementById(id);

const abc = ["a", "á", "b", "c", "d", "e", "é", "f", "g", "h", "i", "í", "j", "k", "l", "m", "n", "o", "ó", "ö", "ő", "p", "q", "r", "s", "t", "u", "ú", "ü", "ű", "v", "w", "x", "y", "z"];

window.onload = () => {
    const input = getel("input");
    const output = getel("output");
    
    input.addEventListener("keyup", () => {
        output.value = input.value.split("").map(s => abc[abc.length - 1 - abc.indexOf(s.toLowerCase())] ? (s === s.toLowerCase() ? abc[abc.length - 1 - abc.indexOf(s)] : abc[abc.length - 1 - abc.indexOf(s.toLowerCase())].toUpperCase()) : s).join("");
    });
};
