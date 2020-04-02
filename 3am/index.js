const getel = id => document.getElementById(id);

const recommended = ["Jerk off 🍆💦", "Get high 🌿😎", "Have a snack 🍿🍔", "Watch scary YouTube videos 👻😈"];

window.onload = () => {
    const input = getel("inp");
    const output = getel("outp");
    const btn = getel("btn");
    const add = getel("add");
    
    add.addEventListener("click", () => { input.value += (input.value.charAt(input.value.length - 1) === "\n" ? "" : (input.value.charAt(input.value.length - 1) ? "\n" : "")) + recommended[Math.floor(Math.random() * recommended.length)] + "\n" });
    btn.addEventListener("click", () => {
        const choices = input.value.split("\n");
        output.value = choices[Math.floor(Math.random() * choices.length)];
    });
};
