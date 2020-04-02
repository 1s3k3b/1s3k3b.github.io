class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.origX = x;
        this.origY = y;
        this.dest = { x, y };
    }
    render(ctx) {
        this.move();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    move() {
        if (this.x !== this.dest.x) this.x += this.x > this.dest.x ? -1 : 1;
        if (this.y !== this.dest.y) this.y += this.y > this.dest.y ? -1 : 1;
    }
}

const getel = id => document.getElementById(id);
const clamp = n => Math.max(1, Math.min(n, 10));
const wait = ms => new Promise(r => setTimeout(r, ms));
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

const points = new Array(100).fill(new Array(100).fill((x, y) => new Point(x, y))).map((arr, y) => arr.map((fn, x) => fn((x + x) * 3 + 10, (y + y) * 3 + 10))).flat(Infinity);
const mouse = { x: 0, y: 0 };

window.onload = () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);

    setInterval(() => {
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, c.width, c.height);
        points.forEach(p => p.render(ctx));
        ctx.fillStyle = "#fefefe";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        points.forEach(p => {
            p.dest = Math.abs(p.x - mouse.x) < 30 && Math.abs(p.y - mouse.y) < 30 ? { x: mouse.x + (p.x > mouse.x ? 30 : -30), y: mouse.y + (p.x > mouse.x ? 30 : -30) } : { x: p.origX, y: p.origY };
        });
    }, 100);

    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
};
