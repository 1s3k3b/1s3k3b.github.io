class Line {
    constructor(x = -20) {
        this.x = x;
        this.thickness = Math.floor(Math.random() * 3) + 1;
        this.speed = Math.random(Math.random() * 4) + 2;
    }
    render(ctx) {
        this.x += this.speed;
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = this.thickness;
        ctx.beginPath();
        ctx.moveTo(this.x, 0);
        ctx.lineTo(this.x - window.innerHeight * (45 * Math.PI / 180), window.innerHeight);
        ctx.stroke();
    }
}

const getel = id => document.getElementById(id);
const lines = [];

const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

window.onload = () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);
    
    setInterval(() => {
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        lines.forEach(l => l.render(ctx));
        ctx.fillRect(15, 15, window.innerWidth - 30, window.innerHeight - 30);
    }, 50);
    setInterval(() => lines.push(new Line()), 750);
};
