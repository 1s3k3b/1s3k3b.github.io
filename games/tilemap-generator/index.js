class Tilemap {
    constructor(width, height, pre) {
        let tilemap = new Array(height).fill(new Array(width).fill(""));
        const twoDwaterDirs = new Array(Math.floor(height / 2)).fill(new Array(Math.floor(width / 2)).fill("")).map((row, y) => row.map((dir, x) => [x, y]));
        const waterDirs = [];
        twoDwaterDirs.map(a => a.map(b => waterDirs.push(b)));
     
        let putFirstTile = false;
        
        tilemap = tilemap.map((row, rowI) => row.map((tileInRow, i) => {
            if (!putFirstTile && Math.random() > 0.5) {
                putFirstTile = true;          
                this.firstTile = [i, rowI]; 
                return "1";
            }
            return "0";
        }));
        
        if (!putFirstTile) tilemap[0][0] = "1";
        
        for (let i = 0; i < 3; i++) {
        tilemap = tilemap.map((row, rowI) => row.map((tileInRow, i) => {
            if (tileInRow === "0") return "0";
            const surroundings = checkSurroundings(tilemap, i, rowI);
            const surroundedWalls = surroundings.filter(surr => surr.tile === "0");        
            const surroundedPath = surroundings.filter(surr => surr.tile === "1");
                
                if (surroundedPath.length <= 1) {
                    const pickedWall = surroundedWalls[Math.floor(Math.random() * surroundedWalls.length)];
                    const pickedWall2 = surroundedWalls[Math.floor(Math.random() * surroundedWalls.length)];
                    if (pickedWall) {
                        tilemap[pickedWall.y][pickedWall.x] = "1";
                        if ((Math.random() < 0.5 || !surroundedPath) && pickedWall !== pickedWall2) tilemap[pickedWall2.y][pickedWall2.x] = "1";
                    } else {
                        if (tilemap[rowI][i + 1]) tilemap[rowI][i + 1] = "1";
                        if (Math.random() > 0.7 && tilemap[rowI + 1]) tilemap[rowI + 1][i] = "1";
                    }
                }
                return tileInRow;
            }));
        }
        
        tilemap = tryWater(tilemap, 0, 0, waterDirs);
        
        tilemap = pre ? pre : tilemap;
        
        this.arr = tilemap;
        
        this.string = tilemap.map(r => r.join("")).join("\n");
        this.renderToCanvas = (ctx, w, h) => {
            const colors = ["#5afc4c", "#586a70", "#49a3fc"];
            let isWater = false;
            
            const drawBorder = (xPos, yPos, width, height, thickness = 1) => {
                ctx.fillStyle = "#000000";
                ctx.fillRect(xPos - thickness, yPos - thickness, width + thickness * 2, height + thickness * 2);
            }
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    ctx.fillStyle = colors[tilemap[y][x]];
                    ctx.fillRect(x * w, y * h, w, h);
                    drawBorder(x * w, y * h, w, h);
                }
            }
        };
    }
}

