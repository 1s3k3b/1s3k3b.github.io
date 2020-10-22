const f = str =>
    str
        .split('')
        .map(s => '+'.repeat(s.charCodeAt(0)) + '>')
        .join('')
        + '<'.repeat(str.length) + '[.>]';

window.onload = () =>
    btn.addEventListener('click', async () => {
        outp.value = '';
        const res = f(text.value);
        outp.value = res;
    });