const getel = id => document.getElementById(id);
const gen = name => `<div align="center"><p><a href="https://nodei.co/npm/${name}/"><img src="https://nodei.co/npm/${name}.png?downloads=true&stars=true"></a></p><p><a href="https://www.npmjs.com/package/${name}"><img src="https://img.shields.io/npm/v/${name}.svg?maxAge=3600" alt="Version"></a><a href="https://www.npmjs.com/package/${name}"><img src="https://img.shields.io/npm/dt/${name}.svg?maxAge=3600" alt="Downloads"></a></p></div>

# Installation
npm: \`npm i ${name}\``;

window.onload = () => {
    const params = new URLSearchParams(window.location.search);

    const inp = getel("inp");
    const btn = getel("btn");
    const outp = getel("outp");
    
    if (params.get("name")) inp.value = params.get("name");
    
    btn.addEventListener("click", () => {
        if (inp.value) outp.value = gen(inp.value);
    });
};
