class Property {
    constructor(name, description, type, params = undefined, returns = undefined, private = false, example = "") {
        this.name = name;
        this.description = descritpion;
        this.type = type;
        this.params = params;
        this.returns = returns;
        this.private = Boolean(private);
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