class Player {
    constructor(tilemap, baseX, baseY) {
        const getTilemapPos = (tm, p) => tm.arr[(p.keyPressed === "up" ? p.y - 1 : (p.keyPressed === "down" ? p.y + 1 : p.y))][(p.keyPressed === "right" ? p.x + 1 : (p.keyPressed === "left" ? p.x - 1 : p.x))];
    
        const width = tilemap[0].length;
        const height = tilemap.length;
        
        tilemap = new Tilemap(width, height, tilemap);
        
        const player = new Proxy({
            hp: 100,
            x: baseX,
            y: baseY,
            keyPressed: undefined
        }, {
            set: (obj, prop, val) => {
                obj[prop] = val;
                return true;
            }
        });
        
        this.init = (c, ctx, w, h) => {
            window.addEventListener("keydown", e => {
            switch (`${e.code}`) {
                case "KeyW":
                case "ArrowUp":
                    player.keyPressed = "up";
                    break;
                case "KeyS":
                case "ArrowDown":
                    player.keyPressed = "down";
                    break;
                case "KeyA":
                case "ArrowLeft":
                    player.keyPressed = "left";
                    break;
                case "KeyD":
                case "ArrowRight":
                    player.keyPressed = "right";
                    break;
                }
            });
            window.addEventListener("keyup", e => {
                switch (`${e.code}`) {
                    case "KeyW":
                    case "ArrowUp":
                        player.keyPressed = undefined;
                        break;
                    case "KeyS":
                    case "ArrowDown":
                        player.keyPressed = undefined;
                        break;
                    case "KeyA":
                    case "ArrowLeft":
                        player.keyPressed = undefined;
                        break;
                    case "KeyD":
                    case "ArrowRight":
                        player.keyPressed = undefined;
                        break;
                }
            });
            
            setInterval(() => {                              
                if (player.keyPressed === "right" && player.x !== width - 1 && getTilemapPos(tilemap, player) === "1") player.x++;
                if (player.keyPressed === "left" && player.x !== 0 && getTilemapPos(tilemap, player) === "1") player.x--;
                if (player.keyPressed === "up" && player.y !== 0 && getTilemapPos(tilemap, player) === "1") player.y--;
                if (player.keyPressed === "down" && player.y !== height - 1 && getTilemapPos(tilemap, player) === "1") player.y++;

                this.drawOnTilemap(c, ctx, w, h);
            }, 100);
        };
        
        this.drawOnTilemap = (c, ctx, w, h) => {
            const colors = ["#5afc4c", "#586a70", "#49a3fc", "#fc4949"];
            // const biomeImages = ["https://opengameart.org/sites/default/files/grass03.png", "https://cdnb.artstation.com/p/assets/images/images/000/754/911/medium/john-lomax-stone-floor-v2.jpg?1432316039", "https://i.pinimg.com/236x/0e/98/9b/0e989bc5eae0aa4382e6ab07300b7b04--water-texture-d-texture.jpg"];
            let isWater = false;
            
            const drawBorder = (xPos, yPos, width, height, thickness = 1) => {
                ctx.fillStyle = "#000000";
                ctx.fillRect(xPos - thickness, yPos - thickness, width + thickness * 2, height + thickness * 2);
            }
            
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    ctx.fillStyle = colors[(x === player.x && y === player.y ? 3 : tilemap.arr[y][x])];
                    ctx.fillRect(x * w, y * h, w, h);
                    // drawBorder(x * w, y * h, w, h);
                }
            }
        }
    }
}

const neighborDirs = [
    /*[ -1, -1 ],*/ [  0, -1 ], /*[ 1, -1 ]*/,
    /*[ -1,  0 ],*/             [ 1,  0 ],
    /*[ -1,  1 ],*/ [  0,  1 ], /*[ 1,  1 ]*/
];

const getFromMatrix = ([m, x, y]) => (m[y] || [])[x];

const getNeighbors = (x, y, n, m) => n.map(([dX, dY], i) => {
    return {
        x: x + dX, 
        y: y + dY,
        tile: "",
        isCorner: i === 1 || i === 4
    }
}).map(i => {
    i.tile = getFromMatrix([m, i.x, i.y]);
    return i;
}).filter(v => v.tile !== undefined);

const checkSurroundings = (arr, x, y) => getNeighbors(x, y, neighborDirs, arr);

const tryWater = (arr, x, y, waterDirs) => {
    const area = waterDirs.map(([dX, dY]) => {
        return {
            x: x + dX,
            y: y + dY,
            tile: arr[dY][dX]
        };
    });
    if (area.map(t => t.tile).includes("1")) {
        if (y === arr.length - 1) return arr;
        else if (x === arr[0].length - 1) return tryWater(arr, 0, y + 1, waterDirs);
        return tryWater(arr, x + 1, y, waterDirs);
    }
    const xys = area.map(xy => [xy.x, xy.y]);
    return arr.map((row, yR) => row.map((t, xR) => xys.includes([xR, yR]) ? "2" : t));
}

const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue("height").slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue("width").slice(0, -2);

    c.setAttribute("height", height * dpi);
    c.setAttribute("width", width * dpi);
};

window.onload = () => {
    const c = document.getElementById("tilemap");
    const ctxC = c.getContext("2d");
    // ctxC.scale(2, 2);
    fixDpi(c);

    const [ WIDTH, HEIGHT ] = [ Math.floor(c.width / 20), Math.floor(c.height / 20) ];
    
    const myTilemap = new Tilemap(WIDTH, HEIGHT);
    new Player(myTilemap.arr, myTilemap.firstTile[0], myTilemap.firstTile[1]).init(c, ctxC, WIDTH, HEIGHT);
};
