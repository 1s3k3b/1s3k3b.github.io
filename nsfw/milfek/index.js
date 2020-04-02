const getel = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));

const names = ["Hanna", "Anna", "Zoé", "Luca", "Emma", "Zsófia", "Jázmin", "Nóra", "Boglárka", "Léna", "Maja", "Lili", "Gréta", "Laura", "Izabella", "Mira", "Fanni", "Dorina", "Lilla", "Dóra"];
const genName = () => names[Math.floor(Math.random() * names.length)] + ` (${Math.floor(Math.random() * 40) + 30}) ${(Math.random() * 100).toFixed(1)} kilométerre tőled`;

window.onload = async () => {
    const outp = getel("outp");
    outp.value = "🔞🍑🍌💦 SZEXI MILFEK KÖRÜLÖTTED 🔞🍑🍌💦\n\n";
    while (true) {
        const toWait = (Math.floor(Math.random() * 3) + 1) * 1000;
        outp.value += genName() + "\n.";
        await wait(toWait / 3);
        outp.value += ".";
        await wait(toWait / 3);
        outp.value += ".";
        await wait(toWait / 3);
        outp.value = outp.value.slice(0, -3);
    }
};
