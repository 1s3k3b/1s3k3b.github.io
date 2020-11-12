// Copyright (c) 2017, Paul Nechifor
// https://gitlab.com/paul-nechifor/phonetic-english
let Translator, toMap;
Translator = (function() {
    function Translator(spelling) {
        let map;
        if (spelling == null) {
            spelling = Translator.spelling['default'];
        }
        this.map = map = toMap(data, spelling);
        this.translateFunc = (function(map) {
            return function(word) {
                let c0Upper, cnUpper, lower, m;
                m = map[word];
                if (m) {
                    return m;
                }
                lower = word.toLowerCase();
                m = map[lower];
                if (!m) {
                    return word;
                }
                if (word.length === 1) {
                    return m.toUpperCase();
                }
                c0Upper = word.charCodeAt(0) < 97;
                cnUpper = word.charCodeAt(word.length - 1) < 97;
                if (c0Upper && cnUpper) {
                    return m.toUpperCase();
                }
                return m[0].toUpperCase() + m.substr(1);
            };
        })(map);
    }
    Translator.spelling = {
        'default': 'a    a    a    ey   ah   uh   b    ch\nd    e    ee   f    g    h    w    i\nahy  j    k    l    m    ng   n    oi\nou   o    oh   oo   oo   p    r    sh\ns    th   th   t    uhr  v    w    y\nzh   z'.split(/\s+/),
        ipa: 'æ    ɛ    ɑː   e    ʌ    ə    b    tʃ\nd    ɛ    iː   f    g    h    hw   ɪ\naɪ   dʒ   k    l    m    ŋ    n    ɔɪ\naʊ   ɔː   oʊ   uː   ʊ    p    r    ʃ\ns    θ    ð    t    ɜr   v    w    j\nʒ    z'.split(/\s+/),
    };
    Translator.prototype.translate = function(text) {
        return text.replace(/[a-zA-Z']+/g, this.translateFunc);
    };
    return Translator;
})();
toMap = function(data, spelling) {
    let c, i, j, len, len1, line, map, newWord, parts, ref, ref1, word;
    map = {};
    ref = data.split('\n');
    for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        parts = line.split('\t');
        word = parts[0];
        newWord = [];
        ref1 = parts[1];
        for (j = 0, len1 = ref1.length; j < len1; j++) {
            c = ref1[j];
            newWord.push(spelling[c.charCodeAt(0) - 65]);
        }
        newWord = newWord.join('');
        map[word] = newWord;
        word = word.toLowerCase();
        if (!map[word]) {
            map[word] = newWord.toLowerCase();
        }
    }
    return map;
};

const f = str =>
    Translator.spelling.ipa
        .map((x, i) => [x, Translator.spelling.default[i]])
        .reduce(
            (s, [a, b]) => s.replace(new RegExp(a, 'gi'), b),
            new Translator(Translator.spelling.ipa)
                .translate(str)
                .replace(/θ/g, 'f')
                .replace(/(r|eə|ɜ:|ɪə)/g, 'w')
                .replace(/ʧ/g, 'c'),
        );

window.onload = () => (inp.onchange = () => out.innerText = f(inp.value)) && inp.onchange();

const trailingSpaces = (s, padding = 3, a = s.split('\n')) => [...Array.from({ length: padding - 1 }, () => ''), ...a, ...Array.from({ length: padding - 1 }, () => '')]
    .map(x => ' '.repeat(padding) + x + ' '.repeat(Math.max(...a.map(x => x.length)) + 5 - x.length))
    .join('\n');
console.log('No, there isn\'t an error, it\'s just incredibly slow.');
console.log();
console.log('Alternatively, try it on RunKit:', 'https://runkit.com/embed/kwgff14tuq3o');
console.log();
console.log('Or some other environment:');
console.log('%c' + trailingSpaces(`const { Translator } = require('phonetic-english');

const f = str =>
    Translator.spelling.ipa
        .map((x, i) => [x, Translator.spelling.default[i]])
        .reduce(
            (s, [a, b]) => s.replace(new RegExp(a, 'gi'), b),
            new Translator(Translator.spelling.ipa)
                .translate(str)
                .replace(/θ/g, 'f')
                .replace(/(r|eə|ɜ:|ɪə)/g, 'w')
                .replace(/ʧ/g, 'c'),
        );
        
f('The quick brown fox jumps over the lazy dog.')`), 'white-space: pre; background-color: #111111; color: white;');
console.log('As a more complicated alternative, you can also use it through my Discord bot:', 'https://1s3k3b.github.io/discord/bot');