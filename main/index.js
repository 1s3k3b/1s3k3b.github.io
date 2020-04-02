const getel = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const colors = ["#fa4e4b", "#fae84b", "#4bfa6b", "#4ba8fa", "#f74bfa"];

let reverse = false;
let clicked = false;

let colorIndex = 0;

let i = 1;
let e1 = 3;
let e2 = 3;

const abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

const getChar = () => {
    reverse = false;
    if (i < 9) return "i";
    if (e1 < 9) return "e1";
    if (e2 < 9) return "e2";
    reverse = true;
    return "i";
};
const getCharRev = () => {
    /*if (e2 === 9) return "e2";
    if (e1 === 9) return "e1";
    if (i === 1) {
        reverse = false;
        return;
    }
    return "i";*/
    const vars = [
        {
            name: "e2",
            value: e2
        },
        {
            name: "e1",
            value: e1
        },
        {
            name: "i",
            value: i
        }
    ];
    const sorted = vars.sort((a, b) => b.value - a.value);
    if (Math.max(vars.map(v => v.value)) === 1) {
        reverse = false;
        return;
    }
    return sorted[0].name;
};

const increment = char => {
    const ev = eval(char);
    if (typeof ev === "number" && ev !== 9) return void eval(char + "++");
    if (typeof ev === "string" && abc.indexOf(ev) < abc.length - 1) return void eval(char + " = abc[abc.indexOf(char) + 1]");
};
const decrement = char => {
    const ev = eval(char);
    if (typeof ev === "number" && ev !== 1) return void eval(char + "--");
    if (typeof ev === "string" && abc.indexOf(ev) !== 0) return void eval(char + " = abc[abc.indexOf(char) - 1]");
};

const formatDate = date => `${date.getFullYear()} ${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} ${date.getDate()}`;
const formatTime = time => {
    let hrs = time.getHours() >= 12 ? time.getHours() - 12 : time.getHours();
    if (hrs < 10) hrs = `0${hrs}`;
    return `${hrs}:${(time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes())} ${(time.getHours() >= 12 ? "PM" : "AM")}`
};

const getColor = () => {
    let cColorI = ++colorIndex;
    const cColor = colors[cColorI];
    if (colorIndex >= colors.length) colorIndex = 0;
    return cColor;
};
const equality = () => {
    const sum = i + e1 + e2;
    const el = sum === 27 ? '<a style="color: ' + getColor() + '">' : "<a>";
    return clicked ? " = " + el + sum + "</a>" : "";
};

window.onload = () => {
    console.log("Try clicking on my name on the top. Try going till 27!");
    console.log("Or the wink emoji ;)");
    console.log("You can also visit my website on a time where the hours are the same as the minutes for a surprise");
    console.log("");
    console.log("Thanks for visiting my website btw");
    
    const params = new URLSearchParams(window.location.search);

    const title = getel("title");
    const date = getel("date");
    const time = getel("time");
    const wink = getel("wink");
    

    if (params.get("link")) window.location = atob(params.get("link"));
    if (params.get("meme")) window.location = "https://1s3k3b.github.io/memes?id=" + params.get("meme");
    if (params.get("code")) window.location = "https://1s3k3b.github.io/eval?code" + params.get("code");
    if (window.navigator.platform.includes("Mac") || params.get("rr") == "1") window.location = "https://youtu.be/dQw4w9WgXcQ";
    
    title.addEventListener("click", () => {
        clicked = true;
        if (reverse) decrement(getCharRev());
        else increment(getChar());
    });
    wink.addEventListener("click", async () => {
        wink.classList.add("rotate");
        const interval = setInterval(() => { wink.innerHTML = `<a style="color: ${getColor()}"> ;)</a>` }, 100);
        await wait(1000);
        clearInterval(interval);
        wink.innerHTML = ";)";
        wink.classList.remove("rotate");
    });
    
    setInterval(() => {
        // date.innerHTML = formatDate(new Date());
        title.innerHTML = i + "s" + e1 + "k" + e2 + "b" + equality();
        const currTime = formatTime(new Date());
        if (currTime.split(":")[1].startsWith(currTime.split(":")[0])) time.innerHTML = '<a style="color: ' + getColor() + '">' + currTime + "</a>";
        else time.innerHTML = currTime;
    }, 100);
};
