const inspect = (obj, { indent = 2, string = 1, depth = 3 } = {}, __depth__ = 0, __indentLevel__ = indent) => {
    if (depth < 2) throw new RangeError('"depth" option must be greater than 1');

    const strW = ['\'', 1].includes(string) ? '\'' : '"';
    const recurse = object => inspect(object, { indent, string, depth }, __depth__ + 1, __indentLevel__ + indent);

    if (__depth__ > depth) return typeof obj === 'string' ? `${strW}${obj}${strW}` : `[${obj && obj.constructor ? obj.constructor.name : typeof obj}]`;

    if (typeof obj === 'string') return __depth__ ? `${strW}${obj}${strW}` : obj;
    if (['boolean', 'number', 'undefined'].includes(typeof obj)) return `${obj}`;
    if (typeof obj === 'symbol') return String(obj);

    if (typeof obj === 'function' || obj instanceof Function) return `[Function${obj.name ? ' ' + obj.name : ''}: ${obj.length}]`;
    if (obj instanceof Array || obj instanceof Set) {
        const mapped = (obj instanceof Set ? Array.from(obj) : obj).map(recurse).join(', ');
        const keys = Object.keys(obj).filter(k => isNaN(parseInt(k)))
            .map(k => `${k}: ${recurse(obj[k])}`)
            .join(',\n' + ' '.repeat(__indentLevel__));
        return `${obj.constructor === Array ? '' : obj.constructor.name} [${keys.length ? '\n' + ' '.repeat(__indentLevel__) : ' '}${mapped}${keys.length ? ',\n' + ' '.repeat(__indentLevel__) : ' '}${keys.length ? keys + '\n' : ''}]`;
    }
    if (obj instanceof Map) {
        const entries = [...obj.entries()].map(([ k, v ]) => `${recurse(k)} => ${recurse(v)}`).join(',\n' + ' '.repeat(__indentLevel__));
        return `${obj.constructor.name} {\n${' '.repeat(__indentLevel__) + entries}\n${' '.repeat(__indentLevel__ - indent)}}`;
    }
    if (obj instanceof Promise) return `${obj.constructor.name} { <pending> }`;

    const keys = Object.keys(obj).map(k => `${recurse(k)}: ${recurse(obj[k])}`)
        .join(',\n' + ' '.repeat(__indentLevel__));
    return `${obj.constructor === Object ? '' : obj.constructor.name + ' '}{\n${' '.repeat(__indentLevel__) + keys}\n${' '.repeat(__indentLevel__ - indent)}}`;
};

const evalStr = async (str, depth, insp) => {
    const out = [];

    (() => {
        const consoleFn = (...args) =>
            void out.push(
                args
                    .map(x => (insp ? inspect : String)(x, { depth }))
                    .join(' '),
            );
        console.log = consoleFn;
        console.info = consoleFn;
        console.warn = consoleFn;
        console.error = consoleFn;
    })();

    try {
        console.log(await eval(str));
        return out.join('\n');
    }
    catch (e) {
        return out.join('\n') + (out.length ? '\n' : '') + e.name + ': ' + e.message;
    }
};

window.onload = () => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('code')) inp.value = atob(params.get('code'));
    if (params.get('depth')) depth.value = params.get('depth');
    if (params.get('inspect')) insp.checked = !!+params.get('inspect');

    btn.addEventListener('click', async () => {
        outp.value = '';
        const res = await evalStr(inp.value, +depth.value || 3, insp.checked);
        outp.value = res;
    });
    linkgen.addEventListener('click', () => {
        outp.value = `https://1s3k3b.github.io/eval?code=${btoa(inp.value)}&depth=${+depth.value || 3}&inspect=${+insp.checked}`;
    });
};

window.onbeforeunload = () => true;
