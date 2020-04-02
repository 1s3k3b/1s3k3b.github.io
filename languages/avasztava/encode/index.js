const getel = id => document.getElementById(id);

const mghngz = ["a", "á", "e", "é", "o", "ó", "ö", "ő", "i", "í", "u", "ú", "ü", "ű"];

window.onload = () => {
    const input = getel("input");
    const output = getel("output");
    
    input.addEventListener("keyup", () => {
        let outp = "";
        for (const char of input.value) {
            outp += char;
            if (mghngz.includes(char)) outp += "v" + char.toLowerCase();
        }
        output.value = outp;
    });
};
