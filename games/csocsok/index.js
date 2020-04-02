class Ball {
    constructor(dX) {
        this.x = () => window.innerWidth / 2 - 100 + dX;
        this.y = () => window.innerHeight / 2 - 100;
        this.ball = {
            oX: () => window.innerWidth / 2 - 20 + dX - 20,
            oY: () => window.innerHeight / 2 - 20 - 20,
            dXdY: () => {
                if (i > 8) return i % 2 ? [ 1, -1 ] : [-1, 1 ];
                if (i > 6) return i % 2 ? [-1, -1 ] : [ 1, 1 ];
                if (i > 4) return i % 2 ? [-1,  0 ] : [ 1, 0 ];
                if (i > 2) return i % 2 ? [ 0, -1 ] : [ 0, 1 ];
                           return i % 2 ? [-1,  0 ] : [ 1, 0 ];
            },
            render(ctx) {
                const [ x, y ] = this.dXdY().map((n, i) => [this.oX, this.oY][i]() - 20 + n * 4);
                ctx.beginPath();
                ctx.fillStyle = "#00ff00";
                ctx.arc(x, y, 20, 0, Math.PI * 2);
                ctx.fill();
            }
        };
    }
    render(ctx) {
        const [ x, y ] = this.ball.dXdY().map(n => n * 1.2);
        ctx.beginPath();
        ctx.fillStyle = "#0000ff";
        ctx.arc(this.x() + x, this.y() + y, 100, 0, Math.PI * 2);
        ctx.fill();
        this.ball.render(ctx);
    }
}

const getel = id => document.getElementById(id);
let i = 0;
let j = 0;
const balls = [ new Ball(-100), new Ball(100) ];

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
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        balls.forEach(b => b.render(ctx));
        if (j++ % 2) i++;
        if (i > 10) i = 0; 
    }, 100);
};
