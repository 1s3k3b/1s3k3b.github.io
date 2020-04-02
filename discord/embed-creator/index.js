const getel = id => document.getElementById(id);

Object.prototype.forEach = function (callback) {
    Object.keys(this).forEach((key, index) => {
        callback(key, this[key], index, this);
    });
}

const resolveString = data => {
    if (typeof data === "string") return data;
    if (data instanceof Array) return data.join("\n");
    return String(data);
}
const resolveColor = color => {
    const colors = {
        DEFAULT: 0x000000,
        WHITE: 0xFFFFFF,
        AQUA: 0x1ABC9C,
        GREEN: 0x2ECC71,
        BLUE: 0x3498DB,
        PURPLE: 0x9B59B6,
        LUMINOUS_VIVID_PINK: 0xE91E63,
        GOLD: 0xF1C40F,
        ORANGE: 0xE67E22,
        RED: 0xE74C3C,
        GREY: 0x95A5A6,
        NAVY: 0x34495E,
        DARK_AQUA: 0x11806A,
        DARK_GREEN: 0x1F8B4C,
        DARK_BLUE: 0x206694,
        DARK_PURPLE: 0x71368A,
        DARK_VIVID_PINK: 0xAD1457,
        DARK_GOLD: 0xC27C0E,
        DARK_ORANGE: 0xA84300,
        DARK_RED: 0x992D22,
        DARK_GREY: 0x979C9F,
        DARKER_GREY: 0x7F8C8D,
        LIGHT_GREY: 0xBCC0C0,
        DARK_NAVY: 0x2C3E50,
        BLURPLE: 0x7289DA,
        GREYPLE: 0x99AAB5,
        DARK_BUT_NOT_BLACK: 0x2C2F33,
        NOT_QUITE_BLACK: 0x23272A,
    };

    if (typeof color === 'string') {
        if (color === 'RANDOM') return Math.floor(Math.random() * (0xFFFFFF + 1));
        if (color === 'DEFAULT') return 0;
        color = colors[color] || parseInt(color.replace('#', ''), 16);
    } else if (color instanceof Array) {
        color = (color[0] << 16) + (color[1] << 8) + color[2];
    }

    if (color < 0 || color > 0xFFFFFF) {
        throw new RangeError('Color must be within the range 0 - 16777215 (0xFFFFFF).');
    } else if (color && isNaN(color)) {
        throw new TypeError('Unable to convert color to a number.');
    }

    return color;
};
const toStr = obj => {
    switch (typeof obj) {
        case "string": return '"' + obj + '"';
        case "number": return String(obj);
        case "object": 
            if (obj instanceof Array) return "[" + obj.map(obj => toStr(obj)).join(", ") + "]";
            return JSON.stringify(obj);
    }
};

class RichEmbed {
    constructor(data = {}) {
        this._history = [];

        this.title = data.title;
        this.description = data.description;
        this.url = data.url;
        this.color = data.color;
        this.author = data.author;
        this.timestamp = data.timestamp;
        this.fields = data.fields || [];
        this.thumbnail = data.thumbnail;
        this.image = data.image;
        this.footer = data.footer;
        this.file = data.file;
        this.files = [];
    }

    setTitle(title) {
        title = resolveString(title);
        if (title.length > 256) throw new RangeError('RichEmbed titles may not exceed 256 characters.');
        this.title = title;
        this._history.push("setTitle(" + toStr(this.title) + ")");
        return this;
    }
    
    setDescription(description) {
        description = resolveString(description);
        if (description.length > 2048) throw new RangeError('RichEmbed descriptions may not exceed 2048 characters.');
        this.description = description;
        this._history.push("setDescription(" + toStr(this.description) + ")");
        return this;
    }
    
    setURL(url) {
        this.url = url;
        this._history.push("setURL(" + toStr(this.url) + ")");
        return this;
    }

    setColor(color) {
        this.color = resolveColor(color);
        this._history.push("setColor(" + toStr(this.color) + ")");
        return this;
    }

    setAuthor(name, icon, url) {
        this.author = { name: resolveString(name), icon_url: icon, url };
        this._history.push("setAuthor(" + toStr(this.author) + ")");
        return this;
    }

    setTimestamp(timestamp = Date.now()) {
        if (timestamp instanceof Date) timestamp = timestamp.getTime();
        this.timestamp = timestamp;
        this._history.push("setAuthor(" + toStr(this.author) + ")");
        return this;
    }

