const getel = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));

const countValues = arr => {
    const map = new Map();
    const obj = {};

    arr.forEach(val => {
        map.set(val, map.get(val) ? map.get(val) + 1 : 1);
        obj[val] = map.get(val);
    });

    return obj;
};

Array.prototype.max = function() {
    return Math.max.apply(null, this.map(Number));
};

async function* play(text) {
    let emojis = text.match(/[^\u0000-\u00ff]/g);
    
    if (!emojis || emojis.length < 6) {
        yield "You must give at least 6 emojis to play slots!";
        return;
    }
    
    emojis = Array.from(new Set(emojis)).filter((_, i) => i <= 20);
     if (emojis.length < 6) {
        yield "You must give at least 6 emojis to play slots!";
        return;
    }

    const rng1 = Math.floor(Math.random() * emojis.length);
    const rng2 = Math.floor(Math.random() * emojis.length);
    const rng3 = Math.floor(Math.random() * emojis.length);
    
    let choice1;
    let choice2;
    let choice3;

    yield `SLOTS\n${(emojis[0] + " ").repeat(3).slice(0, -1)}`;

    for (let i = 0; i < emojis.length; i++) {
        if (i >= emojis.length) return clearInterval(interval);

        if (rng1 === i) choice1 = emojis[i];
        if (rng2 === i) choice2 = emojis[i];
        if (rng3 === i) choice3 = emojis[i];

        const em1 = (choice1 ? choice1 : emojis[i]);
        const em2 = (choice2 ? choice2 : emojis[i]);
        const em3 = (choice3 ? choice3 : emojis[i]);

        const contStr = `SLOTS\n${em1} ${em2} ${em3}`;
        let finStr = `SLOTS\n${choice1} ${choice2} ${choice3}`;
   
        if (Object.values(countValues([ choice1, choice2, choice3 ])).max() !== 1) finStr += `\n\nY O U  W O N!\n${Object.values(countValues([ choice1, choice2, choice3 ])).max()} of the same emoji!`;
        else finStr += `\n\nYou lost!\ntrash lmao`;

        if (i === emojis.length - 1) yield finStr;
        else yield contStr;

        await wait(250);
    }
}

window.onload = async () => {
    const outp = getel("outp");
    
    for await (const res of play(prompt("Give 6 to 20 emojis to play"))) outp.value = res;
};
