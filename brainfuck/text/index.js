const f = str =>
    str
        .split('')
        .map(s => '+'.repeat(s.charCodeAt(0)) + '>')
        .join('')
        + '<'.repeat(str.length) + '[.>]';

const getel = id => document.getElementById(id);

window.onload = () => {
    const text = getel('text');
    const outp = getel('outp');
    const btn = getel('btn');

    btn.addEventListener('click', async () => {
        outp.value = '';
        const res = f(text.value);
        outp.value = res;
    });
};