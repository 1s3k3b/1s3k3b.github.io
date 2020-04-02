const textStairs = text => {
    let currStr = "";
    const finArr = [];

    for (let i = 0; i < text.length; i++) {
        currStr += text[i];
        finArr.push(currStr);
    }
    
    finArr.filter((pappa, i, a) => i !== a.length - 1).reverse().map(v => finArr.push(v));

    return finArr.join("\n");
};

window.onload = () => {
    const text = document.getElementById("text");
    
    document.getElementById("btn").addEventListener("click", () => {
        if (!text.value) return;
        
        alert("Please don't post these comments on YouTube, noone likes those cringy shit, except the <12 year olds who give it 4k likes at least. Please tell me you're only at this site for fun.");
        
        document.getElementById("output").value = textStairs(text.value);
    });
};
