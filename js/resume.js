var cmd_list = [];
var cmd_index = 0;
var available_cmd = [
	"about",
	"education",
	"projects",
	"experience",
	"skills",
	"contact",
	"download",
	"help",
	"clear",
	"ls",
	"theme",
	"quote",
	"joke",
	"matrix",
	"easteregg",
];

var available_themes = {
	"dark": {
		"background_color": "#000000",
		"color": "#CCC5B9",
		"type": 0
	},
	"monokoi": {
		"background_color": "#272822",
		"color": "#FF007F",
		"type": 0
	},
	"sublime": {
		"background_color": "#272822",
		"color": "#FF007F",
		"type": 0
	},
	"light": {
		// Lighter background with dark gray text for better readability
		"background_color": "#F8F8F8",
		"color": "#1A1A1A",
		"type": 1
	},
	"light-dark": {
		"background_color": "#131417",
		"color": "#3E7EFF",
		"type": 0
	},
	"default": {
		"background_color": "#131417",
		"color": "#3E7EFF",
		"type": 0
	},
	"ocean": {
		// A theme with a cool ocean color scheme
		"background_color": "#0C2D48",
		"color": "#88E1F2",
		"type": 0
	},
	"forest": {
		// A theme with a green-ish tint
		"background_color": "#1B3B2F",
		"color": "#A8FFBD",
		"type": 0
	},
	"solarized-light": {
		// Another light theme inspired by Solarized color scheme
		"background_color": "#FDF6E3",
		"color": "#657B83",
		"type": 1
	}
};

var cmd = document.getElementById("command");

// cmd.addEventListener("keyup", function (event) {
// 	if (event.keyCode === 13) {
// 		event.preventDefault();
// 		run_command();
// 	} else if (event.keyCode === 38) {
// 		event.preventDefault();
// 		cycle_command("up");
// 	} else if (event.keyCode === 40) {
// 		event.preventDefault();
// 		cycle_command("down");
// 	} else if ((event.keyCode === 32 && event.ctrlKey)) {
// 		event.preventDefault();
// 		tab_completion();
// 	}
// });

cmd.addEventListener("keydown", (event) => {
	switch (event.key) {
		case "Enter":
			event.preventDefault();
			run_command();
			break;
		case "ArrowUp":
			event.preventDefault();
			cycle_command("up");
			break;
		case "ArrowDown":
			event.preventDefault();
			cycle_command("down");
			break;
		case "Tab":
			event.preventDefault();
			tab_completion();
			break;
	}
});


$("#command").keydown(function (e) {
	if (e.which === 9) {
		event.preventDefault();
		tab_completion();
	}
});


function run_command() {
	const cmd = document.getElementById("command");
	const input = cmd.value.trim().toLowerCase();

	if (!input) return;

	const command = input.split(" ")[0]; // Extract the command
	const args = input.split(" ").slice(1); // Extract the arguments

	if (!available_cmd.includes(command)) {
		displayWithTypingEffect("Command not found. Type 'help' for available commands.");
		return;
	}

	// Handle specific commands
	switch (command) {
		case "theme":
			handleThemeCommand(args);
			break;
		case "quote":
			displayWithTypingEffect("Fetching a random quote...");
			FunCommands.quote();
			break;
		case "joke":
			displayWithEffect("Fetching a random joke...");
			FunCommands.joke();
			break;
		case "matrix":
			displayWithTypingEffect("Activating Matrix mode...");
			FunCommands.matrix();
			break;
		case "clear":
			clear_console();
			break;
		case "download":
			window.open("resources/resume.pdf", "_blank");
			displayCommandOutput(input, "Downloading resume...");
			break;
		default:
			handleGenericCommand(input);
	}

	cmd_list.push(input);
	cmd_index = cmd_list.length;
	cmd.value = ""; // Clear the input
	scrollToBottom(); // Scroll to the latest output
}

