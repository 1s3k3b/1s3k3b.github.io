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
var Types;
(function (Types) {
    Types[Types["PHYSICS"] = 0] = "PHYSICS";
    Types[Types["SCENERY"] = 1] = "SCENERY";
    Types[Types["POWERUP"] = 2] = "POWERUP";
    Types[Types["VEHICLE_POWERUP"] = 3] = "VEHICLE_POWERUP";
})(Types = Types || (Types = {}));
var Vehicles;
(function (Vehicles) {
    Vehicles[Vehicles["HELI"] = 0] = "HELI";
    Vehicles[Vehicles["TRUCK"] = 1] = "TRUCK";
    Vehicles[Vehicles["BALLOON"] = 2] = "BALLOON";
    Vehicles[Vehicles["BLOB"] = 3] = "BLOB";
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
    if (a.length <= n)
        return [a];
    const res = [];
    const maxLen = Math.ceil(a.length / n);
    for (let i = 0; i < maxLen; i++)
        res[i] = a.slice(i * n, (i + 1) * n);
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
            if (l.curve)
                l.coords = l.coords.map(([dX, dY]) => [x + dX, y + dY]);
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
                    if (x || x === 0)
                        (i ? scenery : physics).push(coords.length ? { type: i, curve: true, coords: [[x, y], [x2, y2], ...paginate(coords, 2)] } : { type: i, x, y, x2, y2 });
                }
                continue;
            }
            for (const [t, x, y, x2degT, y2] of section
                .split(',')
                .map(x => x
                .split(' ')
                .map((y, i) => (i && i !== 3) ? this._decodePos(y) : y))) {
                if (!t)
                    break;
                const o = {
                    type: 2,
                    powerupTypeRaw: t,
                    powerupType: powerupTypes[t],
                    x: x,
                    y: y,
                };
                if (['B', 'G'].includes(t))
                    o.deg = this._decodePos(x2degT);
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
            : [o.x ?? 0, o.y ?? 0, o.x2 ?? 0, o.y2 ?? 0].map(x => this._encodePos(x))).join(' ');
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

