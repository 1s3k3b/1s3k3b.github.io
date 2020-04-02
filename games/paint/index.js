const getel = id => document.getElementById(id);
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

let points = [];
const mouse = { x: 0, y: 0, down: false, disp: true };

const randomColor = () => "#" + Math.floor(Math.random() * 0xFFFFFF) + 1;
const invertColor = hex => {
    const padZero = (str, len = 2) => (new Array(len).join("0") + str).slice(-len);
    if (hex.indexOf('#') === 0) hex = hex.slice(1);
    if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
    const g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
    const b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(b);
};
const COLORS = ["#ff4d40", "#ff7340", "#ff9640", "#ffc240", "#ffdc40", "#f2ff40", "#cfff40", "#a3ff40", "#7cff40", "#53ff40", "#40ff53", "#40ff70", "#40ff9f", "#40ffd2", "#40f9ff", "#40b6ff", "#408fff", "#4069ff", "#4340ff", "#5c40ff", "#8340ff", "#ac40ff", "#d640ff", "#ff40ef", "#ff40af", "#ff407c", "#ff4050"];

let color = "#ffffff";
let lineWidth = 1;

let erasing = false;

window.onload = () => {
    const c = getel("c");
    const lineWidthEl = getel("linew");
    const colorEl = getel("color");
    const eraser = getel("eraser");
    const downl = getel("downl");
    const reset = getel("reset");
    const randcol = getel("randc");

    const ctx = c.getContext("2d");
    fixDpi(c)

    setInterval(() => {
        color = colorEl.value;
        erasing = eraser.checked;
        lineWidth = +lineWidthEl.value + (erasing ? 2 : 0);
        getel("linewd").innerText = lineWidth;

        ctx.beginPath();
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, c.width, c.height);

        points.forEach(arr => arr.forEach((p, i) => {
            const next = arr[i + 1] || p;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = p.lineWidth;
            ctx.beginPath();
            ctx.moveTo(next.x, next.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
        }));

        ctx.fillStyle = "#ffffff"; // invertColor(color);
        if (erasing && mouse.disp) {
            ctx.beginPath();
            ctx.fillRect(mouse.x + lineWidth / 2, mouse.y + lineWidth / 2, lineWidth, lineWidth);
        } else if (mouse.disp) {
            ctx.beginPath();
            ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }, 100);

    window.addEventListener("mousemove", async e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        if (mouse.down) {
            if (!erasing) points[points.length - 1].push({ x: mouse.x, y: mouse.y, lineWidth, color });
            else {
                points.forEach((arr, arrI) => 
                  arr
                    .map((el, i) => [el, i])
                    .filter(([ el ]) =>
                      el.x >= mouse.x - lineWidth / 2 && el.x <= mouse.x + lineWidth / 2 &&
                      el.y >= mouse.y - lineWidth / 2 && el.y <= mouse.y + lineWidth / 2
                    )
                    .forEach(([, i ]) => delete points[arrI][i])
                );
                points = points.filter(arr => arr.filter(Boolean));
            }
        }
    });
    c.addEventListener("mousedown", () => {
        mouse.down = true;
        points.push([]);
    });
    c.addEventListener("mouseup", () => { mouse.down = false });
    c.addEventListener("contextmenu", e => e.preventDefault());
    downl.addEventListener("click", () => {
        mouse.disp = false;

        const dataURL = c.toDataURL("image/png");
        const element = document.createElement("a");
        element.setAttribute("href", dataURL);
        element.setAttribute("download", ((prompt("Enter a filename", "paint") || "paint") + ".png").replace(/(\.png)+$/, ".png"));
          
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

        mouse.disp = true;
    });
    reset.addEventListener("click", () => {
        if (!confirm("Are you sure you want to reset?")) return;
        points = [];
        eraser.checked = false;
        erasing = false;
        color = "#ffffff";
        colorEl.value = "#ffffff";
        lineWidth = 1;
        lineWidthEl.value = 1;
    });
    randcol.addEventListener("click", () => { colorEl.value = COLORS[Math.floor(Math.random() * COLORS.length)] });
    window.onbeforeunload = () => true;
};
