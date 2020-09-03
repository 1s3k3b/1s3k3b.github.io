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

const chars = {
    a: '0 1s k 0 18 1s,a u u u',
    b: '0 a 0 1i 0 1n 5 1s,0 a 0 5 5 0 p 0 13 a 13 k p u,p 1s 5 1s,p 1s u 1s 18 1i 18 18 u u p u',
    c: '0 1d 5 1n f 1s p 1s 13 1n 18 1d,0 1d 0 13 0 f 5 5 f 0 p 0 13 5 18 f',
    d: 'p 0 13 5 18 f 18 1d 13 1n p 1s f 1s a 1s 0 1s 0 1i 0 a,a 0 p 0,a 0 0 0 0 a',
    e: '0 0 18 0,0 0 0 1s 18 1s,0 u 18 u',
    f: '0 0 18 0,0 0 0 1s,0 u 18 u',
    g: '0 f 5 5 f 0 p 0 13 5 18 f,0 f 0 1d 5 1n f 1s p 1s 13 1n 18 1d 18 18 13 13 k 13',
    h: '0 u 18 u,0 1s 0 0,18 0 18 1s',
    i: 'k 0 k 1s',
    j: '13 0 13 1d u 1n k 1s a 1n 5 1d 5 18',
    k: '0 0 0 1s,0 u 18 0,0 u 18 1s',
    l: '0 0 0 1s 18 1s',
    m: '0 1s 0 0,18 0 18 1s,k 1i 0 0,k 1i 18 0',
    n: '0 1s 0 0 18 1s,18 0 18 1s',
    o: '0 f 5 5 f 0 p 0 13 5 18 f 18 1d 13 1n p 1s f 1s 5 1n 0 1d 0 f',
    p: '0 1s 0 0 p 0 13 5 18 f 13 p p u 0 u',
    q: '0 f 5 5 f 0 p 0 13 5 18 f,f 1s 5 1n 0 1d 0 f,f 1s k 1s p 1s 13 1n 18 1s,18 18 18 f,13 1n 18 1d 18 18',
    r: '0 1s 0 0 p 0 13 5 18 f 13 p p u 0 u,a u 18 1s',
    s: '18 0 f 0 5 5 0 f 5 p f u p u 13 13 18 1d 13 1n p 1s 0 1s',
    t: '0 0 18 0,k 0 k 1s',
    u: '0 0 0 1d 5 1n f 1s p 1s 13 1n 18 1d 18 0',
    v: '0 0 k 1s 18 0',
    w: '0 0 a 1s k 0 u 1s 18 0',
    x: '0 0 18 1s,18 0 0 1s',
    y: '0 0 k u k 1s,k u 18 0',
    z: '0 0 18 0 0 1s 18 1s',
    0: '0 f 5 5 f 0 p 0 13 5 18 f 18 1d 13 1n p 1s f 1s 5 1n 0 1d 0 f',
    1: 'u 1s u 0 a u',
    2: '0 1s 18 1s,0 f 5 5 f 0 p 0 13 5 18 f 18 k 13 u 0 1s',
    3: '5 5 f 0 p 0 13 5 18 f 13 p p u f u,5 1n f 1s p 1s 13 1n 18 1d 13 13 p u',
    4: 'u 1s u 0 0 13 18 13',
    5: '18 0 0 0,0 1d 5 1n f 1s p 1s 13 1n 18 1d 18 18 13 u p p 0 p 0 5 0 0',
    6: '0 1d 5 1n f 1s p 1s 13 1n 18 1d 18 18 13 u p p,0 1d 0 18 5 u p 0,5 u f p p p',
    7: '0 0 18 0 0 1s',
    8: 'f 0 p 0 13 5 18 f 13 p p u 13 13 18 1d,f 0 5 5 0 f 5 p f u p u,0 1d 5 1n f 1s p 1s 13 1n 18 1d,0 1d 5 13 f u',
    9: 'f 0 p 0 13 5 18 f,f 0 5 5 0 f 0 k 5 u f 13 p 13 13 u f 1s,13 u 18 k 18 f',
    '.': 'f 1m g 1k,h 1j j 1i,f 1o g 1q,h 1r j 1s,l 1s n 1r,o 1q p 1o,p 1m o 1k,n 1j l 1i',
    ':': 'f 1m g 1k,h 1j j 1i,f 1o g 1q,h 1r j 1s,l 1s n 1r,o 1q p 1o,p 1m o 1k,n 1j l 1i,f 4 g 2,h 1 j 0,f 6 g 8,h 9 j a,l a n 9,o 8 p 6,p 4 o 2,n 1 l 0',
    ',': '5 1i 5 21',
    '\'': '5 a 5 -5',
    '!': 'k 0 k 1i,f 1m g 1k,h 1j j 1i,f 1o g 1q,h 1r j 1s,l 1s n 1r,o 1q p 1o,p 1m o 1k,n 1j l 1i',
    '?': '0 f 5 5 f 0 p 0 13 5 18 f 13 p p u k 13 k 18 k 1i,j 1i h 1j,g 1k f 1m,f 1o g 1q,h 1r j 1s,l 1s n 1r,o 1q p 1o,p 1m o 1k,n 1j l 1i',
    '-': '18 u 0 u',
    '_': '0 1s 18 1s',
};
const parse = code => {
    const paginate = (a, n) => {
        if (a.length <= n) return [a];
        const res = [];
        const maxLen = Math.ceil(a.length / n);
        for (let i = 0; i < maxLen; i++) res[i] = a.slice(i * n, (i + 1) * n);
        return res;
    };
    const out = [];
    for (
        const [ x, y, x2, y2, ...coords ] of code
            .split(',')
            .map(x =>
                x
                    .split(' ')
                    .map(s => parseInt(s, 32)),
            )
    ) out.push(coords.length ? { curve: true, coords: [ [x, y], [x2, y2], ...paginate(coords, 2) ] } : { x, y, x2, y2 });
    return out;
};
const f = (str, { spacing = 30, xOff = 0, yOff = 0 } = {}) => {
    let x = xOff;
    let y = yOff;
    const out = [];
    for (const c of str.split('')) {
        if (c === '\n') {
            y += spacing + 60;
            x = xOff;
            continue;
        }
        if (/\s/.test(c)) {
            x += spacing + 40;
            continue;
        }
        const code = chars[c.toLowerCase()];
        if (code) {
            out.push(
                ...parse(code).map(obj =>
                    obj.curve
                        ? obj.coords
                            .map(([cX, cY]) =>
                                [cX + x, cY + y]
                                    .map(x => x.toString(32))
                                    .join(' '),
                            )
                            .join(' ')
                        : [obj.x + x, obj.y + y, obj.x2 + x, obj.y2 + y]
                            .map(x => x.toString(32))
                            .join(' '),
                ),
            );
            x += spacing + 40;
        }
    }
    return out.join(',') + '##';
};


const getel = id => document.getElementById(id);

window.onload = () => {
    const inp = getel('inp');
    const outp = getel('outp');
    const btn = getel('btn');
    const down = getel('down');

    btn.onclick = () => {
        outp.value = f(inp.value);
    };
    down.onclick = () => {
        const d = outp.value;
        if (!d) return;
        saveAs(new Blob([ d ], { type: 'text/plain' }), 'frhd-text.txt');
    };
};