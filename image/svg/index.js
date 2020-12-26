window.onload = () => btn.onclick = () => {
    const svg = document.createElement('div');
    const c = document.createElement('canvas');
    const img = new Image();
    svg.innerHTML = /^\s*<\s*svg\s*(\s[^>]+)?>[\s\S]*<\s*\/\s*svg\s*>\s*$/.test(txt.value) ? txt.value : `<svg>${txt.value}</svg>`;
    img.src = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg.children[0]));
    img.onload = () => {
        c.width = img.width;
        c.height = img.height;
        document.body.appendChild(c);
        c
            .getContext('2d')
            .drawImage(img, 0, 0);
        const dataURL = c.toDataURL('image/png');
        document.body.removeChild(c);
        const element = document.createElement('a');
        element.setAttribute('href', dataURL);
        element.setAttribute('download', ((prompt('Enter a filename', 'svg') || 'svg') + '.png').replace(/(\.png)+$/, '.png'));
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
};