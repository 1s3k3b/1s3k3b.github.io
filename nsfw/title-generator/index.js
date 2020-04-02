const nameify = name => {
    if (!name) return "";
    if (!name.split(" ")[1]) return name;
    return name.split(" ").map(s => s[0].toUpperCase() + s.substring(1)).join(" ");
};

const nsfwTitle = (name, name2) => [getName(name), getAct(name2), getEvent()].join(" ");

const getName = name => ["Young Amateur", "Fit Babe", "High Ranked Pornstar", "Old Milf", "Slutty Blonde", "Dirty Stepmom", "Dirty Stepsis", "Gay Pornstar", "Gay Amateur", "Gay Stepbro"][Math.floor(Math.random() * 10)] + " " + name;
const getAct = name => ["Sucks " + getPerson(name) + "'s Black Cock", "Rides " + getPerson(name) + "'s Micropenis", "Jerks " + getPerson(name) + " off", "Makes " + getPerson(name) + " Cum " + Math.floor(Math.random() + 1) * 6 + " Times"][Math.floor(Math.random() * 4)];
const getPerson = (name2) => {
    const name = getName(name2 ? name2 : "HeyThanksForCheckingTheSourceCode").split(" ");
    if (!name2) name.pop(); // and now you pop your array to the Warner Brothers
    return name.join(" ");
};
const getEvent = () => ["While Playing Fortnite", "On Christmas", "", "", "", "", ""][Math.floor(Math.random() * 7)];

window.onload = function () { 
    const params = new URLSearchParams(window.location.search);

    let name1 = document.getElementById("input");
    let name2 = document.getElementById("input2");
    const btn = document.getElementById("btn");
    
    const name1p = params.get("1");
    const name2p = params.get("2");
    
    if (name1p) name1.value = name1p;
    if (name2p) name2.value = name2p;
    
    if (name1p) alert(nsfwTitle(nameify(name1.value), nameify(name2.value)));
    
    btn.addEventListener("click", () => {
        if (!name1.value) return;
        alert(nsfwTitle(nameify(name1.value), nameify(name2.value)));
    });
};
