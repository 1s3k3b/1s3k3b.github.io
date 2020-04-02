const getLink = x => {
    const links = {
    	"function": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions",
        "number": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        "string": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
        "boolean": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        "class": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes",
        "promise": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise"
    };
    return links[x] || `https://1s3k3b.github.io/krunkerjs/docs/search?q=${x}`;
};

class br {
    constructor() {
    	this.elem = document.createElement("BR");
    }
}

class ParamElem {
    constructor(obj) {
    	const div = document.createElement("DIV");
       	const header = document.createElement("DIV");
        const para = document.createElement("P");
       	const name = document.createElement("A");
        name.innerText = obj.name;
        const hyph = document.createElement("A");
        hyph.innerText = " - ";
        const type = document.createElement("A");
        type.innerText = obj.type;
        type.href = getLink(obj.type); 
        const desc = document.createElement("P");
        desc.innerText = obj.description;
        
        para.appendChild(name);
        para.appendChild(hyph);
        para.appendChild(type);
        header.appendChild(para);
        
        if (obj.optional) {
            const text = document.createElement("P");
            text.innerText = "Optional. Default value: " + obj.defaultVal;
            header.appendChild(text);
        }
        
        header.appendChild(desc);
        div.appendChild(header);
        
        this.div = div;
    }
}

class PropElem {
    constructor(obj) {
    	const div = document.createElement("DIV");
       	const header = document.createElement("DIV");
        const para = document.createElement("P");
       	const name = document.createElement("A");
        name.innerText = obj.name;
        const hyph = document.createElement("A");
        hyph.innerText = " - ";
        const type = document.createElement("A");
        type.innerText = obj.type;
        type.href = getLink(obj.type); 
        const desc = document.createElement("P");
        desc.innerText = obj.description;
        
        para.appendChild(name);
        para.appendChild(hyph);
        para.appendChild(type);
        if (obj.returns) {
            const hyph2 = document.createElement("A");
            hyph2.innerText = " => ";
            const returns = document.createElement("A");
            returns.innerText = obj.returns;
            para.appendChild(hyph2);
            para.appendChild(returns);
        }
        header.appendChild(para);
        header.appendChild(desc);
        div.appendChild(header);
        
        if (obj.type === "function") {
            const params = document.createElement("DIV");
            params.setAttribute("class", "params");
            obj.params.forEach(p => params.appendChild(new ParamElem(p).div));
            div.appendChild(params);
        }
        
        this.div = div;
    }
}

class Elem {
    constructor(obj) {
    	const div = document.createElement("DIV");
       	const header = document.createElement("DIV");
        const para = document.createElement("P");
       	const name = document.createElement("A");
        name.innerText = obj.name;
        const hyph = document.createElement("A");
        hyph.innerText = " - ";
        const type = document.createElement("A");
        type.innerText = obj.type;
        type.href = getLink(obj.type); 
        const desc = document.createElement("P");
        desc.innerText = obj.description;
        
        para.appendChild(name);
        para.appendChild(hyph);
        para.appendChild(type);
        header.appendChild(para);
        header.appendChild(desc);
        div.appendChild(header);
        
        const properties = document.createElement("DIV");
        properties.setAttribute("class", "props");
        obj.properties.forEach(p => properties.appendChild(new PropElem(p).div) && properties.appendChild(new br().elem));
        div.appendChild(properties);
        
        this.div = div;
    }
}  

class Property {
    constructor(name, description, type, params = undefined, returns = undefined, priv = false, example = "") {
        this.name = name;
        this.description = description;
        this.type = type;
        this.params = params;
        this.returns = returns;
        this.priv = Boolean(priv);
    }
}
 
class Parameter {
    constructor(name, description, type, optional = false, defaultVal = "") {
        this.name = name;
        this.description = description;
        this.type = type;
        this.optional = optional;
        this.defaultVal = defaultVal;
    }
}

const classes = {
    Client: {
    	name: "Client",
        description: "The Client class which lets you interact with the Krunker API.",
        type: "class",
        properties: [
            new Property("fetchPlayer", "Get info about a player.", "function", [
                new Parameter("username", "The desired player's in-game name, clan tags excluded if any.", "string", true, "1s3k3b")
            ], "Promise<Player>"),
            new Property("fetchGame", "Get info about a game.", "function", [
                new Parameter("id", "The game's ID, the part in the URL after `?game=`. Constructed like `SER:a-z0-9`", "string")
            ], "Promise<Game>"),
            new Property("getPlayer", "Get info about a cached player.", "function", [
                new Parameter("username", "The desired player's in-game name, clan tags excluded if any.", "string", true, "1s3k3b")
            ], "Player|Promise<Player>"),
            new Property("_connectToSocket", "Connect to the WebSocket for getting user data. This is a private method and is used in the source code only.", "function", [], "void", true),
            new Property("_disconnectFromSocket", "Disconnect from the WebSocket for getting user data. This is a private method and is used in the source code only.", "function", [], "void", true),
            new Property("getWeapon", "Get stats about a weapon ingame.", "function", [new Parameter("name", "The weapon's name.", "string")], "Weapon"),
            new Property("getClass", "Get stats about a class ingame.", "function", [new Parameter("name", "The class' name.", "string")], "Class"),
            new Property("fetchChangelog", "Get the game's changelog.", "function", [], "Promise<Changelog>")
        ]
    },
    Class: {
        name: "class",
        description: "A class in the game.",
        type: "class",
        properties: [
            new Property("health", "The health of the class.", "number"),
            new Property("name", "The name of the class.", "string"),
            new Property("secondary", "Whether the class has a secondary weapon.", "boolean"),
            new Property("weapon", "The main weapon of the class.", "Weapon"),
            new Property("toString", "", "string")
        ]
    }
};

const getel = id => document.getElementById(id);

const capitalize = str => str[0].toUpperCase() + str.substring(1);
const find = str => {
    str = capitalize(str);
    if (classes[str]) return str;
    if (Object.values(classes).find(c => c.properties.map(p => p.name).some(x => str.includes(x)))) return Object.values(classes).find(c => c.properties.map(p => p.name).find(x => str.includes(x))).name;
};

window.onload = () => {
    const inp = getel("inp");
    const output = getel("outp");

    const fn = () => {
        const str = inp.value.trim().toLowerCase();
        const found = find(str);
        if (!found) return outp.innerHTML = "Couldn't find " + str;
        output.innerHTML = "";
        output.appendChild(new Elem(classes[found]).div);
    };
  
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
        inp.value = params.get("q");
        fn();
    }
      
    inp.addEventListener("keyup", fn);
}
