const getLink = x => {
    const links = {
    	"function": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions",
        "number": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        "string": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
        "boolean": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        "class": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes"
    };
    return links[x] || `https://1s3k3b.github.io/aurora-djs/docs/search?q=${x}`;
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
        description: 'The Client class, basically the command handler. Extends Discord.js Client. Takes ClientOptions as a parameter.',
        type: "class",
        properties: [
            new Property("_config", "The options for the client.", "ClientOptions"),
            new Property("_commands", "The Client's commands.", "Array<Command>"),
            new Property("_events", "The Client's events.", "Array<Object>")
        ]
    },
    ClientOptions: {
        name: "ClientOptions",
        description: "The parameters for the client.",
        type: "Object",
        properties: [
            new Property("ignoreBots", "Whether the Client should ignore bots' messages.", "boolean"),
            new Property("ignoreDMs", "Whether the Client should ignore direct messages.", "boolean"),
            new Property("ignoreGuilds", "Whether the Client should ignore messages in guilds (servers).", "boolean"),
            new Property("prefixes", "An array of prefixes. {{mention}} is the bot's mention.", "Array<string>"),
            new Property("welcomeMessage", "The welcome message the bot should send when a user joins a guild.", "string|function|Message"),
            new Property("leaveMessage", "The leave message the bot should send when a user leaves a guild.", "string|function|Message"),
            new Property("unknownCommandMessage", "The message the bot should send when the command isn't recognized.", "string|function|Message")
        ]
    },
    CommandInfo: {
        name: "CommandInfo",
        description: "The argument that gets passed to a command's function, along with the message.",
        type: "Object",
        properties: [
            new Property("client", "The Client.", "Client"),
            new Property("args", "The arguments the user sent.", "Array<string>"),
            new Property("flags", "The flags (--) the user sent.", "Object<string, boolean|string>"),
            new Property("prefix", "The prefix the command was called with.", "string")
        ]
    },
    Message: {
        name: "Message",
        description: "A resolvable Message the Client can send.",
        type: "Object",
        properties: [
            new Property("fn", "The function to call.", "function", [
                new Parameter("message", "The message that was sent and initiated the command.", "Discord.js Message"),
                new Parameter("info", "The commands's info, like args, flags, used prefix", "CommandInfo")
            ], "any")
        ]
    }
};

window.onload = () => Object.values(classes).forEach(x => document.body.appendChild(new Elem(x).div));
