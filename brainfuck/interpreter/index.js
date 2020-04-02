class BrainfuckInterpreter { 
    constructor (code, input = new Array(100).fill(" ").join(""), txta) {
        let memory = new Array(30000).fill(0);
        const program = code;
        let currentByte = 0;
        let inputIndex = 0;

        let bracketsToBeClosed = 0;
        
        let output = "";
		const errors = [];

		let i = 0;
	    const interval = setInterval(() => {
			if (i++ >= program.length) return clearInterval(interval);

			memory = memory.map(Number);
		    const char = program[i];
			
			console.log("Character: " + i + " - " + char);
			console.log("Current byte: " + currentByte + " - " + memory[currentByte]);
			console.log("Memory: " + memory.filter((_, i) => (i <= 1) ? true : memory[i - 1] !== 0));
			
		    switch (char) {
    		    case ">":
        		    if (currentByte + 1 >= memory.length) memory.push(0, 0, 0, 0, 0, 0, 0);
        		    currentByte++;
                    break;
                case "<":
        		    if (currentByte > 0) currentByte--;
                    break;
                case "+":
        		    memory[currentByte] += 1;
                    break;
                case "-":
        		    memory[currentByte] -= 1;
                    break;
                case ".":
        		    output += String.fromCharCode(memory[currentByte]);
        		    break;
                case ",":
				const inpIpp = inputIndex++;
				    if (!input[inpIpp]) break;
        		    memory[currentByte] = input[inpIpp].charCodeAt(0);
                    break;
                case "[":
        		    bracketsToBeClosed++;
                    if (memory[currentByte] === 0) {
            		    let currI = i;
                        while (program[currI] !== "]") {
                		    currI++;
                        }
                        i = currI;
                    }
                    break;
                case "]":
					/*if (bracketsToBeClosed === 0) {
						errors.push("Unexpected closing bracket (character " + (i + 1) + ")");
						break;
					}*/
        		    bracketsToBeClosed--;
                    if (memory[currentByte] !== 0) {
            		    let currI = i;
            		    while (program[currI] !== "[") {
                		    currI--;
                        }
                        i = currI;
                    }
                    break;
			    default:
				    errors.push("Invalid token " + char + " (character " + i + ")");
				    break;
            }
        }, program.length);
		
		//if (bracketsToBeClosed > 0) errors.push(bracketsToBeClosed + " unclosed brackets");
        
		if (errors[0]) output = errors.join("\n");
		
            txta.value = output;
    }
 }

window.onload = () => {
	const btn = document.getElementById("btn");
	const txta = document.getElementById("txta");
        const input = document.getElementById("inp");
	const outputTxta = document.getElementById("outputTxta");
	//const filePicker = document.getElementById("picker");
	
	let file;
	
	/*filePicker.addEventListener("change", function () {
		const eFile = this.files[0];
		if ((e.type !== "b" && !e.name.endsWith(".b")) || (e.type !== "txt" && !e.name.endsWith(".txt"))) {
			return alert("Invalid file extension");
		}
		const reader = new FileReader()
		reader.readAsText(eFile, "UTF-8");
		reader.onread = evt => {
			file = evt.target.result;
		};
		reader.onerror = () => {
			alert("There was an error reading that file. Please paste its content manually.");
		};
	}, false);*/
	
	btn.addEventListener("click", () => {
		const fileCont = file ? file : txta.value;
		
		if (!fileCont) return;
		
		new BrainfuckInterpreter(fileCont, (input.value ? input.value : ""), outputTxta);
	});
};
