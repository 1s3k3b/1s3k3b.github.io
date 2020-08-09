const Messages = {
    'UNEXPECTED_TOKEN': token => 'Unexpected token ' + token + ' in Deflang',
    'DUPLICATE_TOKENS': () => 'No duplicate tokens allowed',
    'CANNOT_REASSIGN': name => 'Cannot reassign variable ' + name,
    'NOT_DEFINED': name => name + ' is not defined',
    'NOT_FUNCTION': name => name + ' is not a function',
    'CANNOT_RESOLVE': (x, struct) => 'Cannot resolve ' + x + ' to ' + struct,
};

const makeError = BaseError => class DeflangError extends BaseError {
    constructor(type, ...keys) {
        super(Messages[type](...keys));
    }
};

const _SyntaxError = makeError(SyntaxError);
const _TypeError = makeError(TypeError);
const _ReferenceError = makeError(ReferenceError);

const escape = str => str.replace(/[/.*+?^${}()|[\]\\]/g, '\\$&');
const resolveArray = (x, n = true) => {
    if (Array.isArray(x)) return x;
    if (typeof x === 'string') return x.split('');
    if (typeof x === 'number' && n) return Array.from({ length: x }, (_, i) => i);
    throw new _TypeError('CANNOT_RESOLVE', x, 'an array');
};
const resolveFn = x => {
    if (typeof x === 'function') return x;
    if (typeof x === 'string') return y => y[x];
    throw new _TypeError('CANNOT_RESOLVE', x, 'a function');
};

const _stringify = (obj, [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC ] = '=:,;"[]{}#|&+-/*^><!()%') => {
    const recurse = x => _stringify(x, [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC ]);
    if (obj === null) return 'Null';
    if (obj === undefined) return 'Undefined';
    if (isNaN(obj) && typeof obj === 'number') return 'NaN';
    if (['number', 'symbol'].includes(typeof obj)) return `${obj}`;
    if (typeof obj === 'boolean') return obj ? 'True' : 'False';
    if (typeof obj === 'string') return `${strD}${obj}${strD}`;
    if (Array.isArray(obj)) return `${arrO}${obj.map(recurse).join(arrS)}${arrC}`;
    if (typeof obj === 'object') {
        return `${objO}${Object.entries(obj).map(([ key, val ]) => [ key, recurse(val) ].join(objD))
            .join(objS)}${objC}`;
    }
    return 'Undefined';
};

const stringify = (obj, def = '=:,;"[]{}#|&+-/*^><!()%') =>
    `${
        (
            Array.isArray(def)
                ? def.join('')
                : String(def)
        )
            .slice(0, 23)
            .replace(/^<default>/, '=:,;"[]{}#|&+-/*^><!()%')
    }\n${_stringify(obj, def)}`;

