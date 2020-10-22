(function(a, b) {
    if(typeof define == 'function' && define.amd) {define([], b);}
    else if(typeof exports != 'undefined') {b();}
    else{b(), a.FileSaver = { exports:{} }.exports;}
})(this, function() {
    'use strict';function b(a, b) {return typeof b == 'undefined' ? b = { autoBom:!1 } : typeof b != 'object' && (console.warn('Deprecated: Expected third argument to be a object'), b = { autoBom:!b }), b.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type) ? new Blob(['\uFEFF', a], { type:a.type }) : a;}function c(a, b, c) {const d = new XMLHttpRequest;d.open('GET', a), d.responseType = 'blob', d.onload = function() {g(d.response, b, c);}, d.onerror = function() {console.error('could not download file');}, d.send();}function d(a) {
        const b = new XMLHttpRequest;b.open('HEAD', a, !1);try{b.send();}
        catch(a) {}return b.status >= 200 && b.status <= 299;
    }function e(a) {
        try{a.dispatchEvent(new MouseEvent('click'));}
        catch(c) {const b = document.createEvent('MouseEvents');b.initMouseEvent('click', !0, !0, window, 0, 0, 0, 80, 20, !1, !1, !1, !1, 0, null), a.dispatchEvent(b);}
    }var f = typeof window == 'object' && window.window === window ? window : typeof self == 'object' && self.self === self ? self : typeof global == 'object' && global.global === global ? global : void 0, a = /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent), g = f.saveAs || (typeof window != 'object' || window !== f ? function() {} : 'download' in HTMLAnchorElement.prototype && !a ? function(b, g, h) {const i = f.URL || f.webkitURL, j = document.createElement('a');g = g || b.name || 'download', j.download = g, j.rel = 'noopener', typeof b == 'string' ? (j.href = b, j.origin === location.origin ? e(j) : d(j.href) ? c(b, g, h) : e(j, j.target = '_blank')) : (j.href = i.createObjectURL(b), setTimeout(function() {i.revokeObjectURL(j.href);}, 4E4), setTimeout(function() {e(j);}, 0));} : 'msSaveOrOpenBlob' in navigator ? function(f, g, h) {
        if(g = g || f.name || 'download', typeof f != 'string') {navigator.msSaveOrOpenBlob(b(f, h), g);}
        else if(d(f)) {c(f, g, h);}
        else{const i = document.createElement('a');i.href = f, i.target = '_blank', setTimeout(function() {e(i);});}
    } : function(b, d, e, g) {
        if(g = g || open('', '_blank'), g && (g.document.title = g.document.body.innerText = 'downloading...'), typeof b == 'string')return c(b, d, e);const h = b.type === 'application/octet-stream', i = /constructor/i.test(f.HTMLElement) || f.safari, j = /CriOS\/[\d]+/.test(navigator.userAgent);if((j || h && i || a) && typeof FileReader != 'undefined') {const k = new FileReader;k.onloadend = function() {let a = k.result;a = j ? a : a.replace(/^data:[^;]*;/, 'data:attachment/file;'), g ? g.location.href = a : location = a, g = null;}, k.readAsDataURL(b);}
        else{const l = f.URL || f.webkitURL, m = l.createObjectURL(b);g ? g.location = m : location.href = m, g = null, setTimeout(function() {l.revokeObjectURL(m);}, 4E4);}
    });f.saveAs = g.saveAs = g, typeof module != 'undefined' && (module.exports = g);
});
let Types;
(function(Types) {
    Types[Types['PHYSICS'] = 0] = 'PHYSICS';
    Types[Types['SCENERY'] = 1] = 'SCENERY';
    Types[Types['POWERUP'] = 2] = 'POWERUP';
    Types[Types['VEHICLE_POWERUP'] = 3] = 'VEHICLE_POWERUP';
})(Types = Types || (Types = {}));
let Vehicles;
(function(Vehicles) {
    Vehicles[Vehicles['HELI'] = 0] = 'HELI';
    Vehicles[Vehicles['TRUCK'] = 1] = 'TRUCK';
    Vehicles[Vehicles['BALLOON'] = 2] = 'BALLOON';
    Vehicles[Vehicles['BLOB'] = 3] = 'BLOB';
})(Vehicles = Vehicles || (Vehicles = {}));
powerupTypes = {
    'T': 'star',
    'C': 'checkpoint',
    'B': 'boost',
    'G': 'gravity',
    'S': 'slowmo',
    'O': 'bomb',
    'A': 'anti-gravity',
    'W': 'teleport',
    'V': 'vehicle',
};
const paginate = (a, n) => {
    if (a.length <= n) {return [a];}
    const res = [];
    const maxLen = Math.ceil(a.length / n);
    for (let i = 0; i < maxLen; i++) {res[i] = a.slice(i * n, (i + 1) * n);}
    return res;
};
class Parsed {
    constructor(parser, code, physics, scenery, powerups) {
        this.parser = parser;
        this.code = code;
        this.physics = physics;
        this.scenery = scenery;
        this.powerups = powerups;
    }
    move(x = 0, y = 0) {
        const mapLine = (l) => {
            if (l.curve) {l.coords = l.coords.map(([dX, dY]) => [x + dX, y + dY]);}
            else {
                l.x += x;
                l.y += y;
                l.x2 += x;
                l.y2 += y;
            }
            return l;
        };
        return this.parser.toCode({
            physics: this.physics.map(l => mapLine({ ...l })),
            scenery: this.scenery.map(l => mapLine({ ...l })),
            powerups: this.powerups.map(p => {
                p = { ...p };
                p.x += x;
                p.y += y;
                if (p.x2) {
                    p.x2 += x;
                    p.y2 += y;
                }
                return p;
            }),
        });
    }
    merge(x) {
        if (x instanceof Parsed) {
            return this.parser.parse(this.parser.toCode({
                physics: [...this.physics, ...x.physics],
                scenery: [...this.scenery, ...x.scenery],
                powerups: [...this.powerups, ...x.powerups],
            }));
        }
        return this.code
            .split('#')
            .map((y, i) => `${y},${(z => z ? `${z.endsWith(',') ? z.slice(0, -1) : z}` : '')(x.split('#')[i])}`)
            .join('#')
            .replace(/,$/g, '')
            .replace(/,#/, '#');
    }
}
class Parser {
    parse(code) {
        const split = code.split('#');
        const physics = [];
        const scenery = [];
        const powerups = [];
        for (let i = 0; i < 3; i++) {
            const section = split[i];
            if (i < 2) {
                for (const [x, y, x2, y2, ...coords] of section
                    .split(',')
                    .map(x => x
                        .split(' ')
                        .map(this._decodePos))) {
                    // @ts-ignore
                    if (x || x === 0) {(i ? scenery : physics).push(coords.length ? { type: i, curve: true, coords: [[x, y], [x2, y2], ...paginate(coords, 2)] } : { type: i, x, y, x2, y2 });}
                }
                continue;
            }
            for (const [t, x, y, x2degT, y2] of section
                .split(',')
                .map(x => x
                    .split(' ')
                    .map((y, i) => (i && i !== 3) ? this._decodePos(y) : y))) {
                if (!t) {break;}
                const o = {
                    type: 2,
                    powerupTypeRaw: t,
                    powerupType: powerupTypes[t],
                    x: x,
                    y: y,
                };
                if (['B', 'G'].includes(t)) {o.deg = this._decodePos(x2degT);}
                if (t === 'W') {
                    o.x2 = parseInt(x2degT, 32);
                    o.y2 = y2;
                }
                if (t === 'V') {
                    o.vehicleTypeRaw = parseInt(x2degT);
                    o.vehicleType = Vehicles[parseInt(x2degT) - 1];
                    o.duration = y2;
                }
                powerups.push(o);
            }
        }
        return new Parsed(this, code, physics, scenery, powerups);
    }
    toCode({ physics, scenery, powerups }) {
        const mapLine = (o) => (o.curve
            ? o.coords.map(([x, y]) => this._encodePos(x) + ' ' + this._encodePos(y))
            : [o.x || 0, o.y || 0, o.x2 || 0, o.y2 || 0].map(x => this._encodePos(x))).join(' ');
        return `${physics
            .map(mapLine)
            .join(',')}#${scenery
            .map(mapLine)
            .join(',')}#${powerups.map(o => `${o.powerupTypeRaw} ${this._encodePos(o.x)} ${this._encodePos(o.y)}${(x => x ? ' ' + x : '')((!isNaN(+o.x2) ? this._encodePos(o.x2) : !isNaN(+o.deg) ? this._encodePos(o.deg) : o.vehicleTypeRaw))}${(x => x ? ' ' + x : '')((!isNaN(+o.y2) ? this._encodePos(o.y2) : o.duration))}`)}`;
    }
    _encodePos(n) {
        return n.toString(32);
    }
    _decodePos(s) {
        return parseInt(s, 32);
    }
}

const f = (code, deg) => {
    const parser = new Parser();
    const parsed = parser.parse(code);
    const theta = deg * Math.PI / 180;
    const ct = Math.cos(theta);
    const st = Math.sin(theta);
    const move = (x, y) => [ct * x - st * y, ct * y + st * x];
    const mapLine = l => {
        if (l.curve) {l.coords = l.coords.map(([x, y]) => move(x, y));}
        else {
            const [x1, y1] = move(l.x, l.y);
            const [x2, y2] = move(l.x2, l.y2);
            l.x = x1;
            l.y = y1;
            l.x2 = x2;
            l.y2 = y2;
        }
        return l;
    };
    return parser.toCode({
        physics: parsed.physics.map(mapLine),
        scenery: parsed.scenery.map(mapLine),
        powerups: parsed.powerups.map(x => {
            const [x1, y1] = move(x.x, x.y);
            x.x = x1;
            x.y = y1;
            if (!isNaN(x.deg)) x.deg += deg;
            if (!isNaN(x.x2)) {
                const [x2, y2] = move(x.x2, x.y2);
                x.x2 = x2;
                x.y2 = y2;
            }
            return x;
        }),
    });
};
const animate = (code, n, d, diff) => {
    const parser = new Parser();
    const physics = [];
    const scenery = [];
    const powerups = [];
    let deg = 0;
    for (let i = 0; i <= n; i++) {
        const parsed = parser.parse(parser.parse(f(code, deg)).move(i * diff, 0));
        scenery.push(...parsed.scenery);
        (i && i !== n ? scenery : physics).push(...parsed.physics);
        powerups.push(...parsed.powerups.filter(x => i === n ? true : x.powerupTypeRaw !== 'T'));
        if (i !== n) {
            physics.push({ x: i * diff - 40, y: 50, x2: i * diff + 40, y2: 50 });
            powerups.push({ powerupTypeRaw: 'W', x: i * diff, y: 0, x2: (i + 1) * diff, y2: 0 });
        }
        deg += d;
    }
    return parser.toCode({ physics, scenery, powerups });
};

window.onload = () => {
    btn.onclick = () => {
        outp.value = animate(inp.value, isNaN(+frms.value) ? 100 : +frms.value, isNaN(+deg.value) ? 7.2 : +deg.value, isNaN(+diff.value) ? 2000 : +diff.value);
    };
    down.onclick = () => {
        const d = outp.value;
        if (!d) return;
        saveAs(new Blob([ d ], { type: 'text/plain' }), 'frhd-rotated.txt');
    };
};
