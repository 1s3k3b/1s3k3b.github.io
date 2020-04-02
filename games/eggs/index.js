const getel = id => document.getElementById(id);

const EGG_WH = 50;
const MOVEMENT = 12;

class Bird {
    constructor(x = EGG_WH, y = window.innerHeight - EGG_WH) {
        this.x = x;
        this.y = y;
        this.eggs = 2;
        this.eggArr = [];
    }
    render(ctx) {
        this.eggArr = this.eggs
          ? new Array(this.eggs)
            .fill(i => ({
              x: this.x + EGG_WH / 2,
              y: this.y + i * EGG_WH + EGG_WH / 2,
              render() {
                  ctx.beginPath();
                  ctx.fillStyle = "#1cff1c";
                  ctx.arc(this.x, this.y, EGG_WH / 2, 0, Math.PI * 2);
                  ctx.fill();
              }
            }))
            .map((f, i) => f(i))
          : [];

        ctx.beginPath();
        ctx.fillStyle = "#1cff1c";
        ctx.fillRect(this.x, this.y, EGG_WH, EGG_WH);
        this.eggArr.forEach(e => e.render());
    }
    addEgg() {
        this.y -= EGG_WH;
        this.eggs++;
    }
    sliceEgg(i = 1) {
        this.eggs -= i;
    }
}

class Block {
    constructor(x, y, top) {
        this.x = x;
        this.y = y;
        this.top = top;
    }
    render(ctx) {
        this.x -= MOVEMENT;
        ctx.beginPath();
        ctx.fillStyle = this.top ? "#34c941" : "#9c780e";
        ctx.fillRect(this.x, this.y, EGG_WH, EGG_WH);
    }
}

let bird = new Bird();
let blocks = [];
const mouse = { x: 0, y: 0 };

let lastPush = 4;
const getPushes = i => i > 10
  ? Math.floor(Math.random() * 2) + 1
  : i > 6
    ? Math.floor(Math.random() * 3) + 3
    : i > 4
      ? Math.floor(Math.random() * 5) + 3
      : i > 2
        ? Math.floor(Math.random() * 8) + 2
        : Math.floor(Math.random() * 9) + 3;

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
        for (let i = 0; i < getPushes(lastPush); i++) {
            blocks.push(new Block(window.innerWidth, window.innerHeight - i * EGG_WH, i === 0));
            lastPush = getPushes(lastPush);
        }

        ctx.beginPath();
        ctx.fillStyle = "#87fdff";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
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
        bird.render(ctx);
        blocks.forEach(e => e.render(ctx));

        const lastEgg = bird.eggArr[bird.eggArr.length - 1] || {};
        if (blocks.some(b => lastEgg.y > b.y && lastEgg.x >= blocks[0].x)) bird.sliceEgg();
        else if (lastEgg.x >= blocks[0].x) {
            bird.y += MOVEMENT;
            bird.eggArr.forEach(e => e.y += MOVEMENT);
        }
        if (!bird.eggs) bird.y += MOVEMENT;
        if (blocks.some(b =>
            bird.y > b.y && bird.x > b.x
        )) {
            alert("Game over!");
            blocks = [];
            bird = new Bird();
            lastPush = 4;
        }

        const _foundE = blocks
          .map((el, i) => [ el, i ])
          .find(([ e ]) => e.x <= 0);
        if (_foundE) delete blocks[_foundE[1]];
        blocks = blocks.filter(Boolean);
    }, 100);
    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    });
    window.addEventListener("mousedown", () => bird.addEgg());
};
