const getel = id => document.getElementById(id);
const COLORS = ['#ff4d40', '#ff7340', '#ff9640', '#ffc240', '#ffdc40', '#f2ff40', '#cfff40', '#a3ff40', '#7cff40', '#53ff40', '#40ff53', '#40ff70', '#40ff9f', '#40ffd2', '#40f9ff', '#40b6ff', '#408fff', '#4069ff', '#4340ff', '#5c40ff', '#8340ff', '#ac40ff', '#d640ff', '#ff40ef', '#ff40af', '#ff407c', '#ff4050'];

class Point {
    constructor(x = Math.floor(Math.random() * window.innerWidth), y = -10, size = Math.floor(Math.random() * 15) + 13) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    render(ctx) {
        this.y += Math.floor(Math.cbrt(this.size)) / 2;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

const reset = () => {
    points = [];
    player.x = window.innerWidth / 2;
    player.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    player.keyPressed = undefined;
};

let points = [];
const removePoints = () => {
    points
        .map((el, i) => [ el, i ])
        .filter(([ el ]) => el.y > window.innerHeight)
        .forEach(([, i ]) => { delete points[i]; });
    points = points.filter(Boolean);
};
const mouse = { x: 0, y: 0 };
const player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 1.5,
    w: 40,
    h: 40,
    keyPressed: undefined,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    render(ctx) {
        this.y = window.innerHeight / 1.5;
        if (this.keyPressed === 'r' && this.x + this.w <= window.innerWidth - 5) this.x += 1;
        if (this.keyPressed === 'l' && this.x >= 5) this.x -= 1;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.check() && reset(alert('You died.'));
    },
    check() {
        return points.some(p =>
            p.x <= this.x + this.w && p.x + p.size >= this.x &&
            p.y <= this.y + this.h && p.y + p.size >= this.y,
        );
    },
};

const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue('height')
        .slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue('width')
        .slice(0, -2);

    c.setAttribute('height', height * dpi);
    c.setAttribute('width', width * dpi);
};
window.onload = () => {
    const c = getel('c');
    const ctx = c.getContext('2d');
    fixDpi(c);

    setInterval(() => {
        ctx.fillStyle = '#232323';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = '#fefefe';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        player.render(ctx);
        if (Math.random() > 0.95) points.push(new Point());
        points.forEach(p => p.render(ctx));
        removePoints();
    }, 1);
    window.addEventListener('mousemove', e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
    window.addEventListener('keydown', e => {
        if (['KeyA', 'ArrowLeft'].includes(e.code)) player.keyPressed = 'l';
        if (['KeyD', 'ArrowRight'].includes(e.code)) player.keyPressed = 'r';
    });
    window.addEventListener('keyup', e => {
        if (['KeyA', 'ArrowLeft'].includes(e.code)) player.keyPressed = undefined;
        if (['KeyD', 'ArrowRight'].includes(e.code)) player.keyPressed = undefined;
    });
};