const f = (c, dX, dY) => {
    const powerups = {
        O: '#-c 3 -8 4 -5 7 -6 b,-6 c -2 9 2 9 6 c 6 7 8 4 d 4 9 1 9 -2 8 -4 b -8 6 -7 2 -8 0 -d -2 -9 -5 -7 -b -9 -9 -3 -9 0 -d 3,-4 a 8 -6 -2 3,-4 9 0 -b 5 9 -b 2 b 3 -a -8 5 a,1 7 -5 5 0 8,1 6 -6 3,0 5 -6 -3,-6 -4 0 2,-1 1 -4 -5 2 -5,-1 -a -7 1,1 -6 -6 -6,0 -6 6 -6,7 -6 -2 4,-8 1 -8 -5 -4 2 -7 -3,4 -3 1 3,-8 1 -3 1,0 -4 0 4 6 2 6 -4,0 4 1 -6,2 -2 1 1,3 -7 3 -1,4 -5 4 -1,5 -4 5 4,6 -3 6 0,7 -5 8 0,3 6 8 4,1 5 -2 5,4 4 0 7 5 3#',
        T: '#-7 9 -6 2 -c -4 -5 -5 0 -d 4 -5 b -4 6 2 7 a 0 6 -6 9,-5 -5 0 -a 6 8 -8 -3 9 -3 -6 8 5 -2 -1 -b -6 7 0 -2,-a -3 9 -4,-9 -2 2 5,5 5 -1 -8 -3 2 1 -2,2 -2 -3 3,6 -1 4 4,4 6 -1 -4,-6 -1 -3 -6,-7 a 0 6#',
        A: '#-c -2 -b -4 -a -7 -7 -a -4 -b -2 -c,2 -c 4 -b 7 -a a -7 b -4 c -2,-6 -1 -5 -4,-4 -5 -1 -6,1 -6 4 -5,5 -4 6 -1,-6 1 -5 4,-4 5 -1 6,1 6 4 5,5 4 6 1,c 2 b 4 a 7 7 a 4 b 2 c 2 8 4 7 7 4 8 2 c 2,-2 c -4 b -7 a -a 7 -b 4 -c 2 -8 2 -7 4 -4 7 -2 8 -2 c,-c -2 -8 -2 -7 -4 -4 -7 -2 -8 -2 -c,2 -8 2 -c,2 -8 4 -7 7 -4 8 -2 c -2,-a 3 -8 7 -3 a -7 9 -a 3,-9 3 -6 7 -3 9 -a 3,-b 2 -6 8,-a -3 -7 -8,-9 -6 -2 -a,-3 -a -7 -8,-3 -b -7 -6,-9 -2 -5 -8 -b -2,3 -a 9 -6 b -2 9 -2 5 -9 9 -3,9 -4 3 -a 8 -8,3 -b 7 -7,a 3 6 9 a 5,9 3 3 9,3 a 9 5,6 7 5 a,-3 4 -5 0 -3 -4 1 -5,1 -4 4 -2 3 3 -3 -1 4 -3 2 -5 -3 -2 2 2 3 -2 -1 2 1 -3,-3 0 -1 5 3 4 5 -1,0 0 0 4,-1 3 2 3#',
        C: '#6 -2 6 -e,-a c -a -e -7 -d -4 -d,-3 -d 0 -e 3 -f 5 -e,6 -2 4 -3 0 -3 -2 -2,-4 -1 -6 -1 -8 -2 -9 -5,-4 -1 -2 -2,5 -4 5 -d,2 -c -9 -6,-8 -6 4 -4,4 -8 4 -d -7 -c -4 -2,-7 -c 3 -9 3 -c -7 -6 4 -5 2 -9 -6 -7 -7 -c,-6 -7 3 -7 -2 -c -9 -7 -9 -d -6 -7,-9 -4 -6 -2 1 -4 -8 -4 -9 -6#',
        S: '#0 0 4 0,0 0 -4 -6,0 -8 0 -a -2 -a -6 -9 -9 -6 -a -2 -a 0 -a 2 -9 6 -6 9 -2 a 0 a 2 a 6 9 9 6 a 2 a 0 a -2 9 -6 6 -9 2 -a 0 -a,8 0 a 0,0 8 0 a,-8 0 -a 0,0 8 0 6,0 -8 0 -6,-6 0 -8 0,8 0 6 0,-2 b 2 b 6 a a 7 b 2 b -2 a -7 7 -a -6 -a 8 -a,-7 -a -a -7 -a 6,-b -8 -b 7 -8 9 -2 b,-b -8 -9 -b 8 -b a -8#',
        G: '#-6 a -6 2 -a 2 -1 -9,-6 a 4 a,3 a 5 a 5 2 9 2 0 -9,-7 1 7 1 -1 -8 -6 0 6 0 -1 -6 -8 1 1 -4 -5 a 1 2 4 9 -5 9 2 4 2 8 -2 8 3 4,-1 -6 -4 7,3 8 3 1,3 2 -2 a,-1 6 1 -7,1 -6 4 3 0 -5,-6 8 -3 -4,-1 0 5 0 -1 -1,0 1 5 0,4 1 -1 -3,0 0 6 -1#',
        B: '#0 -c -8 -6,0 -c 8 -6 8 2 0 -4 -8 2 -8 -6,-8 c 0 6 8 c 8 4 0 -2 -8 4 -8 c#',
        W: p =>
            [[p.x, p.y], [p.x2, p.y2]]
                .flatMap(([x, y]) =>
                    parser.parse(
                        parser
                            .parse('#4 e -2 a,-1 a 5 a 7 9 a 7 c 4 d 0 d -4 b -9 9 -c 5 -e 1 -f -5 -f -8 -f -1 -d 1 -c -5 -c -9 -a -c -6 -e -1 -d 4 -b 9,-a a -7 d -1 f 4 e,-6 8 -9 2 -9 -3 -7 -5 -4 -7,-3 -7 0 -7,1 -7 3 -6 5 -3 5 0,5 1 3 2 0 3,2 2 -1 2 -2 0,4 -3 3 0,4 -4 2 -6 0 -7,7 -8 9 -4 8 1 6 4,6 5 3 6 -2 6 -4 4 -5 0 -3 -3 0 -3 1 -1 -1 -3,1 -1 2 1 -1 0 -1 -2 1 3,-3 0 -2 -2,-5 -1 -3 -3#')
                            .move(x + dX, y + dY)).scenery
                ),
        V: p =>
            parser.parse(
                parser
                    .parse(
                        [
                            '#-a -5 4 -5 3 -8 1 -a -2 -b -4 -b -7 -a -9 -8 -a -5,-e -5 -e -3 -d 1 -a 4 -6 6 -4 7 -1 7 2 6 5 c,-1 7 3 5 6 2 8 -2 8 -4 8 -6 6 -a 3 -d -1 -f -3 -f -3 -l c -l -h -l,-3 -f -5 -f -8 -e -b -b -d -8 -e -6,-8 -7 2 -7,-8 -6 3 -6 0 -9,1 -8 -7 -8 1 -9 -6 -9,4 4 7 0,4 4 0 7,-b c -8 5#',
                            '#-e 0 7 0 7 3 7 -a 7 -f 2 -f,7 3 3 3 7 3,3 3 3 -3 -e -3 -e 4 -b 4,-e 4 -c 4,-b 3 -b -2,-c -2 -c 3,-3 0 6 0,3 0 3 3,3 4 7 4 7 2 4 2 4 -2 7 -2 6 1 5 -2,-e -4 -e -e,-a -c 2 -c 2 -e -a -e -a -c,-b -7 -9 -7,3 -7 1 -7,6 -f -e -f,-e -d -e -f,-e -2 -e -6,2 -3 7 -3 7 2,3 4 3 2,-b 1 -b 4,-a 1 3 1#',
                            '#-a -5 -a -7 -8 -a -6 -d -3 -e -1 -e 1 -e 5 -d 7 -a 9 -7 9 -5 9 -3 7 0 5 3 2 4 0 5 -2 5 -6 3 -8 1 -a -3 -a -5,-5 4 -2 b 1 b -2 9,4 3 1 b,-4 8 3 8 3 e -4 e -4 8,-3 d -3 9 2 9 2 d -2 d -2 b#',
                            '#-e 0 -4 0 -d -a 7 -b -7 -l -d -f -e -6 -a -b -d -7 -9 -e -b -7 -9 -c -c -6 -8 -e -c -b -c -g -9 -m -d -g -a -k -1 -k 5 -l 2 -h -2 -e -4 -8 -4 -5,-4 0 8 0 -3 -l 7 -i 2 -l,8 0 8 -g 8 -m -e 0 -e -m 8 0,8 -m -e -m,-3 -l -4 0,-d -f 1 0 2 -m -d -4 5 -1 7 -g -d -c -3 -l,-9 -7 -7 -6,-3 -3 -1 -8 -5 -1 1 -8 -1 -3 4 -6 -3 -1 1 -5 6 -7 8 -2,-1 -8 -3 -3 1 -9 -2 -4 -3 -9 -5 -3 -1 -8,6 -7 2 -3 -2 0 5 -5 0 -2 6 -3 1 -1 -8 -1 -c 0 -7 -4 -c -1 -6 -6 -7 -1 -3 -8 2 -e 1 -7 6 -e 3 -6 7 -c 6 -7,1 -1 6 -1 1 -1,6 -1 8 -1,-3 -8 -7 -3 0 -9 -7 -5 -d -2 -7 -c -8 -6 -3 -e -8 -e -4 -h -8 -e -b -a -c -g -8 -k -b -f -4 -l -7 -g -2 -k -5 -f -1 -j -7 -d 2 -j -3 -d 1 -i -3 -e -5 -9 -8 -5 0 -c -3 -8,3 -6 6 -d 3 -6,4 -c 5 -h 2 -8 4 -d 7 -h 4 -l 0 -l,7 -h 5 -c 7 -h,5 -k 8 -k,-1 -k -6 -k -b -l,-d -k -d -f,-b -7 -9 -c -b -7,-b -f -8 -j -b -f,2 -j -3 -g -6 -c -2 -g 2 -j#',
                        ][p.vehicleTypeRaw - 1]
                    )
                    .move(p.x + dX, p.y + dY)
            ).scenery,
    };
    const parser = new Parser();
    const parsed = parser.parse(c);
    const moved = parser.parse(parsed.move(dX, dY));
    const res = [...moved.physics];
    for (const p of parsed.powerups) {
        const d = powerups[p.powerupTypeRaw];
        if (typeof d === 'string') res.push(...parser.parse(parser.parse(d).move(p.x + dX, p.y + dY)).scenery);
        if (typeof d === 'function') res.push(...d(p));
    }
    return parser.toCode({ ...parsed, scenery: [...parsed.scenery, ...res] });
};

const unbrush = (code, n) => {
    const parser = new Parser();
    const parsed = parser.parse(code);
    return parser.toCode({ ...parsed, physics: parsed.physics.map(x => x.coords ? (x.coords = x.coords.filter((_, i, a) => !(i % n)), x) : x) });
};

const getel = id => document.getElementById(id);

window.onload = () => {
    const inp = getel('inp');
    const n = getel('n');
    const outp = getel('outp');
    const btn = getel('btn');
    const down = getel('down');

    btn.onclick = () => {
        outp.value = unbrush(inp.value, isNaN(+n.value) ? 15 : +n.value);
    };
    down.onclick = () => {
        const d = outp.value;
        if (!d) return;
        saveAs(new Blob([ d ], { type: 'text/plain' }), 'frhd-unbrush.txt');
    };
};