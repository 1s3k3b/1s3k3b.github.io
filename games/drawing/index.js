const getel = id => document.getElementById(id);
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};
const mouse = { x: 0, y: 0 };
window.onload = () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);
    setInterval(() => {
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.fillStyle = "#fefefe";
        ctx.arc(mouse.x, mouse.y, 0, 0, Math.PI * 2);
        ctx.fill();
    }, 100);
    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
};
