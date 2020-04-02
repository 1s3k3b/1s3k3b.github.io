class Flake {
    constructor(x = Math.floor(Math.random() * window.innerWidth), y = -10, size = Math.floor(Math.random() * 11)) {
        this.x = x;
        this.y = y;
        this.dX = Math.floor(Math.random() * 0.5) * 2;
        this.size = size;
        this.render = ctx => {
            this.x += Math.random() > 0.5 ? (0.5 - Math.random()) : Math.random() > 0.5 ? this.dX : 0;
            this.y = this.y + Math.floor(Math.sqrt(this.size)) + Math.floor(Math.random() * 2) + 1;
            ctx.beginPath();
            ctx.fillStyle = "#fefefe";
            ctx.arc(this.x, this.y, Math.cbrt(this.size) / 2, 0, Math.PI * 2);
            ctx.fill();
        };
    }
}

const getel = id => document.getElementById(id);

let flakes = [];
let runtime = 0;

const countDifference = () => {
    const date = new Date();
    const christmas = new Date(date.getFullYear() + "/12/24");
    
    const ms = christmas - date;
    
    const seconds = Math.floor(Math.floor(ms / 1000) % 60);
    const minutes = Math.floor(Math.floor(ms / 1000) / 60) % 60;
    const hours = Math.floor(Math.floor(Math.floor(ms / 1000) / 60) / 60) % 24;
    const days = Math.floor(Math.floor(Math.floor(Math.floor(ms / 1000) / 60) / 60) / 24);
    
    return { seconds, minutes, hours, days };
};

const removeFlakes = () => {
    flakes
    .map((el, i) => [ el, i ])
    .filter(([ el ]) => el.y > window.innerHeight)
    .forEach(([, i ]) => { delete flakes[i]; });
    flakes = flakes.filter(Boolean);
}
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

window.onload = async () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);
    
    setInterval(async () => {
        ctx.fillStyle = "#002244";
        ctx.fillRect(0, 0, c.width, c.height);
        flakes.forEach(f => f.render(ctx));
            
        const diff = countDifference();
        Object.keys(diff).forEach(k => {
            getel(k).innerHTML = diff[k] + "<br>" + k.toUpperCase() + "<br><br>";
        });
        runtime++;
        removeFlakes(removeFlakes());
    }, 50);
    setInterval(() => flakes.push(new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake(), new Flake()) && removeFlakes(), 50);
};
