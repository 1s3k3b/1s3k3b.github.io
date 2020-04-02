const scaleImg = img => {
    const maxWidth = 80;
    const maxHeight = 80;
    let ratio = 0;
    let { width, height } = img;

    if (width > maxWidth) {
        ratio = maxWidth / width;
        img.setAttribute("width", maxWidth);
        img.setAttribute("height", height * ratio);
        height = height * ratio;
        width = width * ratio;
    }
    if (height > maxHeight) {
        ratio = maxHeight / height;
        img.setAttribute("height", maxHeight);
        img.setAttribute("width", width * ratio);
        width = width * ratio;
        height = height * ratio;
    }
};
const crown = new Image();
crown.src = "https://pub-static.haozhaopian.net/assets/stickers/crowns_zyw_20170111_06/20a1a526-e723-4acf-a59d-f0cddea5bc11_medium_thumb.jpg";
crown.onload = () => scaleImg(crown);

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.origX = x;
        this.origY = y;
        this.dest = { x, y };
    }
    render(ctx) {
        this.move();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
        ctx.fill();
    }
    move() {
        if (this.x !== this.dest.x) this.x += this.x > this.dest.x ? -1 : 1;
        if (this.y !== this.dest.y) this.y += this.y > this.dest.y ? -1 : 1;
    }
}

class CoronaCell {
    constructor(
        x = Math.floor(Math.random() * window.innerWidth),
        y = Math.floor(Math.random() * window.innerHeight)
    ) {
        this.x = x;
        this.y = y;
        this.size = Math.floor(Math.random() * 20) + 50;
        this.origX = x;
        this.origY = y;
        this.dest = { x, y };
        this.triangles = [];
    }
    render(ctx) {
        this.move();
        this.move();
        this.move();
        this.move();
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.drawImage(
          crown,
          this.x - this.size / 2,
          this.y - this.size * 2 - 10,
          this.size,
          this.size
        );
        ctx.closePath();
        this.triangles.forEach(t => {
            ctx.beginPath();
            ctx.moveTo(t.x1 + this.x, t.y1 + this.y);
            ctx.lineTo(t.x2 + this.x, t.y2 + this.y);
            ctx.lineTo(t.x3 + this.x, t.y3 + this.y);
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#ffffff';
            ctx.stroke();
        });
        if (Math.random() > 0.95 && this.triangles.length <= 2) {
            this.triangles.push({
                x1: Math.floor(Math.random() * 30),
                y1: Math.floor(Math.random() * 30),

                x2: Math.floor(Math.random() * 30),
                y2: Math.floor(Math.random() * 30),

                x3: Math.floor(Math.random() * 30),
                y3: Math.floor(Math.random() * 30)
            });
        }
    }
    move() {
        if (this.x !== this.dest.x) this.x += this.x > this.dest.x ? -1 : 1;
        if (this.y !== this.dest.y) this.y += this.y > this.dest.y ? -1 : 1;
        this.dest.x += Math.round((0.5 - Math.random()) * 30);
        this.dest.y += Math.round((0.5 - Math.random()) * 30);
    }
}

const getel = id => document.getElementById(id);
const clamp = n => Math.max(1, Math.min(n, 10));
const wait = ms => new Promise(r => setTimeout(r, ms));
const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

const points = new Array(Math.floor(window.innerHeight / 15))
  .fill(
    new Array(Math.floor(window.innerWidth / 15)).fill((x, y) => new Point(x, y))
  )
  .map((arr, y) =>
    arr.map((fn, x) =>
      fn(
        (x + x) * 9 + Math.floor(Math.random() * 15) + 10,
        (y + y) * 9 + Math.floor(Math.random() * 15) + 10
      )
    )
  )
  .flat(Infinity);
const cells = [ new CoronaCell() ];
const mouse = { x: 0, y: 0 };

window.onload = () => {
    const c = getel("c");
    const ctx = c.getContext("2d");
    fixDpi(c);

    setInterval(() => {
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, c.width, c.height);
        points.forEach(p => p.render(ctx));
        cells.forEach(c => c.render(ctx));
        ctx.fillStyle = "#fefefe";
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        if (Math.random() > 0.955 && cells.length <= 10) cells.push(new CoronaCell());

        points.forEach(p => {
            p.dest = Math.abs(p.x - mouse.x) < 30 && Math.abs(p.y - mouse.y) < 30
              ? { x: mouse.x + (p.x > mouse.x ? 30 : -30), y: mouse.y + (p.x > mouse.x ? 30 : -30) }
              : { x: p.origX, y: p.origY };
        });
        cells.forEach(p => {
            p.dest = Math.abs(p.x - mouse.x) < 100 && Math.abs(p.y - mouse.y) < 100
              ? { x: mouse.x + (p.x > mouse.x ? 100 : -100), y: mouse.y + (p.x > mouse.x ? 100 : -100) }
              : { x: p.origX, y: p.origY };
        });
    }, 100);

    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
};
