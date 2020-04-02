const getel = id => document.getElementById(id);

const weapons = [undefined, "Sniper Rifle", "Assault Rifle", "Pistol", "Submachine Gun", "Revolver", "Shotgun", "Light Machine Gun", "Semi Auto", "Rocket Launcher", "Akimbo Uzi", "Desert Eagle", "Alien Blaster", "FAMAS", "Crossbow"];

let weapon = 1;
let skin = 0;

window.onload = () => {
    const img = getel("img");
    const params = new URLSearchParams(window.location.search);
    
    const wpn = getel("wpn");
    const lefts = getel("lefts");
    const rights = getel("rights");
    const leftw = getel("leftw");
    const rightw = getel("rightw");
    const a = getel("a");
    
    img.src = "http://assets.krunker.io/textures/weapons/skins/weapon_1_" + (params.get("id") || (Math.floor(Math.random() * 120))) + ".png";
    a.addEventListener("click", () => window.open(img.src));
    
    lefts.innerText = "Prev Skin";
    rights.innerText = "Next Skin";
    leftw.innerText = "Prev Weapon";
    rightw.innerText = "Next Weapon";
    
    lefts.addEventListener("click", () => skin--);
    rights.addEventListener("click", () => skin++);
    leftw.addEventListener("click", () => {
    	if (weapon > 1) weapon--;
        wpn.innerText = weapons[weapon];
    });
    rightw.addEventListener("click", () => {
    	if (weapon < 8) weapon++;
        wpn.innerText = weapons[weapon];
    });
    document.body.addEventListener("click", () => {
        img.src = "http://assets.krunker.io/textures/weapons/skins/weapon_" + weapon + "_" + skin + ".png";
    });
};
