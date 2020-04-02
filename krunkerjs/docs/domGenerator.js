const getLink = x => {
	const links = {
    	"function": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions",
        "number": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        "string": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
        "boolean": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
        "class": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes"
    };
    return (links[x] ? links[x] : "");
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
