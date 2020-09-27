const getClosestColor = ([ r, g, b ], colors) => {
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
const rgbToHex = ([r, g, b]) => '#' + ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1);
const getel = id => document.getElementById(id);

window.onload = () => {
    const c = getel('c');
    const ctx = c.getContext('2d');
    const fileInp = getel('file');
    const urlInp = getel('url');
    const btn = getel('btn');

    const lR = getel('lR');
    const cD = getel('cD');
    const mC = getel('mC');
    const lW = getel('lW');
    const lCM = getel('lCM');
    const lCMI = getel('lCMI');

    const load = async url => {
        const _cD = +cD.value || 1;
        const colors = Array
            .from({ length: ~~(256 / _cD) }, (_, i) => [i * _cD, i * _cD, i * _cD])
            .filter(x => x[0] >= +mC.value || 10);
        const img = new Image();
        img.src = url;
        img.crossOrigin = 'Anonymous';
        await new Promise(r => img.onload = r);
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
        let i = 0;
        for (
            const { color, x, y, x2, y2 } of Array
                .from(
                    { length: ~~(img.width / (+lR.value || 1)) },
                    (_, i, chance = Math.random()) => Array
                        .from({ length: img.height }, () => 0)
                        .reduce(a => {
                            const last = a[a.length - 1];
                            const n = Math.random() > 0.5 ? ~~(Math.random() * ((+lCM.value || 2) - (+lCMI.value || 0))) + (+lCMI.value || 0) : 0;
                            return [...a, last + n * (Math.random() > chance || last - n <= 0 ? 1 : -1)];
                        }, [i * (+lR.value || 1)]),
                )
                .flatMap(coords => coords.map((x, y) => ({
                    x, y,
                    x2: coords[y + 1] || x,
                    y2: y + 1,
                    color: rgbToHex(colors[getClosestColor(ctx.getImageData(x, y, 1, 1).data, colors)]),
                })))
        ) {
            if (!i++) {
                ctx.beginPath();
                ctx.fillStyle = '#eeeeee';
                ctx.fillRect(0, 0, img.width, img.height);
            }
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = +lW.value || 0.5;
            ctx.moveTo(x, y);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
    };
    fileInp.onchange = () => {
        const reader = new FileReader();
        reader.readAsDataURL(fileInp.files[0]);
        reader.onload = x => load(x.target.result);
    };
    btn.onclick = () => load(urlInp.value);
};