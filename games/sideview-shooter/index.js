const getel = id => document.getElementById(id);

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    render(ctx) {
        this.x += 10;
        ctx.beginPath();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 5;
        ctx.moveTo(this.x - 20, this.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    }
}

class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.moving = 0;
    }
    render(ctx) {
        this.x -= 5;
        if (!this.moving && Math.random() > 0.91) this.moving = [ -1, 1 ][Math.floor(Math.random() * 2)];
        if (this.moving && Math.random() > 0.91) this.moving = 0;
        if (this.moving) {
            if (this.moving === -1 && this.y > 0) this.y -= 5;
            else if (this.y + 40 < window.innerHeight) this.y += 5;
        }
        ctx.beginPath();
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(this.x, this.y, 40, 40);
    }
}

let bullets = [];
let enemies = [];
const mouse = { x: 0, y: 0 };

let score = 0;
let lives = 3;
let misses = 0;

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
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
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
        bullets.forEach(b => b.render(ctx));
        enemies.forEach(e => e.render(ctx));

        ctx.font = "15px Arial";
        ctx.fillStyle = "#000000";
        let i = 1;
        for (const txt of `
        Score: ${score}
        Misses: ${misses}
        Accuracy: ${((((score || 1) / ((score || 1) + (misses || 1)) * 100))).toFixed(2)}%
        Lives: ${"x".repeat(lives)}
        Enemies alive: ${enemies.length}
        `.trim().split("\n").map(x => x.trim())) ctx.fillText(txt, 5, 20 * i++);

        if (Math.random() > 0.95) enemies.push(new Enemy(window.innerWidth, Math.floor(Math.random() * window.innerHeight)));

        bullets.map((el, i) => [ el, i ]).map(([ b, i ]) => {
            const found = enemies.map((e, ei) => [ e, ei ]).find(([ e ]) => 
                b.x + 10 >= e.x && b.x + 10 <= e.x + 40 &&
                b.y >= e.y && b.y <= e.y + 40
            );
            if (found) return [ found, [ b, i ] ];
            return false;
        }).filter(Boolean).forEach(( [ [, enemyI ], [, bulletI ] ] ) => {
            delete enemies[enemyI];
            delete bullets[bulletI];
            score++;
        });
        bullets = bullets.filter(Boolean);
        enemies = enemies.filter(Boolean);

        const _foundE = enemies.map((el, i) => [ el, i ]).find(([ e ]) => e.x <= 0);
        if (_foundE) {
            lives--;
            delete enemies[_foundE[1]];
        }
        if (lives <= 0) {
            alert("Game over!");
            enemies = [];
            bullets = [];
            score = 0;
            lives = 3;
            misses = 0;
        }
        const _foundB = bullets.map((el, i) => [ el, i ]).find(([ b ]) => b.x + 40 >= window.innerWidth);
        if (_foundB) {
            misses++;
            delete bullets[_foundB[1]];
        }
        bullets = bullets.filter(Boolean);
        enemies = enemies.filter(Boolean);
    }, 100);
    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
    window.addEventListener("mousedown", () => bullets.push(new Bullet(0, mouse.y)));
};
