const sqrt = n => {
    const s = Math.sqrt(Math.abs(n));
    return n < 0 ? -s : s;
};
const cbrt = n => {
    const c = Math.cbrt(Math.abs(n));
    return n < 0 ? -c : c;
};

class Point {
    constructor(x = Math.floor(Math.random() * window.innerWidth / 2), y = Math.floor(Math.random() * window.innerHeight / 2)) {
        this.x = x;
        this.y = y;
        this.forces = {
            x: 0,
            y: 0,
        };
        this.dest = {
            x: this.x,
            y: this.y,
        };

        setInterval(() => {
            if (this.forces.x && Math.abs(this.x - this.dest.x) > 3) {
                const minX = cbrt(this.forces.x);
                this.x += minX;
                this.forces.x -= minX;
            }
            if (this.forces.y && Math.abs(this.y - this.dest.y) > 3) {
                const minY = cbrt(this.forces.y);
                this.y += minY;
                this.forces.y -= minY;
            }
        }, 50);
    }
    addForce({ x = 0, y = 0 }, { x: desX = 0, y: desY = 0 }) {
        this.forces.x = cbrt(this.forces.x) + x;
        this.forces.y = cbrt(this.forces.y) + y;
        this.dest.x = desX;
        this.dest.y = desY;
    }
    calculateOffset(x, y) {
        return { x: x - this.x, y: y - this.y };
    }
    calculateNegOffset(x, y) {
        return { x: this.x - x, y: this.y - y };
    }
    render(ctx, points) {
        if (this.x <= 0) this.x = 1;
        if (this.x > window.innerWidth) this.x = window.innerWidth - 4;

        if (this.y <= 0) this.y = 1;
        if (this.y > window.innerHeight) this.y = window.innerHeight - 4;

        /* ctx.beginPath();
        ctx.fillStyle = "#ffffff";
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill(); */

        points.forEach(p => {
            ctx.beginPath();
            ctx.strokeStyle = '#ffffff';
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        });
    }
}

const getel = id => document.getElementById(id);

const points = new Array(2).fill(() => new Point())
    .map(x => x());
const mouse = {
    x: 0,
    y: 0,
};
let key;

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
        ctx.fillRect(0, 0, c.width, c.height);
        points.forEach(p => p.render(ctx, points));
        ctx.fillStyle = '#fefefe';
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        let args;
        switch (key) {
        case 'up':
            args = p => [p.calculateNegOffset(0, -1), p.calculateNegOffset(0, -1)];
            break;
        case 'down':
            args = p => [p.calculateNegOffset(0, 1), p.calculateNegOffset(0, 1)];
            break;
        case 'left':
            args = p => [p.calculateNegOffset(-1, 0), p.calculateNegOffset(-1, 0)];
            break;
        case 'right':
            args = p => [p.calculateNegOffset(1, 0), p.calculateNegOffset(1, 0)];
            break;
        }
        if (args) {
            for (const _ of new Array(Math.floor(cbrt(points.length))).fill()) {
                const rand = points[Math.floor(Math.random() * points.length)];
                rand.addForce(...args(rand));
            }
        }

        ctx.font = '15px Arial';
        ctx.fillStyle = '#ffffff';
        let i = 1;
        for (const txt of `
        Points: ${points.length}
        Mouse X: ${mouse.x}px
        Mouse Y: ${mouse.y}px
        `.trim().split('\n')
            .map(x => x.trim())) ctx.fillText(txt, 5, 20 * i++);
    }, 1);
    setInterval(() => points.push(new Point()), 15000);

    document.body.addEventListener('click', e => points.push(new Point(mouse.x, mouse.y)) && points.forEach(p => p.addForce(p.calculateNegOffset(mouse.x, mouse.y), mouse)));
    document.body.addEventListener('mousemove', e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        for (const _ of new Array(Math.floor(cbrt(points.length))).fill()) {
            const rand = points[Math.floor(Math.random() * points.length)];
            rand.addForce(rand.calculateOffset(mouse.x, mouse.y), mouse);
        }
    });
    document.body.addEventListener('touchstart', e => {
        e.preventDefault();
        points.push(new Point(mouse.x, mouse.y));
        points.forEach(p => p.addForce(p.calculateNegOffset(mouse.x, mouse.y), mouse));
    });
    document.body.addEventListener('touchmove', e => {
        e = e.touches[0];
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        for (const _ of new Array(Math.floor(cbrt(points.length))).fill()) {
            const rand = points[Math.floor(Math.random() * points.length)];
            rand.addForce(rand.calculateOffset(mouse.x, mouse.y), mouse);
        }
    });
    document.body.addEventListener('keydown', e => {
        switch (`${e.code}`) {
        case 'KeyW':
        case 'ArrowUp':
            key = 'up';
            break;
        case 'KeyS':
        case 'ArrowDown':
            key = 'down';
            break;
        case 'KeyA':
        case 'ArrowLeft':
            key = 'left';
            break;
        case 'KeyD':
        case 'ArrowRight':
            key = 'right';
            break;
        }
    });
    document.body.addEventListener('keyup', () => key = null);
};