function handleThemeCommand(args) {
	var keys_themes = Object.keys(available_themes);
	if (args.length !== 1) {
		displayWithTypingEffect("Usage: theme <theme-name>");
		displayCommandOutput("theme",`Available Themes: <span style="color: #7F0055;">${keys_themes.join(", ")}</span>`);
		return;
	}

	const themeName = args[0];
	const theme = available_themes[themeName];

	if (!theme) {
		displayWithTypingEffect(`Invalid theme. Available themes: ${Object.keys(available_themes).join(", ")}`);
		return;
	}

	// Apply theme styles
	document.body.style.backgroundColor = theme.background_color;
	document.body.style.color = theme.color;
	$(".ascii").css("color", theme.color);

	if (theme.type === 0) {
		$("#error pre").css("color", "white");
		$("#help tr").css("color", "black");
	} else {
		$("#error pre").css("color", "black");
		$("#help tr").css("color", theme.color);
	}

	displayWithTypingEffect(`Theme changed to ${themeName}.`);
}

function handleGenericCommand(input) {
	const element = document.getElementById(input);

	if (!element) {
		displayWithTypingEffect("Invalid command or no output available.");
		return;
	}

	const output = element.cloneNode(true);
	output.style.display = "block";
	displayCommandOutput(input, output.outerHTML);
}
function displayCommandOutput(command, message) {
	const executedCommands = document.getElementById("executed_commands");

	const cmdOutput = document.createElement("div");
	const container = document.createElement("div");

	cmdOutput.appendChild(container);
	container.innerHTML = `<span style="color:green">➜</span>
        <span style="color:cyan">[Anshul@root]</span> ${command}<br>${message}`;

	executedCommands.appendChild(cmdOutput);

	// Add command to history
	cmd_list.push(command);
}
function scrollToBottom() {
	const scrollingElement = document.scrollingElement || document.body;
	scrollingElement.scrollTop = scrollingElement.scrollHeight;
}



function cycle_command(direction) {
	if (direction === "up") {
		if (cmd_index > 0)
			cmd_index -= 1;
	} else if (direction === "down") {
		if (cmd_index < cmd_list.length - 1)
			cmd_index += 1;
	}
	var cmd = document.getElementById("command");
	cmd.value = cmd_list[cmd_index];
}

// function tab_completion() {
// 	var cmd = document.getElementById("command");
// 	var input = cmd.value.toLowerCase();
//
// 	for (index = 0; index < available_cmd.length; index++) {
// 		if (available_cmd[index].startsWith(input)) {
// 			cmd.value = available_cmd[index];
// 			break;
// 		}
// 	}
// }

function tab_completion() {
	const cmd = document.getElementById("command");
	const input = cmd.value.trim().toLowerCase();
	const matches = available_cmd.filter((command) => command.startsWith(input));

	if (matches.length === 1) {
		cmd.value = matches[0]; // Auto-complete if only one match
	} else if (matches.length > 1) {
		displayWithTypingEffect(`Possible completions: ${matches.join(", ")}`);
	} else {
		displayWithTypingEffect("No matching commands found.");
	}
}


function clear_console() {
	document.getElementById("executed_commands").innerHTML = "";
	document.getElementById("command").value = "";
}