const parse = str => {
    str = `${str}`.trim();
    if (str.startsWith('<default>')) str = '=:,;"[]{}#|&+-/*^><!()%' + str.slice(9);
    const [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ] = str;
    str = str.slice(23);
    if (Array.from(new Set([ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, lt, gt, not, fnO, fnC, mod ])).length !== 23) {
        throw new _SyntaxError('DUPLICATE_TOKENS');
    }

    const vars = new Map([
        // booleans
        ['True', { value: true, m: false }],
        ['False', { value: false, m: false }],
        // undefined, null, Infinity, NaN
        ['Undefined', { value: undefined, m: false }],
        ['Null', { value: null, m: false }],
        ['Infinity', { value: Infinity, m: false }],
        ['NaN', { value: NaN, m: false }],
        // math
        ['PI', { value: Math.PI, m: true }],
        ['Euler', { value: Math.E, m: true }],
        ['LN10', { value: Math.LN10, m: true }],
        ['LOG2E', { value: Math.LOG2E, m: true }],
        ['LOG10E', { value: Math.LOG10E, m: true }],
        ['SQRT1_2', { value: Math.SQRT1_2, m: true }],
        ['SQRT2', { value: Math.SQRT2, m: true }],
        // functions
        ['sqrt', { value: Math.sqrt, m: false }],
        ['sum', { value: (...args) => args.flat(Infinity).reduce((a, b) => a + b), m: false }],
        ['str', { value: x => `${x}`, m: false }],
        ['num', { value: x => +x, m: false }],
        ['int', { value: x => parseInt(x) || 0, m: false }],
        ['arr', { value: resolveArray, m: false }],
        [
            'range',
            {
                value: (min, max) => {
                    let isString = 0;
                    if (!max) {
                        max = min;
                        min = 0;
                    }
                    if (typeof min === 'string') {
                        min = min.charCodeAt(0);
                        isString++;
                    }
                    if (typeof max === 'string') {
                        max = max.charCodeAt(0);
                        isString++;
                    }
                    min = +min;
                    max = +max;
                    min = Math.min(min, max);
                    max = Math.max(min, max);
                    return Array
                        .from({ length: max - min + 1 }, (_, i) => i + min)
                        .map(n => isString === 2 ? String.fromCharCode(n) : n);
                },
                m: false,
            },
        ],
        ['print', { value: console.log, m: false }],
        [
            'map',
            {
                value: (a, fn) => {
                    const res = resolveArray(a).map(resolveFn(fn));
                    return typeof a === 'string' ? res.join('') : res;
                },
                m: false,
            },
        ],
        [
            'filter',
            {
                value: (a, fn) => {
                    const res = resolveArray(a).filter(resolveFn(fn));
                    return typeof a === 'string' ? res.join('') : res;
                },
                m: false,
            },
        ],
        [
            'sort',
            {
                value: x => resolveArray(x).sort(),
                m: false,
            },
        ],
        [
            'length',
            {
                value: x => {
                    if (typeof x === 'string' || Array.isArray(x)) return x.length;
                    if (typeof x === 'number') return x;
                    if (typeof x === 'object') return Object.keys(x).length;
                    return 0;
                },
                m: false,
            },
        ],
        [
            'first',
            {
                value: (arr, i = 0) => resolveArray(arr)[i],
                m: false,
            },
        ],
        [
            'last',
            {
                value: (arr, i = 0) => resolveArray(arr)[resolveArray(arr).length - i - 1],
                m: false,
            },
        ],
        ['isEven', { value: x => !(x % 2), m: false }],
        ['isOdd', { value: x => !!(x % 2), m: false }],
        [
            'random',
            {
                value: (x, max) => {
                    try {
                        const arr = resolveArray(x, false);
                        return arr[Math.floor(Math.random() * arr.length)];
                    }
                    catch {} // eslint-disable-line no-empty
                    x = +x;
                    max = +max;
                    x = Math.min(x, max);
                    max = Math.max(x, max);
                    return Math.floor(Math.random() * (max - x)) + x;
                },
                m: false,
            },
        ],
    ]);

    const _parse = s => {
        const exprPattern = `(${escape(strD)}.+${escape(strD)}|[\\w\\d${[ defD, objD, arrS, objS, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC ].map(x => `\\${x}`).join('')}]+)`;
        s = s
            .trim()
            .replace(/\n/g, '');
        const regexes = [
            [
                new RegExp(`(\\w+)${escape(fnO)}((${exprPattern},?\\s*)+)${escape(fnC)}`),
                (_, a, b) => {
                    if (!vars.has(a)) {
                        throw new _ReferenceError('NOT_DEFINED', a);
                    }
                    if (typeof vars.get(a).value !== 'function') {
                        throw new _TypeError('NOT_FUNCTION', a);
                    }
                    return stringify(
                        vars
                            .get(a)
                            .value(
                                ...b.split(/,\s*/g).map(_parse),
                            ),
                        [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ],
                    ).slice(24);
                },
            ],
            [
                new RegExp(`${escape(fnO)}(${exprPattern})${escape(fnC)}`),
                (_, e) => stringify(_parse(e), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(or)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) || _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(and)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) && _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(sum)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) + _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(sub)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) - _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(mult)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) * _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(div)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) / _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(mod)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) % _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(pow)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) ** _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(gt)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) > _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(lt)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) < _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(defD)}${escape(defD)}${escape(defD)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) === _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${exprPattern}\\s*${escape(defD)}${escape(defD)}\\s*${exprPattern}`, 'g'),
                (_, a, b) => stringify(_parse(a) == _parse(b), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
            [
                new RegExp(`${escape(not)}\\s*${exprPattern}`, 'g'),
                (_, a) => stringify(!_parse(a), [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ]).slice(24),
            ],
        ];
        let _found = regexes.find(r => r[0].test(s));
        while (_found) {
            s = s.replace(..._found);
            _found = regexes.find(r => r[0].test(s));
        }
        if (
            s.startsWith(strD)
            && s.endsWith(strD)
            && (
                s
                    .slice(1, -1)
                    .includes(strD)
                    ? s.includes(`\\${strD}`)
                    : true
            )
        ) return s.slice(1, -1);
        if (s.startsWith(arrO) && s.endsWith(arrC)) {
            return s
                .slice(1, -1)
                .split(new RegExp(`\\s*${escape(arrS)}\\s*`))
                .filter(x => x)
                .map(_parse);
        }
        if (s.startsWith(objO) && s.endsWith(objC)) {
            return Object.fromEntries(
                s
                    .slice(1, -1)
                    .split(new RegExp(`\\s*${escape(objS)}\\s*`))
                    .filter(x => x)
                    .map(se =>
                        [
                            se.split(new RegExp(`\\s*${escape(objD)}\\s*`))[0].trim(),
                            _parse(se.split(new RegExp(`\\s*${escape(objD)}\\s*`))[1]),
                        ],
                    ),
            );
        }
        if (vars.has(s)) return vars.get(s).value;
        if (/^[\d.-]+$/.test(s)) return Number(s);
        if (/^\w+$/.test(s)) {
            throw new _ReferenceError('NOT_DEFINED', s);
        }
        throw new _SyntaxError('UNEXPECTED_TOKEN', s[0]);
    };

    str = str
        .replace(
            new RegExp(`${escape(com)}\\s*.+$`, 'mg'),
            '',
        )
        .replace(
            new RegExp(`^(\\w+)${escape(fnO)}((?:\\w+,?\\s*)+)${escape(fnC)}\\s*${escape(defD)}(.+)`, 'mg'),
            (_, n, a, b) => {
                if (vars.has(n)) {
                    throw new _TypeError('CANNOT_REASSIGN', n);
                }
                vars.set(n, {
                    value: (...args) => {
                        let i = 0;
                        for (const arg of a.split(/,\s*/g)) {
                            b = b.replace(
                                new RegExp(escape(arg), 'g'),
                                stringify(
                                    args[i++],
                                    [ defD, objD, arrS, objS, strD, arrO, arrC, objO, objC, com, or, and, sum, sub, div, mult, pow, gt, lt, not, fnO, fnC, mod ],
                                ).slice(24),
                            );
                        }
                        return _parse(b);
                    },
                    m: false,
                });
                return '';
            },
        )
        .replace(
            new RegExp(`^(\\w+)\\s*${escape(objD)}${escape(defD)}(.+)`, 'mg'),
            (_, n, v) => {
                if (vars.has(n.trim()) && !vars.get(n.trim()).m) {
                    throw new _TypeError('CANNOT_REASSIGN', n.trim());
                }
                vars.set(n.trim(), { value: _parse(v.trim()), m: false });
                return '';
            },
        )
        .replace(
            new RegExp(`^(\\w+)\\s*${escape(defD)}(.+)`, 'mg'),
            (_, n, v) => {
                if (vars.has(n.trim()) && !vars.get(n.trim()).m) {
                    throw new _TypeError('CANNOT_REASSIGN', n.trim());
                }
                vars.set(n.trim(), { value: _parse(v.trim()), m: true });
                return '';
            },
        );
    return _parse(str);
};

const getel = id => document.getElementById(id);

window.onload = () => {
    const code = getel('code');
    const outp = getel('outp');
    const btn = getel('btn');

    btn.addEventListener('click', async () => {
        outp.value = '';
        let res;
        try {
            res = parse(code.value);
        } catch (e) {
            res = `${e.name}: ${e.message}`;
        }
        outp.value = res;
    });
};