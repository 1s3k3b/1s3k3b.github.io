const visualize = obj => {
    if ([ 'string', 'number', 'boolean' ].includes(typeof obj)) {
        const res = document.createElement('P');
        res.innerText = obj;
        res.classList.add(typeof obj);
        return res;
    }
    if (obj instanceof Array) {
        const res = document.createElement('UL');
        for (const el of obj.map(visualize)) {
            const li = document.createElement('LI');
            li.appendChild(el);
            res.appendChild(li);
        }
        return res;
    }
    if (typeof obj === 'object') {
        const res = document.createElement('TABLE');
        for (const key in obj) {
            const tr = document.createElement('TR');
            const kTh = document.createElement('TH');
            const vTh = document.createElement('TH');
            kTh.innerText = key;
            vTh.appendChild(visualize(obj[key]));
            tr.appendChild(kTh);
            tr.appendChild(vTh);
            res.appendChild(tr);
        }
        return res;
    }
};

window.onload = () => {
    const obj = JSON.parse(
        new URLSearchParams(window.location.search).get('json') ?
            atob(new URLSearchParams(window.location.search).get('json')) :
            JSON.stringify(
                {
                    'a': 'b',
                    'c': 'd',
                    'e': [ 'f', [ 'g', {
                        'h': 'i',
                        'j': 'k',
                        'l': [ 'm', [ 'n' ] ],
                    } ] ],
                    'o': 'p',
                    'q': 'r',
                    's': [ 't', {
                        'u': 'v',
                        'w': 'x',
                        'y': [ 'z' ],
                    } ],
                }),
    );
    document.body.appendChild(visualize(obj));
};