    addField(name, value, inline = false) {
        if (this.fields.length >= 25) throw new RangeError('RichEmbeds may not exceed 25 fields.');
        name = resolveString(name);
        if (name.length > 256) throw new RangeError('RichEmbed field names may not exceed 256 characters.');
        if (!/\S/.test(name)) throw new RangeError('RichEmbed field names may not be empty.');
        value = resolveString(value);
        if (value.length > 1024) throw new RangeError('RichEmbed field values may not exceed 1024 characters.');
        if (!/\S/.test(value)) throw new RangeError('RichEmbed field values may not be empty.');
        this.fields.push({ name, value, inline });
        this._history.push('addField("' + (this.fields[this.fields.length - 1].name ? this.fields[this.fields.length - 1].name : "") + '", "' + (this.fields[this.fields.length - 1].value ? this.fields[this.fields.length - 1].value : "") + '"' + (inline ? ', true' : "") + ')');
        return this;
    }

    addBlankField(inline = false) {
        return this.addField('\u200B', '\u200B', inline);
    }

    setThumbnail(url) {
        this.thumbnail = { url };
        return this;
    }

    setImage(url) {
        this.image = { url };
        return this;
    }

    setFooter(text, icon) {
        text = resolveString(text);
        if (text.length > 2048) throw new RangeError('RichEmbed footer text may not exceed 2048 characters.');
        this.footer = { text, icon_url: icon };
        return this;
    }

    get length() {
        return (
        (this.title ? this.title.length : 0) +
        (this.description ? this.description.length : 0) +
        (this.fields.length >= 1 ? this.fields.reduce((prev, curr) =>
        prev + curr.name.length + curr.value.length, 0) : 0) +
        (this.footer ? this.footer.text.length : 0) +
        (this.author ? this.author.name.length : 0));
    }
  
    toJSON () {
        return JSON.stringify({
            title: this.title,
            description: this.description,
            url: this.url,
            timestamp: this.timestamp ? new Date(this.timestamp) : null,
            color: this.color,
            fields: this.fields ? this.fields.map(field => ({ name: field.name, value: field.value, inline: field.inline })) : null,
            thumbnail: this.thumbnail ? {
                url: this.thumbnail.url,
            } : null,
            image: this.image ? {
                url: this.image.url,
            } : null,
            author: this.author ? {
                name: this.author.name,
                url: this.author.url,
                icon_url: this.author.icon_url || this.author.iconURL,
            } : null,
            footer: this.footer ? {
                text: this.footer.text,
                icon_url: this.footer.icon_url || this.footer.iconURL,
            } : null,
        }, undefined, 4);
    }

    toCode (keysn, varName = "embed") {
        return "const " + varName + " = new Discord.RichEmbed()" + (keysn ? "\n." : "") + this._history.join("\n.") + ";";
    }
}

class MessageEmbed extends RichEmbed {
    constructor(arg) {
        super(arg);
    }
}

const Discord = { RichEmbed, MessageEmbed };

window.onload = async () => {
    const embedSet = ["author", "color", "description", "footer", "image", "timestamp", "url", "title"];
    const embedAdd = ["field", "blankField"];
    const forms = {
        jsonToCode: {
            input: getel("jsoncode-input"),
            output: getel("jsoncode-output"),
            eventListeners() {
                this.input.addEventListener("keyup", () => {
                    const em = new Discord.RichEmbed();
                    try {
                        const content = JSON.parse(this.input.value);
                        for (const [key, val] of Object.entries(content)) {
                            if (embedSet.includes(key)) {
                                em["set" + key[0].toUpperCase() + key.substring(1)](val);
                            } else if (key === "fields") {
                                if (val instanceof Array) {
                                    val.forEach(f => em.addField(f.name, f.value, f.inline));
                                } else {
                                    throw new Error("The fields key must be an array");
                                }
                            } else {
                                throw new Error("Invalid key " + key);
                            }
                        }
                        this.output.value = em.toCode(Object.keys(content)[0]);
                    } catch (e) {
                        this.output.value = e;
                    }
                });
            }
        },
        codeToJSON: {
            input: getel("codejson-input"),
            output: getel("codejson-output"),
            eventListeners() {
                this.input.addEventListener("keyup", () => {
                    try {
                        const inpCode = this.input.value;
                        const varName = (inpCode.match(/(var|const|let)\s+([a-zA-Z_$]+)\s*=\s*new\s+(Discord\.)?(RichEmbed|MessageEmbed)/) || ["", "", ""])[2];
                        const em = eval(inpCode + `\n${varName}`);
                        this.output.value = ((em && typeof em.toJSON === "function") ? em.toJSON() : em);
                    } catch (e) {
                        this.output.value = e;
                    }
                });
            }
        }
    };
    
    forms.forEach((_, f) => f.eventListeners());
};