function showTime() {
	var date = new Date();
	var h = date.getHours();
	var m = date.getMinutes();
	var s = date.getSeconds();
	var session = "AM";

	if (h == 0) {
		h = 12;
	}

	if (h > 12) {
		h = h - 12;
		session = "PM";
	}

	h = (h < 10) ? "0" + h : h;
	m = (m < 10) ? "0" + m : m;
	s = (s < 10) ? "0" + s : s;
	var today = new Date();
	const monthNames = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	var date = monthNames[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();

	var time = date + "::" + h + ":" + m + ":" + s + " " + session;
	document.getElementById("MyClockDisplay").innerText = time;
	document.getElementById("MyClockDisplay").textContent = time;

	setTimeout(showTime, 1000);
}

showTime();



function getAge() {
	var dateString = "04/27/1997"
	var now = new Date();
	var today = new Date(now.getYear(), now.getMonth(), now.getDate());

	var yearNow = now.getYear();
	var monthNow = now.getMonth();
	var dateNow = now.getDate();

	var dob = new Date(dateString.substring(6, 10),
		dateString.substring(0, 2) - 1,
		dateString.substring(3, 5)
	);

	var yearDob = dob.getYear();
	var monthDob = dob.getMonth();
	var dateDob = dob.getDate();
	var age = {};
	var ageString = "";
	var yearString = "";
	var monthString = "";
	var dayString = "";


	yearAge = yearNow - yearDob;

	if (monthNow >= monthDob)
		var monthAge = monthNow - monthDob;
	else {
		yearAge--;
		var monthAge = 12 + monthNow - monthDob;
	}

	if (dateNow >= dateDob)
		var dateAge = dateNow - dateDob;
	else {
		monthAge--;
		var dateAge = 31 + dateNow - dateDob;

		if (monthAge < 0) {
			monthAge = 11;
			yearAge--;
		}
	}
	age = {
		years: yearAge,
		months: monthAge,
		days: dateAge
	};

	if (age.years > 1) yearString = " years";
	else yearString = " year";
	if (age.months > 1) monthString = " months";
	else monthString = " month";
	if (age.days > 1) dayString = " days";
	else dayString = " day";


	if ((age.years > 0) && (age.months > 0) && (age.days > 0))
		ageString = age.years + yearString + ", " + age.months + monthString + ",  " + age.days + dayString;
	else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
		ageString = "Only " + age.days + dayString + " old!";
	else if ((age.years > 0) && (age.months == 0) && (age.days == 0))
		ageString = age.years + yearString + " old. Happy Birthday!!";
	else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
		ageString = age.years + yearString + "  " + age.months + monthString;
	else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
		ageString = age.months + monthString + "  " + age.days + dayString;
	else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
		ageString = age.years + yearString + "  " + age.days + dayString;
	else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
		ageString = age.months + monthString;
	else ageString = "Oops! Could not calculate age!";

	var h = now.getHours();
	var m = now.getMinutes();
	var s = now.getSeconds();
	ageString += `, ${h} hours, ${m} minutes, and ${s} seconds.`
	document.getElementById("count-up").textContent = ageString;

	setTimeout(getAge, 1000);
}
getAge();

$("html").click(function () {
	$("#command").focus();

})

// Add command history and auto-completion
const CommandProcessor = {
    history: [],
    historyIndex: -1,
    suggestions: [],
    
    initializeAutoComplete() {
        const input = document.getElementById('command');
        
        input.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Tab':
                    e.preventDefault();
                    this.handleTabComplete();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.navigateHistory('up');
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.navigateHistory('down');
                    break;
            }
        });
    },

    handleTabComplete() {
        const input = document.getElementById('command');
        const currentText = input.value.toLowerCase();
        
        // Filter available commands that match current input
        this.suggestions = available_cmd.filter(cmd => 
            cmd.startsWith(currentText)
        );

        if (this.suggestions.length === 1) {
            input.value = this.suggestions[0];
        } else if (this.suggestions.length > 1) {
            // Show all possible completions
            this.displaySuggestions();
        }
    },

    displaySuggestions() {
        const output = document.getElementById('executed_commands');
        output.innerHTML += `\n\rPossible commands:\n\r${this.suggestions.join('  ')}`;
    }
};

class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentChar = 0;
        this.isTyping = false;
    }

    start() {
        this.isTyping = true;
        this.type();
    }

    type() {
        if (!this.isTyping) return;
        
        if (this.currentChar < this.text.length) {
            this.element.innerHTML += this.text.charAt(this.currentChar);
            this.currentChar++;
            setTimeout(() => this.type(), this.speed);
        }
    }

    stop() {
        this.isTyping = false;
    }
}

