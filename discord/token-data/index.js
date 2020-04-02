class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.discrim = data.discriminator;
        this.tag = `${this.username}#${this.discrim}`;
        this.bot = typeof data.bot === "boolean" ? data.bot : false;
    }
}

const idToBin = num => {
    let bin = "";
    let high = parseInt(num.slice(0, -10)) || 0;
    let low = parseInt(num.slice(-10));
    while (low > 0 || high > 0) {
        bin = String(low & 1) + bin;
        low = Math.floor(low / 2);
        if (high > 0) {
            low += 5000000000 * (high % 2);
            high = Math.floor(high / 2);
        }
    }
    return bin;
}
  
const idToDate = id => parseInt(idToBin(id).toString(2).padStart(64, "0").substring(0, 42), 2) + 1420070400000;

const fetchUser = id => fetch(`https://discordapp.com/api/v6/users/${id}`, {
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot " + atob("TmpjME1qY3pOekUwTVRBek16ZzJNVFl5LlhqbU1XZy53Q0N4M0t0MllwY3ZmYWhfaWZMUk1abHFYSGc=") // if you're looking at the source code, hi, yeah this is an actual token, it's in no guilds but feel free to troll or something.
    }
}).then(async r => {
    if (!r.ok) throw new Error(r.statusText);
    return new User(await r.json());
});

const fetchData = async token => {
    let data, timestamp;
    const idStr = atob(token.split(".")[0]);
    try {
        data = await fetchUser(idStr);
        timestamp = new Date(idToDate(data.id));
    } catch (e) {
        console.error(e);
        alert("Invalid token.");
    } 
    return { data, timestamp };
};

const getel = id => document.getElementById(id);

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    
    const inp = getel("inp");
    const outp = getel("outp");
    const btn = getel("btn");
    
    if (params.get("token")) inp.value = params.get("token");
    
    btn.addEventListener("click", async () => {
        if (!inp.value) return;
        const data = await fetchData(inp.value);
        if (!data.data) return;
        outp.value = `== USER ==\n\nID: ${data.data.id}\nUsername: ${data.data.username}\nDiscriminator: ${data.data.discrim}\nTag: ${data.data.tag}\nAccount created at: ${data.timestamp.toLocaleString()}\n\nToken generated at: ${""}`;
    });
};
