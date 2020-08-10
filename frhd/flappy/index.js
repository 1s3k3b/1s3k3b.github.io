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

const f = (n, width, space) => {
    const physics = [
        [40, 140, n * (width + (space - space / 2)), 140],
        [40, -150, n * (width + (space - space / 2)), -150],
        [n * (width + (space - space / 2)), -150, n * (width + (space - space / 2)), 140],
    ];
    const powerups = [['V', '0', 'a', '3', '1s']];
    for (let i = 1; i <= n; i++) {
        const y = ~~(Math.random() * 60) + 50;
        physics.push(
            [i * space, -150, i * space, y - 150], // upper left vertical
            [i * space + width, -150, i * space + width, y - 150], // upper right vertical
            [i * space - 20, y - 150, i * space + width + 20, y - 150], // upper tube ending bottom
            [i * space - 20, y - 130, i * space + width + 20, y - 130], // upper tube ending top
            [i * space - 20, y - 150, i * space - 20, y - 130], // upper tube ending left
            [i * space + width + 20, y - 150, i * space + width + 20, y - 130], // upper tube ending right

            [i * space, 140, i * space, y], // bottom left vertical
            [i * space + width, 140, i * space + width, y], // upper right vertical
            [i * space - 20, y, i * space + width + 20, y], // upper tube ending bottom
            [i * space - 20, y - 20, i * space + width + 20, y - 20], // upper tube ending top
            [i * space - 20, y - 20, i * space - 20, y], // upper tube ending left
            [i * space + width + 20, y - 20, i * space + width + 20, y], // upper tube ending right
        );
        powerups.push([i === n ? 'T' : 'C', ...[i * space + width / 2, y - 70].map(x => x.toString(32))]);
    }
    return `-18 1i 18 1i 18 4c,-18 1i -68 1i -68 -1s 18 -1s 18 -34 18 -3o 18 -4c 18 -4m,${
        physics
            .map(x => x
                .map(y => y.toString(32))
                .join(' '),
            )
            .join(',')
    }##${powerups.map(p => p.join(' ')).join(',')}`;
};

const getel = id => document.getElementById(id);

window.onload = () => {
    const out = getel('out');
    const len = getel('len');
    const w = getel('w');
    const s = getel('s');
    const btn = getel('btn');
    const down = getel('down');

    btn.onclick = () => {
        out.value = f(+len.value || 10, +w.value || 100, +s.value || 180);
    };
    down.onclick = () => {
        const d = out.value;
        if (!out.value) return;
        saveAs(new Blob([ d ], { type: 'text/plain' }), 'frhd-flappy-gen.txt');
    };
};