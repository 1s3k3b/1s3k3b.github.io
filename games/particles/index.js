const getColor = ({ y }) => {
    if (y < window.innerHeight / 4) return "#00ff44";
    if (y < window.innerHeight / 2) return "#00bb99";
    if (y < window.innerHeight / 1.5) return "#ff00ff";
    return "#d2ff40";
};

const sqrt = n => {
    const s = Math.sqrt(Math.abs(n));
    return n < 0 ? -s : s;
};
const cbrt = n => {
    const c = Math.cbrt(Math.abs(n));
    return n < 0 ? -c : c;
};

class Particle {
    constructor(x = Math.floor(Math.random() * window.innerWidth), y = Math.floor(Math.random() * window.innerHeight)) {
        this.x = x;
        this.y = y;
        this.forces = {
            x: 0,
            y: 0
        };
        this.dest = {
            x: this.x,
            y: this.y
        };
        this.color = ["#ff00ff", "#00ff44", "#ffff2b"][Math.floor(Math.random() * 4)];
        
        setInterval(() => {
            if (this.forces.x && Math.abs(this.x - this.dest.x) > 3) {
                const minX = cbrt(this.forces.x);
                this.x += minX;
                this.forces.x -= minX;
            }
            if (this.forces.y && Math.abs(this.y - this.dest.y) > 3) {
                const minY = cbrt(this.forces.y);
                this.y += minY;
                this.forces.y -= minY
            }
        }, 50);
    }
    addForce({ x = 0, y = 0 }, { x: desX = 0, y: desY = 0 }) {
        this.forces.x = cbrt(this.forces.x) + x;
        this.forces.y = cbrt(this.forces.y) + y;
        this.dest.x = desX;
        this.dest.y = desY;
    }
    render(ctx) {
        /* this.x = this.x + ((0.5 - Math.random()) / 2);
        this.y = this.y + ((0.5 - Math.random()) / 2); */
        
        if (this.x <= 0) this.x = 1;
        if (this.x > window.innerWidth) this.x = window.innerWidth - 4;
        
        if (this.y <= 0) this.y = 1;
        if (this.y > window.innerHeight) this.y = window.innerHeight - 4;
        
        ctx.beginPath();
        ctx.fillStyle = getColor(this);
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    calculateOffset(x, y) {
        return { x: x - this.x, y: y - this.y };
    }
    calculateNegOffset(x, y) {
        return { x: this.x - x, y: this.y - y };
    }
}

const getel = id => document.getElementById(id);

const particles = new Array(500).fill(() => new Particle()).map(x => x());
const mouse = {
    x: 0,
    y: 0
};

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
        ctx.fillRect(0, 0, c.width, c.height);
        particles.forEach(p => p.render(ctx));
        ctx.fillStyle = "#fefefe";
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.font = "15px Arial";
        ctx.fillStyle = "#ffffff";
        let i = 1;
        for (const txt of `
        Particles: ${particles.length}
        Mouse X: ${mouse.x}px
        Mouse Y: ${mouse.y}px
        `.trim().split("\n").map(x => x.trim())) ctx.fillText(txt, 5, 20 * i++);
    }, 50);
    
    document.body.addEventListener("click", e => particles.push(...new Array(Math.floor(Math.random() * 10) + 10).fill(() => new Particle(mouse.x, mouse.y)).map(fn => fn())) && particles.forEach(p => p.addForce(p.calculateNegOffset(mouse.x, mouse.y), mouse)));
    document.body.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        particles.forEach(p => p.addForce(p.calculateOffset(mouse.x, mouse.y), mouse));
    });
};
