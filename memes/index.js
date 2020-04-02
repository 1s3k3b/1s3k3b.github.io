const memes = [{
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668108816394616842/hhneic8g36b41.jpg", 
    type: "image", 
    title: "You like your credit card?"
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668108816990076928/Pink_in_the_stink1_500x.webp", 
    type: "image", 
    title: "2 in the pink, 1 in the stink",
    desc: "A nice pair of gloves to use in bed.",
    nsfw: true
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668108817476747295/received_2768514939858352.jpeg", 
    type: "image", 
    title: "Magnum",
    desc: "A refreshing Magnum in a hot summer day...", 
    nsfw: true
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668108818755878922/received_578712596194673.jpeg", 
    type: "image", 
    title: "Nagyi Titka", 
    desc: "Vajon mi rejlik nagyi szoknyája alatt?", 
    nsfw: true
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668109233950294026/ddc7909.jpg", 
    type: "image", 
    title: "People's wallets after TeamTrees be like"
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668109234512199691/me-beating-my-meat-at-3am-my-apple-watch-why-59068528.png",
    type: "image", 
    title: "My Apple Watch at 3 AM"
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668111935300173824/received_599223670886701.jpeg",
    type: "image",
    title: "A tasty bar of Snickers", 
    nsfw: true
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668111935446712348/image1.jpg", 
    type: "image", 
    title: "smh Ninja"
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668111935828525057/unknown-4.png", 
    type: "image", 
    title: "haha yes Elon" 
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668112809414098964/image0-6.jpg", 
    type: "image",
    title: "What a sick fuck", 
    desc: "There do be a difference doe", 
    nsfw: true 
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668112808336031794/Peppa_Puzzle.png", 
    type: "image", 
    title: "Edible Jigsaw Puzzle"
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/668112808122253312/Gordon_ramsey.jpg", 
    type: "image", 
    title: "Gordon Savage", 
    desc: "Gordon do be a savage doe" 
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/669914243868393472/when-you-give-her-the-first-inch-woah-were-halfway-62177189.png",
    type: "image",
    title: "We're halfway there",
    desc: "me irl",
    nsfw: true
}, {
    url: "https://cdn.discordapp.com/attachments/661968975625846809/669915351735205894/received_2748695168541393.jpeg",
    type: "image",
    title: "Folyton ez történik",
    nsfw: true
}];
const getel = id => document.getElementById(id);
const scaleImg = (width, height) => {
    const maxWidth = 400;
    const maxHeight = 400; 
    let ratio = 0;
    
    const img = { width, height };

    if (width > maxWidth) {
        ratio = maxWidth / width;
        img.width = maxWidth;
        img.height = height * ratio;
        height = height * ratio;
        width = width * ratio;
    }
    if (height > maxHeight) {
        ratio = maxHeight / height; 
        img.height = maxHeight;
        img.width = width * ratio;  
        width = width * ratio;
        height = height * ratio; 
    }
    
    return img;
};

const addMeta = (name, content) => {
    const meta = document.createElement("meta");
    meta.name = name;
    meta.content = content;
    document.getElementsByTagName("head")[0].appendChild(meta);
};
const generateMemes = f => {
    const div = document.createElement("DIV");
    
    let i = 0;
    for (const meme of memes.filter(m => f === 0 ? !m.nsfw : f === 1 ? m.nsfw : true)) {
        const cont = document.createElement("DIV");
        
        const img = document.createElement("IMG");
        const title = document.createElement("P");
        const desc = document.createElement("A");
        
        img.src = meme.url;
        title.innerHTML = `<a href="https://1s3k3b.github.io/memes?id=${i}">${meme.title}</a>`;
        desc.innerText = meme.desc;
        
        img.onload = () => {
            const scaled = scaleImg(img.width, img.height);
            img.width = scaled.width;
            img.height = scaled.height;
        };
        
        cont.appendChild(title);
        if (meme.desc) cont.appendChild(desc);
        cont.appendChild(img);
        
        div.appendChild(cont);
        
        i++;
    }
    
    document.body.appendChild(div);
};

window.onload = () => {
    const params = new URLSearchParams(window.location.search);
    
    const id = params.get("id");
    const rr = params.get("rr");
    
    const rand = memes.filter(m => !m.nsfw)[Math.floor(Math.random() * memes.filter(m => !m.nsfw).length)];
    const meme = memes[id];
    
    if (rr == "1") {
        window.location = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        return;
    }
    if (rr == "0") return generateMemes(params.get("nsfw") == "0" ? 0 : params.get("nsfw") == 1 ? 1 : 2);
    
    if (!meme) {
        addMeta("og:title", rand.title || "ebic meme");
        addMeta("og:description", rand.desc || "ebic meme");
        addMeta(`og:${rand.type}`, rand.url);
        window.location = id === "random" ? rand.url : "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        return;
    }
    
    addMeta("og:title", meme.title || "ebic meme");
    addMeta("og:description", meme.desc || "ebic meme");
    addMeta(`og:${meme.type}`, meme.url);
    window.location = meme.url;
};
