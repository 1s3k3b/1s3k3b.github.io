(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g,"undefined"!=typeof module&&(module.exports=g)});

var Types;
(function (Types) {
    Types[Types["VAR"] = 0] = "VAR";
    Types[Types["REPEAT"] = 1] = "REPEAT";
    Types[Types["IF"] = 2] = "IF";
    Types[Types["WHILE"] = 3] = "WHILE";
    Types[Types["JS"] = 4] = "JS";
    Types[Types["INCREMENT"] = 5] = "INCREMENT";
    Types[Types["DECREMENT"] = 6] = "DECREMENT";
    Types[Types["PHYSICS"] = 7] = "PHYSICS";
    Types[Types["SCENERY"] = 8] = "SCENERY";
    Types[Types["POWERUP"] = 9] = "POWERUP";
})(Types = {});

const getLevel = (a, i) => {
    let amount = 0;
    let level = 0;
    a
        .filter((_, _i) => _i > i)
        .every(e => {
            if (!level) {
                level = e.match(/^\s+/)?.[0].length || 0;
                return ++amount;
            }
            if (!new RegExp(`^${'\\s'.repeat(level)}`).test(e)) return false;
            return ++amount;
        });
    return { amount, level };
};

const parse = string => {
    const out = [];
    let index = 0;
    let ignore = 0;
    const split = string
        .replace(/#.+$/gm, '')
        .split('\n');
    for (const line of split) {
        if (ignore) {
            ignore--;
            index++;
            continue;
        }
        const splitLine = line
            .split(/\s/g)
            .map(x => x.trim())
            .filter(x => x);
        const statement = splitLine[0]
            ?.toLowerCase()
            .trim();
        switch (statement) {
            case 'var':
                const [, identifier, ...value] = splitLine;
                if (!identifier) throw new SyntaxError('Variable name expected after `var`');
                if (!/^\w[\d\w]*$/.test(identifier)) {
                    throw new SyntaxError(`Invalid variable name: ${
                        /^\w/.test(identifier)
                            ? `invalid character ${identifier.match(/^(\w|\d)+([^\w\d])![0]/)}`
                            : 'identifiers must start with letters or _'
                    }`);
                }
                if (!value) throw new SyntaxError('Value expected in variable declaration');
                out.push({
                    type: Types.VAR,
                    identifier,
                    value: value.join(' '),
                });
                break;
            case 'increment':
            case 'decrement':
                const [, x, ...n] = splitLine;
                const val = n.join(' ');
                if (!x) throw new SyntaxError(`Variable name expected after ${statement} statement`);
                if (!n) throw new SyntaxError(`Value expected in ${statement} statement`);
                out.push({
                    type: Types[statement.toUpperCase()],
                    identifier: x,
                    value: val,
                });
                break;
            case 'repeat': {
                const n = splitLine.slice(1).join(' ');
                if (!n) throw new SyntaxError('Number or function call expected after repeat');

                const { amount } = getLevel(split, index);
                ignore = amount;
                const block = parse(split
                    .filter((_, i) => i > index && i <= index + amount)
                    .join('\n'));
                out.push({
                    type: Types.REPEAT,
                    repeat: n,
                    block,
                });
                break;
            }
            case 'if':
            case 'while': {
                const condition = splitLine.slice(1).join(' ');
                if (!condition.trim()) throw new SyntaxError(`Condition expected after ${statement} statement`);

                const { amount } = getLevel(split, index);
                ignore = amount;
                const block = parse(split
                    .filter((_, i) => i > index && i <= index + amount)
                    .join('\n'));
                out.push({
                    type: Types[statement.toUpperCase()],
                    condition,
                    block,
                });
                break;
            }
            case 'physics':
            case 'scenery': {
                const [, ...coords] = splitLine;
                if (coords.length < 4) throw new SyntaxError(`${['x', 'y', 'x2', 'y2'][coords.length]} coordinate expected in ${statement} statement`);
                out.push({
                    type: Types[statement.toUpperCase()],
                    coords,
                });
                break;
            }
            case 'powerup':
                const [, ...args] = splitLine;
                out.push({
                    type: Types.POWERUP,
                    args,
                });
            case 'javascript': {
                const { amount } = getLevel(split, index);
                ignore = amount;
                const code = split
                    .filter((_, i) => i > index && i <= index + amount)
                    .join('\n');
                out.push({
                    type: Types.JS,
                    code,
                });
                break;
            }
            default: if (statement) throw new SyntaxError(`Unknown statement \`${statement}\``);
        }
        index++;
    }
    return out;
}

const _compile = parsed => {
    let out = '';
    for (const el of parsed) {
        switch (el.type) {
            case Types.VAR:
                out += `var ${el.identifier} = ${el.value};\n`;
                break;
            case Types.REPEAT:
                out += `for (let i = 0; i < ${el.repeat}; i++) {
    ${_compile(el.block)}}
`;
                break;
            case Types.IF:
            case Types.WHILE:
                out += `${el.type === Types.IF ? 'if' : 'while'} (${el.condition}) {
    ${_compile(el.block)}}
`;
                break;
            case Types.JS:
                out += el.code;
                break;
            case Types.INCREMENT:
            case Types.DECREMENT:
                out += `${el.identifier} ${el.type === Types.DECREMENT ? '-' : '+'}= ${el.value};\n`;
                break;
            case Types.PHYSICS:
            case Types.SCENERY:
                out += `${el.type === Types.PHYSICS ? 'physics' : 'scenery'}.push([${el.coords}]);\n`;
                break;
            case Types.POWERUP:
                out += `powerups.push(${el.args.join(' ')});\n`;
                break;
        }
    }
    return out;
}

const compile = string =>
    `const random = (min, max) => ~~(Math.random() * (max - min)) + min;
const physics = [];
const scenery = [];
const powerups = [];
var x = 0;
var y = 0;
${_compile(parse(string))}
\`\${physics.map(x => x.map(y => y.toString(32)).join(\' \')).join(\',\')}#\${scenery.map(x => x.map(y => y.toString(32)).join(\' \')).join(\',\')}#\${powerups.join(\',\')}\``;

const presets = [
    /*`var length 100   // the amount of lines
var min -60      // the minimum y position
var max 60       // the maximum y position
var shade 2      // the amount of scenery lines to shade with
var shadeSpace 3 // the space between scenery lines

physics -40 50 40 50
increment x 40
increment y 50

repeat shade
  scenery -40 50+(i+1)*shadeSpace 40 50+(i+1)*shadeSpace

repeat length
  var _x x
  var _y y
  increment x random(20, 100)
  if Math.random() > 0.5 && y < max
    increment y ~~(Math.random() * (max - y))
  if y >= max - 1
    decrement y 10
  if y <= min + 1
    increment y 10
  if _y !== y && Math.random() > 0.5 && y > min
    decrement y ~~(Math.random() * (y - min))
  physics _x _y x y
  repeat shade
    scenery _x _y+(i+1)*shadeSpace x y+(i+1)*shadeSpace
  if !(i % ~~Math.sqrt(length))
    powerup \`C \${x.toString(32)} \${(y-30).toString(32)}\`
  if i === length - 1
    powerup \`T \${x.toString(32)} \${(y-30).toString(32)}\``, */
    `var width 3000
var height 1000

physics x y x+width y
physics x y+height x+width y+height
physics x+width y x+width y+height
physics x y x y+height

repeat (height - y) / 10
  scenery x i*10 x+width i*10
  var j i
  repeat (width - x) / 20
    scenery i*20+(j%2)*10 j*10 i*20+(j%2)*10 (j+1)*10`,
    `var n 100
var m n

repeat m
  var _x x
  var _y y
  increment x Math.sin(i) * n
  increment y Math.cos(i) * n
  physics _x _y x y`,
    `var length 5000 // the amount of lines
var chance 0.95 // the chance for switching directions when adding a line

var dirX 1
var dirY 1
repeat length
  var _x x
  var _y y
  if Math.random() > chance
    var dirX dirX === 1 ? -1 : 1
  if Math.random() > chance
    var dirY dirY === 1 ? -1 : 1
   increment x 2 * dirX
   increment y 2 * dirY
   scenery _x _y x y`,
     `var len 100

physics 0 len*10 len*10 len*10
repeat len 
  physics len*10 i*10 (len-i)*10 len*10
    `,
    `var count 20
var space1 10
var space2 500
var rectS 20

repeat count
  var x i - count / 2
  var j i
  repeat count
    var y i - count / 2
    var _x x*space1
    var _y y*space1
    var _x2 x*space2
    var _y2 y*space2
    scenery _x _y _x+rectS _y
    scenery _x _y+rectS _x+rectS _y+rectS
    scenery _x+rectS _y _x+rectS _y+rectS
    scenery _x _y _x _y+rectS 
    scenery _x2 _y2 _x2+rectS _y2 
    scenery _x2 _y2+rectS _x2+rectS _y2+rectS
    scenery _x2+rectS _y2 _x2+rectS _y2+rectS
    scenery _x2 _y2 _x2 _y2+rectS 
    scenery _x _y _x2 _y2
    scenery _x _y+rectS _x2 _y2+rectS
    scenery _x+rectS _y+rectS _x2+rectS _y2+rectS
    scenery _x+rectS _y _x2+rectS _y2`,
    `var width 200
var height 5
var tileS 50
var grassMin 2
var grassHeight 15
var increaseChance 0.4
var decreaseChance 0.7
var fillChance 0.97

decrement x 1
increment y 50

repeat tileS
  physics (i+x)*tileS y (i+x)*tileS+tileS y
  physics (i+x)*tileS y+tileS (i+x)*tileS+tileS y+tileS
  physics (i+x)*tileS+tileS y (i+x)*tileS+tileS y+tileS
  physics (i+x)*tileS y (i+x)*tileS y+tileS
  var j i
  repeat tileS
    scenery (j+x)*tileS+i y (j+x)*tileS+i y+random(grassMin,grassHeight)
  repeat height
    physics (j+x)*tileS y+i*tileS (j+x)*tileS+tileS y+i*tileS
    physics (j+x)*tileS y+tileS+i*tileS (j+x)*tileS+tileS y+tileS+i*tileS
    physics (j+x)*tileS+tileS y+i*tileS (j+x)*tileS+tileS y+tileS+i*tileS
    physics (j+x)*tileS y+i*tileS (j+x)*tileS y+tileS+i*tileS
    var k i
    repeat tileS
      var l i
      repeat tileS
        if Math.random() > fillChance
          scenery (j+x)*tileS+l y+k*tileS+i (j+x)*tileS+l+2 y+k*tileS+i+2
  increment y Math.random() > increaseChance ? tileS : Math.random() > decreaseChance ? -tileS : 0`
];
const getel = id => document.getElementById(id);

window.onload = () => {
    const code = getel('inp');
    const out = getel('outp');
    const comp = getel('comp');
    const btn = getel('btn');
    const down = getel('down');
    const preset = getel('presets');

    code.value = presets[0];

    preset.onchange = () => {
        if (presets[preset.selectedIndex] && confirm('Are you sure you want to load that preset?')) code.value = presets[preset.selectedIndex];
    };
    btn.onclick = () => {
        let compiled;
        try {
            compiled = compile(code.value);
        } catch (e) {
            return [out, comp].map(x => x.value = e.message);
        }
        comp.value = compiled;
        out.value = eval(compiled);
    };
    down.onclick = () => {
        const d = out.value;
        if (!out.value) return;
        saveAs(new Blob([ d ], { type: 'text/plain' }), 'frhd-lang-gen.txt');
    };
};

window.onbeforeunload = () => true;