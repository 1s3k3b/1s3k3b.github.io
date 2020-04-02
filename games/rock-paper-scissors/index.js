const getel = id => document.getElementById(id);
let mode = 0;
const beats = {
    rock: "paper",
    paper: "scissors",
    scissors: "rock"
};

window.onload = () => {
    const btn = getel("btn");
    const boxes = ["rock", "paper", "scissors"].map(getel);
    const modeDrp = getel("mode");
    const output = getel("output");
    
    boxes.forEach(b => b.addEventListener("click", () => {
        boxes.forEach(bb => {
            bb.checked = false;
        });
        b.checked = true;
    }));
    btn.addEventListener("click", () => {
    	mode = modeDrp.selectedIndex;
        const checkedBox = boxes.find(b => b.checked);
        if (!checkedBox) return;
        const checked = checkedBox.id;
        const responses = [["rock", "paper", "scissors"][Math.floor(Math.random() * 3)], [beats[checked], "rock", "paper", "scissors"][Math.floor(Math.random() * 4)], [beats[checked], beats[checked], "rock", "paper", "scissors"][Math.floor(Math.random() * 5)]];
        const response = responses[mode];
        const beatsText = beats[response] === checked ? checked + " beats " + response + "...\nYou win!" : (response === checked ? "Both " + response + "...\n\nIt's a tie!" : response + " beats " + checked + "!\nBot wins!");
        output.value = "You: " + checked + "\nBot: " + response + "\n\n" + beatsText;
    });
};
