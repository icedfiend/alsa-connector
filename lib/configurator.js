var fs = require("fs"),
	commander = require("commander"),
	parsers = require("./parsers"),
	config = require(__dirname + "/../config.json");

module.exports = {
	config: function () {
		return config;
	},

	arguments: function () {
		return commander;
	},

	parsers: function () {
		return parsers;
	}
};

parsers = parsers(config);

commander
	.version("0.0.1")
	.usage("[options] <parameters...>")
	.option("-a, --alias <adapter=alias[,adapter=alias...]>", "Add aliases to adapters", parsers.parseAliases)
	.option("-i, --ignore <adapter[,adapter...]>", "Ignores specified devices", parsers.parseList)
	.option("-f, --file <path/to/file>", "File to check")
	.option("--interval <ms>", "Change de interval in ms to check the file")
	.option("--regex <regexp>", "Change de regexp used to match the file content")
	.option("--remove-alias <adapter[,adapter...]>", "Removes the alias for the given adapters", parsers.parseList)
	.option("--remove-ignore <adapter,[adapter...]>", "Stops ignoring the given adapters", parsers.parseList)
	.option("--no-run", "Doesn't execute the program after processing the parameters")
	.option("--no-save", "Don't save options after application exits")
	.option("--only-input", "Only execute alsa_in command")
	.option("--only-output", "Only execute alsa_out command")
	.parse(process.argv);
//.option("--log <file>", "File to log events to, default: /var/log/alsa-connector.log")

if (commander.onlyInput && commander.onlyOutput) {
	console.error("--only-input and --only-output are mutually exclusive. Use only one.");
	process.exit(1);
}

updateConfig(commander);

function updateConfig(data) {
	updateInterval(data.interval);
	addAliases(data.alias);
	removeAliases(data.removeAlias);
	addIgnores(data.ignore);
	removeIgnores(data.removeIgnore);
	saveConfig(data.save);
}

function updateInterval(interval) {
	if (interval) {
		config.interval = interval;
	}
}

function addAliases(aliases) {
	for (var adapter in aliases) {
		config.alias[adapter] = aliases[adapter];
	}
}

function addIgnores(ignores) {
	for (var adapter in ignores) {
		config.ignore.push(ignores[adapter]);
	}
}

function removeAliases(aliases) {
	for (var item in aliases) {
		var adapter = aliases[item];
		delete config.alias[adapter];
	}
}

function removeIgnores(ignores) {
	for (var item in ignores) {
		var adapter = ignores[item];
		var index = config.ignore.indexOf(adapter);
		if (index >= 0) {
			config.ignore.splice(index, 1);
		}
	}
}

function saveConfig(save) {
	if (save) {
		fs.writeFileSync(__dirname + "/../config.json", JSON.stringify(config), "utf8");
	}
}