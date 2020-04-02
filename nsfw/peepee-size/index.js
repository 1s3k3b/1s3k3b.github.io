const generateName = name => [name.toLowerCase() + Math.floor(Math.random() * 1000), leet(name)][Math.floor(Math.random() * 2)];

const leet = txt => {
    const textToArr = txt.split("");
    const finArr = [];

    textToArr.forEach((value, index) => {
        let v = value.toLowerCase();

        if (v === "i" || v === "l") {
            finArr.push("1");
            return;
        }
        if (v === "o") {
            finArr.push("0");
            return;
        }
        if (v === "e") {
            finArr.push("3");
            return;
        }
        if (value === "G") {
            finArr.push("6");
            return;
        }
        if (v === "g") {
            finArr.push("9");
            return;
        }
        if (v === "s") {
            finArr.push("5");
            return;
        }
        if (v === "z") {
            finArr.push("2");
            return;
        } 
        if (v === "t") {
            finArr.push("7");
            return;
        }
        if (value === "B") {
            finArr.push("8");
            return;
        }
        if (v === "b") {
            finArr.push("5");
            return;
        }
        if (v === "a") {
            finArr.push("4");
            return;
        }
        finArr.push(value);
    });

    return finArr.join("");
};

const randomNumber = () => [Math.floor(Math.random() * 50), Math.floor(Math.random() * 50) + 50, Math.floor(Math.random() * 50) + 50][Math.floor(Math.random() * 3)];

window.onload = function () {
    const nameI = document.getElementById("name");
    
    const params = new URLSearchParams(window.location.search);
    
    if (params.get("name")) nameI.value = params.get("name");

    document.getElementById("btn").addEventListener("click", () => {
        const erectSize = Math.floor(Math.random() * 8) + 2;
        const flaccDiff = Math.abs(Math.floor(Math.random() * ((erectSize / 4) - 1))) + 1;

        let erectPp = "8";
        let flaccPp = "8";

        for (let i = 0; i <= erectSize; i++) {
            erectPp += "=";
        }

        for (let i = 0; i <= erectSize - flaccDiff; i++) {
            flaccPp += "=";
        }

        erectPp += "D";
        flaccPp += "D";
        
        const prefix = nameI ? ("<p>Pornhub username: " + generateName(nameI.value) + "<p>") : "";
        const output = prefix + "<p>Flaccid peepee: " + flaccPp + "</p><p>Erect peepee: <a> </a><a> </a> " + erectPp + "</p>Virgin level: " + randomNumber() + "%</p>";

        document.getElementById("outpDiv").innerHTML = output;
    });
};
