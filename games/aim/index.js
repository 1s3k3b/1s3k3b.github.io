class Point {
    constructor() {
        this.x = Math.floor(Math.random() * window.innerWidth);
        this.y = Math.floor(Math.random() * window.innerHeight);
        this.size = Math.floor(Math.random() * 20) + 15;
    }
    render(ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(this.x, this.y, this.size, this.size);
        this.size--;
    }
}

const getel = id => document.getElementById(id);
const wait = ms => new Promise(r => setTimeout(r, ms));
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

let assist = !!parseInt(new URLSearchParams(window.location.search).get("assist") || 0);

window.onload = () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);

    let points = [ new Point(), new Point() ];
    const mouse = { x: 0, y: 0 };
    let misses = 0;
    let hits = 0;
    let latestReaction = 0;
    let latestDate = new Date();
    const reactions = [0];

    setInterval(() => {
        points.map((el, i) => [ el, i ]).filter(([ el ]) => !el.size).forEach(([, i ]) => {
            misses++;
            delete points[i];
        });
        points = points.filter(Boolean);

        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, c.width, c.height);
        points.forEach(p => p.render(ctx));
        (() => {
            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.moveTo(mouse.x - 10, mouse.y);
            ctx.lineTo(mouse.x + 10, mouse.y);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1;
            ctx.moveTo(mouse.x, mouse.y - 10);
            ctx.lineTo(mouse.x, mouse.y + 10);
            ctx.stroke();            
        })();
        ctx.font = "15px Arial";
        ctx.fillStyle = "#ffffff";

        let i = 1;
        for (const txt of `
        Hits: ${hits}
        Misses: ${misses}
        Accuracy: ${((((hits || 1) / ((hits || 1) + (misses || 1)) * 100))).toFixed(2)}%
        Reaction time: ${latestReaction.toFixed(2)}s
        Average reaction time: ${(reactions.reduce((a, v) => a + v, 0) / reactions.length).toFixed(2)}s
        Mouse X: ${mouse.x}px
        Mouse Y: ${mouse.y}px
        `.trim().split("\n").map(x => x.trim())) ctx.fillText(txt, 5, 20 * i++);

        if (Math.random() > 0.9 && points.length < 3) points.push(new Point());
    }, 100);

    window.addEventListener("mousedown", e => {
        points = points.filter(Boolean);
        const found = points.map((el, i) => [ el, i ]).find(([ el ]) => (mouse.x > el.x && mouse.x < el.x + el.size) && (mouse.y > el.y && mouse.y < el.y + el.size));
        if (!found) return misses++;
        hits++;
        latestReaction = (Date.now() - latestDate) / 1000;
        latestDate = Date.now();
        reactions.push(latestReaction);
        delete points[found[1]];
    });
    window.addEventListener("mousemove", async e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;

        const _found = points.map((el, i) => [ el, i ]).find(([ el ]) => (mouse.x > el.x && mouse.x < el.x + el.size) && (mouse.y > el.y && mouse.y < el.y + el.size));
        if (assist && !_found && points.length) {
            const sorted = points.sort((a, b) => {
                const o = Math.abs(a.x - mouse.x) > Math.abs(b.x - mouse.x) ? 1 : -1;
                const t = Math.abs(a.y - mouse.y) > Math.abs(b.y - mouse.y) ? 1 : -1;
                return o + t;
            });
            if (Math.abs(sorted[0].x - mouse.x) < 20) mouse.x = sorted[0].x + sorted[0].size / 2;
            if (Math.abs(sorted[0].y - mouse.y) < 20) mouse.y = sorted[0].y + sorted[0].size / 2;
        }
    });
    window.addEventListener("keydown", e => {
        if (e.key === "Alt" && assist && points.length) {
            const rand = points[Math.floor(Math.random() * points.length)];
            mouse.x = rand.x + rand.size / 2;
            mouse.y = rand.y + rand.size / 2;
            points.push(new Point());
        }
    });
};
