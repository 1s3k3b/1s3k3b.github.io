window.onload = () => {
    const txta = document.getElementById("txta");
    const outpTxta = document.getElementById("outpTxta");
    
    txta.addEventListener("keyup", () => {
        outpTxta.value = txta.value.split("").map(s => "+".repeat(s.charCodeAt(0)) + ">").join("") + "<".repeat(txta.value.length) + "[.>]";
    });
};
