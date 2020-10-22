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

// '     '
const chars = ['  ', 'ˇˇ', '..', ',,', '--', '^^', '**', '~~', '__', '::', ';;', '<<', '>>', '==', '//', '||', '??', '&&', '$$', '@@', '##'];
const colors = Array.from({ length: chars.length }, (_, i) => [~~(255 / chars.length) * i, ~~(255 / chars.length) * i, ~~(255 / chars.length) * i]);

const getClosestColor = ([ r, g, b ]) => {
    let res = 0;
    let biggestDifference = 1000;
    for (let i = 0; i < colors.length; i++) {
        const x = Math.sqrt(Math.pow(r - colors[i][0], 2) + Math.pow(g - colors[i][1], 2) + Math.pow(b - colors[i][2], 2));
        if (x < biggestDifference) {
            res = i;
            biggestDifference = x;
        }
    }
    return res;
};
const getel = id => document.getElementById(id);

window.onload = () => {
    const ctx = c.getContext('2d');
    const fileInp = getel('file');
    const urlInp = getel('url');

    const load = async url => {
        const img = new Image();
        img.src = url;
        img.crossOrigin = 'Anonymous';
        await new Promise(r => img.onload = r);
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
        let txt = '';
        for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
                txt += chars[chars.length - 1 - getClosestColor(ctx.getImageData(x, y, 1, 1).data)];
            }
            txt += '<br>';
        }
        saveAs(new Blob([txt.replace(/<br>/g, '\n')], { type: 'text/plain' }), 'asciiart.txt');
        document.body.style.fontSize = '1';
        document.body.style.whiteSpace = 'pre';
        document.body.innerHTML = txt;
    };
    fileInp.onchange = () => {
        const reader = new FileReader();
        reader.readAsDataURL(fileInp.files[0]);
        reader.onload = x => load(x.target.result);
    };
    btn.onclick = () => load(urlInp.value);
};