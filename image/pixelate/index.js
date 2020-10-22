const getel = id => document.getElementById(id);
const rgbToHex = ([r, g, b]) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);

window.onload = () => {
    const ctx = c.getContext('2d');
    const fileInp = getel('file');
    const urlInp = getel('url');

    const load = async url => {
        const n = +pixel.value || 10;
        const img = new Image();
        img.src = url;
        img.crossOrigin = 'Anonymous';
        await new Promise(r => img.onload = r);
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
        const res = [];
        for (let y = 0; y < img.height; y += n) {
            for (let x = 0; x < img.width; x += n) {
                const avg = Array
                    .from({ length: n }, (_, i) => i + y)
                    .flatMap(y => Array.from({ length: n }, (_, i) => ctx.getImageData(x + i, y, 1, 1).data))
                    .reduce((a, b) => a.map((x, i) => [...x, b[i]]), [[], [], []])
                    .map(x => ~~(x.reduce((a, b) => a + b, 0) / x.length));
                res.push({
                    color: rgbToHex(avg),
                    x, y,
                    w: x + n,
                    h: y + n,
                });
            }
        }
        for (const { color, x, y, w, h } of res) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(x, y, w, h);
        }
    };
    fileInp.onchange = () => {
        const reader = new FileReader();
        reader.readAsDataURL(fileInp.files[0]);
        reader.onload = x => load(x.target.result);
    };
    btn.onclick = () => load(urlInp.value);
};