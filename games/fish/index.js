const COLORS = ["#dff69e", "#00ceff", "#002bca", "#ff00e0", "#3f159f", "#71b583", "#00a2ff"];

class SObject {
    constructor() {
        this.x = window.innerWidth;
        this.y = Math.floor(Math.random() * window.innerHeight);
        this.size = Math.floor(Math.random() * 14) + 6;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    render(ctx) {
        this.x -= getMovement(mouse.x);
        this.y -= mouse.y > (((window.innerHeight / 2) - (fish.h / 2)) + fish.dY) + (fish.h / 2) ?
          -2 :
          mouse.y === (((window.innerHeight / 2) - (fish.h / 2)) + fish.dY) + (fish.h / 2) ?
            0 :
            2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

const getel = id => document.getElementById(id);
const clamp = (n, mi, ma) => Math.max(mi, Math.min(n, ma));
const wait = ms => new Promise(r => setTimeout(r, ms));
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

const getMovement = x => 
  x < window.innerWidth / 4 ?
    5 :
    x < window.innerWidth / 2 ?
      6 :
      x < window.innerWidth / 1.5 ?
        8 :
        10;
const getWidth = x => 
  x < window.innerWidth / 4 ?
    40 :
    x < window.innerWidth / 2 ?
      50 :
      x < window.innerWidth / 1.5 ?
        60 :
        80;
const getHeight = x => 
  x < window.innerWidth / 4 ?
    80 :
    x < window.innerWidth / 2 ?
      60 :
      x < window.innerWidth / 1.5 ?
        50 :
        40;
const getX = x => 
  x < window.innerWidth / 4 ?
    -30 :
    x < window.innerWidth / 2 ?
      0 :
      x < window.innerWidth / 1.5 ?
        15 :
        30;
const getColor = x => 
  x < window.innerWidth / 4 ?
    "#00d0ff" :
    x < window.innerWidth / 2 ?
    "#8b5af5" :
      x < window.innerWidth / 1.5 ?
        "#c80af5" :
        "#e100ff";

const mouse = { x: 0, y: 0 };
const fish = {
    x: window.innerWidth / 2 - 40,
    dY: 0,
    w: 80,
    h: 80,
    dir: 0,
    render(ctx) {
        const incY = mouse.y > (((window.innerHeight / 2) - (this.h / 2)) + this.dY) + (this.h / 2) ?
          1 :
          mouse.y === (((window.innerHeight / 2) - (this.h / 2)) + this.dY) + (this.h / 2) ?
            0 :
            -1;
        this.dir += incY * 2 * Math.PI / 180;
        this.dir = clamp(this.dir * (180 / Math.PI), -3, 3) * Math.PI / 180;
        this.dY += incY * 2;
        this.x += getX(mouse.x);
        this.w = getWidth(mouse.x);
        this.h = getHeight(mouse.x);
        this.x = clamp(this.x, 200, (window.innerWidth - 200) - this.w / 2);
        ctx.beginPath();
        ctx.fillStyle = getColor(mouse.x);
        ctx.save();
        ctx.rotate(this.dir);
        ctx.fillRect(this.x, ((window.innerHeight / 2) - (this.h / 2)) + this.dY, this.w, this.h);
        ctx.restore();
    }
};
const objects = [];

window.onload = () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);

    setInterval(() => {
        const grad = ctx.createLinearGradient(0, 0,  c.width, c.height);
        grad.addColorStop(0, "#8ee4ae");
        grad.addColorStop(1, "#e9eba3");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, c.width, c.height);
        objects.forEach(o => o.render(ctx));
        fish.render(ctx);
        (() => {
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.moveTo(mouse.x - 10, mouse.y);
            ctx.lineTo(mouse.x + 10, mouse.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 1;
            ctx.moveTo(mouse.x, mouse.y - 10);
            ctx.lineTo(mouse.x, mouse.y + 10);
            ctx.stroke();            
        })();
        if (Math.random() > 0.75) objects.push(new SObject());
    }, 100);

    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
};
