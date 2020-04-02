const getel = id => document.getElementById(id);

const round = (n, r) => {
    while (n % r !== 0) n--;
    return n;
};

const spins = {
    starter: {
        name: "Starter Spin",
        description: "",
        cost: 50,
        uncommon: 75,
        rare: 22,
        epic: 3,
        legendary: 0,
        relic: 0,
        contraband: 0
    }, 
    elite: {
        name: "Elite Spin",
        description: "",
        cost: 100,
        uncommon: 50,
        rare: 30,
        epic: 15,
        legendary: 5,
        relic: 0,
        contraband: 0
    },
    heroic: {
        name: "Heroic Spin",
        description: "",
        cost: 500,
        uncommon: 0,
        rare: 48,
        epic: 35,
        legendary: 14,
        relic: 2.5,
        contraband: 0.5
    },
    hunter: {
        name: "Hunter Spin",
        description: "Sniper skins only\n",
        cost: 600,
        uncommon: 43,
        rare: 33,
        epic: 17,
        legendary: 6,
        relic: 1,
        contraband: 0
    },
    attire: {
        name: "Attire Spin",
        description: "Cosmetic items only\n",
        cost: 750,
        uncommon: 43,
        rare: 33,
        epic: 16,
        legendary: 6,
        relic: 2,
        contraband: 0
    }
};

const getSpinObj = spin => spins[spin.toLowerCase().replace(/\s*spin\s*/i, "").trim()];
const spinChance = (spin, rarity, kr) => {
    if (isNaN(kr)) return "Invalid KR amount";
    spin = getSpinObj(spin);
    rarity = rarity.toLowerCase().trim();
    if (!spin) return "Invalid spin name"
    if (spin.cost > kr) return "You can't afford a " + spin.name + " from " + kr + " KR";
    kr = round(kr, spin.cost);
    return kr / spin.cost * spin[rarity];
}

const formatSpin = spin => spin.name + " - " + spin.cost + " KR\n" + spin.description + "\n" + Object.keys(spin).filter(k => !["name", "description", "cost"].includes(k)).map(k => (k[0].toUpperCase() + k.substring(1) + " - " + spin[k] + "%")).join("\n");
const formatSpinKR = (spin, kr) => Object.keys(spin).filter(k => !["name", "description", "cost"].includes(k)).map(k => (k[0].toUpperCase() + k.substring(1) + " - " + (round(kr, spin.cost) / spin.cost * spin[k]) + "%")).join("\n");

window.onload = () => {
    const spin = getel("spinn");
    const kr = getel("kr");
    const rarity = getel("rarity");
    const btn = getel("btn");
    const output = getel("output");
    
    const params = new URLSearchParams(window.location.search);
    
    const spinp = params.get("spin");
    const krp = params.get("krp");
    const rarityp = params.get("rarity");
    
    if (spinp) spin.value = spinp;
    if (krp) kr.value = krp;
    if (rarityp) rarity.value = rarity;
    
    if (spinp && krp && rarityp) {
        const chance = spinChance(spin.value, rarity.value, parseInt(kr.value));
        if (typeof chance === "string") return output.value = chance;
        output.value = "You have a " + chance + "% chance of getting a " + rarity.value + " from a " + getSpinObj(spin.value).name + "\n\n" + formatSpin(getSpinObj(spin.value)) + "\n\nSpin chances with " + kr.value + " KR:\n" + formatSpinKR(getSpinObj(spin.value), parseInt(kr.value));
    }
    
    btn.addEventListener("click", () => {
        if (!kr.value || !rarity.value || !spin.value) return;
        const chance = spinChance(spin.value, rarity.value, parseInt(kr.value));
        if (typeof chance === "string") return output.value = chance;
        output.value = "You have a " + chance + "% chance of getting a " + rarity.value + " from a " + getSpinObj(spin.value).name + "\n\n" + formatSpin(getSpinObj(spin.value)) + "\n\nSpin chances with " + kr.value + " KR:\n" + formatSpinKR(getSpinObj(spin.value), parseInt(kr.value));
    });
};
