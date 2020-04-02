let objects = [
    {
        dX: 126,
        dY: 71,
        name: "lamp",
        color: "red",
        found: false
    },
    {
        dX: 22,
        dY: 220,
        name: "sofa",
        color: "brown",
        found: false
    },
    {
        dX: 223,
        dY: 196,
        name: "book",
        color: "green",
        found: false
    },
    {
        dX: 248,
        dY: 35,
        name: "window",
        color: "brown",
        found: false
    },
    {
        dX: 315,
        dY: 172,
        name: "vase",
        color: "red",
        found: false
    },
    {
        dX: 425,
        dY: 178,
        name: "wardrobe",
        color: "brown",
        found: false
    }
];

const getel = id => document.getElementById(id);
const mouse = { x: 0, y: 0, r: 30, down: false };

const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};
const scaleImg = img => {
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
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

    return ratio || 1;
};

window.onload = () => {
    const c = getel("c");
    const img = getel("img");
    const ctx = c.getContext("2d");
    fixDpi(c);

    const fn = () => {
        const ratio = scaleImg(img);

        ctx.globalAlpha = 1;
        ctx.fillStyle = "#232323";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.beginPath();
        for (const args of [
            [ 1, 1 ],
            [ 0.9, 2 ],
            [ 0.8, 4 ],
            [ 0.7, 6 ],
            [ 0.6, 8 ],
            [ 0.5, 8 ],
            [ 0.4, 9 ],
            [ 0.3, 10 ],
            [ 0.2, 11 ],
            [ 0.1, 12 ]
        ]) {
            ctx.globalAlpha = args.shift();
            args[0] *= 1.5;
            ctx.arc(mouse.x - mouse.r - args[0] / 4, mouse.y - mouse.r - args[0] / 4, mouse.r + args[0], 0, Math.PI * 2);
            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        }

        objects = objects.map(o => ({
            ...o,
            x: o.dX + o.dX * ratio,
            y: o.dY + o.dY * ratio
        }));

        console.log(objects)

        const found = objects.filter(o => !o.found).map((el, i) => [ el, i ]).find(([ el ]) =>
            mouse.x + 10 >= el.x && mouse.x + 10 <= el.x + mouse.r &&
            mouse.y >= el.y && mouse.y <= el.y + mouse.r 
        );
        if (found) {
            objects[found[1]].found = true;
            alert("Found a " + found[0].name);
        }  
    };

    setInterval(() => {
        if (mouse.down && mouse.r < 100) mouse.r++;
        else if (!mouse.down && mouse.r > 30) mouse.r--;
        fn();
    }, 100);

    window.addEventListener("mousemove", e => {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
        fn();
    });
    window.addEventListener("mousedown", () => {
        mouse.down = true;
    });
    window.addEventListener("mouseup", () => {
        mouse.down = false;
    });
};
