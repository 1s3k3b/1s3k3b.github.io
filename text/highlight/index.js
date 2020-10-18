const highlight = (b, a) => {
    const method = (
        s => ['uppercase', 'lowercase', 'append', 'prepend', 'enclose'].find(x => x === s) || 'enclose'
    )(
        prompt('Highlight method (uppercase, lowercase, append, prepend, enclose)', 'enclose')?.toLowerCase()
    );
    const prepend = ['prepend', 'enclose'].includes(method) && prompt('Prepending character', '[');
    const append = ['append', 'enclose'].includes(method) && prompt('Appending character', ']');
    const modify = x => method === 'uppercase'
        ? x.toUpperCase()
        : method === 'lowercase'
            ? x.toLowerCase()
            : method === 'append'
                ? `${x}${append}`
                : method === 'prepend'
                    ? `${prepend}${x}`
                    : `${prepend}${x}${append}`;
    let lastI = -1;
    for (
        const c of a
            .split('')
            .filter(x => x.toLowerCase() !== x.toUpperCase())
    ) {
        const i = b
            .split('')
            .findIndex((x, y) => y > lastI && x.toLowerCase() === c.toLowerCase());
        if (i === -1) break;
        b = b
            .split('')
            .map((x, y) => y === i ? modify(x) : x)
            .join('');
        lastI = i;
    }
    return b;
};

window.onload = () => btn.onclick = () => r.value = highlight(a.value, b.value);