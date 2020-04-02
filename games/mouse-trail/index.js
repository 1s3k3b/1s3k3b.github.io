const getel = id => document.getElementById(id);
const clamp = (n, mi, ma) => Math.min(Math.max(n, mi), ma);
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

const mouse = { x: 0, y: 0 };
const mouses = [];

const getSpread = () => mouses.reduce((a, v, i) => a + (v.x - (mouses[i + 1] || mouses[i - 1] || { x: v.x }).x), 0) / mouses.length;
const clearMouses = () => {
    while (mouses.length > COLORS.length - 1 + getSpread() / 2) mouses.shift();
};
const wiggleMouses = () => mouses.forEach(m => m.y += (0.5 - Math.random()) * wiggleLevel);

let COLORS = ["#ff4d40", "#ff7340", "#ff9640", "#ffc240", "#ffdc40", "#f2ff40", "#cfff40", "#a3ff40", "#7cff40", "#53ff40", "#40ff53", "#40ff70", "#40ff9f", "#40ffd2", "#40f9ff", "#40b6ff", "#408fff", "#4069ff", "#4340ff", "#5c40ff", "#8340ff", "#ac40ff", "#d640ff", "#ff40ef", "#ff40af", "#ff407c", "#ff4050"];
let bgColor = "#232323";
let wiggle;
let wiggleLevel = 2;
let lineWidth = 1;

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    wiggle = !!parseInt(params.get("wiggle") || "0");
    wiggleLevel = clamp(parseInt(params.get("wiggleLevel") || "2"), 1, 50);
    lineWidth = clamp(parseInt(params.get("lineWidth") || "1"), 1, 15);

    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);
    const emit = () => {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < mouses.length; i++) {
            const m = mouses[i];
            const next = mouses[i + 1] || mouse;
            ctx.beginPath();
            ctx.strokeStyle = COLORS[i];
            ctx.lineWidth = lineWidth;
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
        }
        clearMouses();
        if (wiggle) wiggleMouses();

        ctx.font = "15px Arial";
        ctx.fillStyle = "#ffffff";
        let i = 1;
        for (const txt of `
        Mouse X: ${mouse.x}px
        Mouse Y: ${mouse.y}px
        Background color: ${bgColor} (left-click: change, right-click: reset)
        Wiggle: ${wiggle ? "yes" : "no"} (w: toggle)
        Wiggle level: ${wiggleLevel} (p: increase, m: decrease)
        Line width: ${lineWidth} (i: increase, d: decrease)
        `.trim().split("\n").map(x => x.trim())) ctx.fillText(txt, 5, 20 * i++);
    };
    setInterval(emit, 100);
    window.addEventListener("mousemove", async e => {
        mouses.push({ x: mouse.x, y: mouse.y });
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        emit();
    });
    window.addEventListener("keydown", e => {
        if (e.code === "KeyW") wiggle = !wiggle;
        if (["KeyP", "KeyM"].includes(e.code)) wiggleLevel = clamp(wiggleLevel + (e.code === "KeyP" ? 1 : -1), 1, 50);
        if (["KeyI", "KeyD"].includes(e.code)) lineWidth = clamp(lineWidth + (e.code === "KeyI" ? 1 : -1), 1, 15);
        if (["KeyC", "KeyR"].includes(e.code)) COLORS = COLORS.reverse();
    });
    c.addEventListener("mousedown", () => {
        let found = mouses.map((el, i) => [ el, i ]).sort(([ a ], [ b ]) => {
            const o = Math.abs(a.x - mouse.x) > Math.abs(b.x - mouse.x) ? 1 : -1;
            const t = Math.abs(a.y - mouse.y) > Math.abs(b.y - mouse.y) ? 1 : -1;
            return o + t;
        });
        if (Math.abs(found[0][0].x - mouse.x) < 10 && Math.abs(found[0][0].y - mouse.y) < 10) found = found[0];
        else found = (() => {
            const n = Math.floor(Math.random() * mouses.length);
            return [ mouses[n], n ];
        })();
        bgColor = COLORS[found[1]];
    });
    c.addEventListener("contextmenu", e => {
        e.preventDefault();
        bgColor = "#232323";
    });
};
