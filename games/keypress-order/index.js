const getel = id => document.getElementById(id);

const keys = {
    'ArrowUp': ['ArrowRight', 'KeyD'],
    'KeyW': ['ArrowRight', 'KeyD'],

    'ArrowRight': ['ArrowDown', 'KeyS'],
    'KeyD': ['ArrowDown', 'KeyS'],

    'ArrowDown': ['ArrowLeft', 'KeyA'],
    'KeyS': ['ArrowLeft', 'KeyA'],

    'ArrowLeft': ['ArrowUp', 'KeyW'],
    'KeyA': ['ArrowUp', 'KeyW'],
};
const chars = {
    'ArrowUp': 'Up',
    'KeyW': 'Up',

    'ArrowRight': 'Right',
    'KeyD': 'Right',

    'ArrowDown': 'Down',
    'KeyS': 'Down',

    'ArrowLeft': 'Left',
    'KeyA': 'Left',
};
let pressed;

const fixDpi = c => {
    const dpi = window.devicePixelRatio;
    const height = +getComputedStyle(c).getPropertyValue('height')
        .slice(0, -2);
    const width = +getComputedStyle(c).getPropertyValue('width')
        .slice(0, -2);

    c.setAttribute('height', height * dpi);
    c.setAttribute('width', width * dpi);
};
window.onload = () => {
    const c = getel('c');
    const ctx = c.getContext('2d');
    fixDpi(c);

    window.addEventListener('keydown', e => {
        if (!pressed) return pressed = e.code;
        if (keys[pressed] && keys[pressed].includes(e.code)) {
            pressed = e.code;
            ctx.fillStyle = '#00ff00';
        }
        else {ctx.fillStyle = '#ff0000';}
        ctx.font = '100px Arial';
        ctx.clearRect(0, 0, c.width, c.height);
        const text = chars[e.code] || e.code.replace(/^Key/, '');
        ctx.fillText(text, window.innerWidth / 2 - ctx.measureText(text).width / 2, window.innerHeight / 2 - 50);
    });
};
