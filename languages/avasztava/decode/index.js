const getel = id => document.getElementById(id);

const mghngz = ["a", "á", "e", "é", "o", "ó", "ö", "ő", "i", "í", "u", "ú", "ü", "ű"];

const decode = txt => {
    const arr = txt.split("");
    for (let i = 0; i < arr.length; i++) {
        const char = arr[i];
        if (mghngz.includes(char) && arr[i + 1] === "v" && arr[i + 2].toLowerCase() === char.toLowerCase()) arr.splice(i, 2);
    }
    return arr.join("");
};

window.onload = () => {
    const input = getel("input");
    const output = getel("output");
    
    input.addEventListener("keyup", () => {
        output.value = decode(input.value);
    });
};