// Usage example
// function displayWithTypingEffect(text) {
//     const output = document.getElementById('executed_commands');
//     const newLine = document.createElement('div');
//     output.appendChild(newLine);
//
//     const typing = new TypingEffect(newLine, text);
//     typing.start();
// }
Typing
function displayWithTypingEffect(text) {
	const output = document.getElementById("executed_commands");
	const container = document.createElement("div");
	output.appendChild(container);

	const typing = new TypingEffect(container, text, 50);
	typing.start();
}


const FunCommands = {
	quotes: [
		"First, solve the problem. Then, write the code. – John Johnson",
		"Code is like humor. When you have to explain it, it's bad. – Cory House",
	],
	jokes: [
		"Why do programmers prefer dark mode? Because light attracts bugs!",
		"Why did the developer go broke? Because he used up all his cache!",
	],
	async quote() {
		const randomQuote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
		displayWithTypingEffect(randomQuote);
	},
	async joke() {
		const randomJoke = this.jokes[Math.floor(Math.random() * this.jokes.length)];
		displayWithTypingEffect(randomJoke);
	},
	matrix() {
		displayWithTypingEffect("Matrix effect activated (placeholder).");
	},
	async easteregg() {
		const ascii = `
         _____________________
        |  ________________  |
        | |                | |
        | |   Easter Egg   | |
        | |    Found!      | |
        | |________________| |
        |_____________________|
        `;
		displayWithTypingEffect(ascii);
	},
};


function showSkills() {
    const skills = {
        'JavaScript': 90,
        'Python': 85,
        'React': 80,
        // Add more skills...
    };

    Object.entries(skills).forEach(([skill, level]) => {
        const bars = '█'.repeat(Math.floor(level/10)) + '░'.repeat(10 - Math.floor(level/10));
        displayWithTypingEffect(`${skill.padEnd(15)} [${bars}] ${level}%`);
    });
}


// Define a map of command to descriptions

var commandDescriptions = {
	"about": "Learn more about me.",
	"education": "Check out my academic qualifications.",
	"projects": "View some of my amazing projects.",
	"experience": "See my professional experience.",
	"skills": "Check out my technical skillset.",
	"contact": "Find ways to get in touch.",
	"download": "Download my resume.",
	"help": "List available commands.",
	"clear": "Clear the terminal screen.",
	"ls": "List available commands.",
	"theme": "Change the terminal theme.",
	"quote": "Get a random quote.",
	"joke": "Get a random programming joke.",
	"matrix": "Activate Matrix mode.",
	"easteregg": "Find a hidden surprise!"
};
var commandInput = document.getElementById('command');
var suggestionsList = document.getElementById('suggestions-list');

function updateSuggestions() {
	const query = commandInput.value.trim().toLowerCase();
	if (!query) {
		suggestionsList.style.display = 'none';
		return;
	}

	const filtered = available_cmd.filter(cmd => cmd.startsWith(query));
	if (filtered.length === 0) {
		suggestionsList.style.display = 'none';
		return;
	}

	suggestionsList.innerHTML = '';
	filtered.forEach(cmd => {
		const li = document.createElement('li');
		const cmdName = document.createElement('span');
		cmdName.className = 'cmd-name';
		cmdName.textContent = cmd;

		const cmdDesc = document.createElement('span');
		cmdDesc.className = 'cmd-desc';
		cmdDesc.textContent = commandDescriptions[cmd] || "No description available.";

		li.appendChild(cmdName);
		li.appendChild(cmdDesc);

		li.addEventListener('click', () => {
			commandInput.value = cmd;
			suggestionsList.style.display = 'none';
			commandInput.focus();
		});

		suggestionsList.appendChild(li);
	});

	suggestionsList.style.display = 'block';
}

commandInput.addEventListener('input', updateSuggestions);

document.addEventListener('click', (e) => {
	if (!e.target.closest('.command-wrapper')) {
		suggestionsList.style.display = 'none';
	}
});


// The rest of your existing code (run_command, handleThemeCommand, etc.) can remain unchanged
// as they still work with the #command input as before.
