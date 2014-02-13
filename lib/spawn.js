var spawn = require('child_process').spawn;

module.exports.spawn = function(command, parameters, options) {
	var self = this;
	var process = null;
	var events = {};
	var running = false;

	if(!command) {
		throw new Error("No command specified");
	}

	self.command = command;
	self.params = prepareParameters(parameters) || [];
	self.options = options || undefined;

	self.run = function(){
		process = spawn(self.command, self.params, self.options);
		running = true;
		for (var evt in events){
			var callback = events[evt];
			if(evt !== "exit") {
				process.on(evt, callback);
			} else {
				process.on("exit", onExit);
			}
		}
		return self;
	};

	self.kill = function() {
		process.kill("SIGKILL");
		process = null;
		running = false;
		return self;
	};

	self.isRunning = function() {
		return runnin;
	};

	self.on = function(event, callback){
		events[event] = callback;
		if(running) {
			if(event !== "exit") {
				process.on(event, callback);
			} else {
				process.on("exit", onExit);
			}
		}
		return self;
	};

	return self;
	
	function prepareParameters(parameters) {
		if(isArray(parameters)) {
			return parameters;
		} else if (typeof parameters === 'object'){
			return objectToArray(parameters);
		} else if (typeof parameters === 'string') {
			return parameters.split(' ');
		}
	}

	function isArray(obj) {
		return Object.prototype.toString.call(obj) === '[object Array]';
	}

	function objectToArray(parameters) {
		var params = [];
		for(var key in parameters) {
			params.push(key);
			params.push(parameters[key]);
		}

		return params;
	}

	function onExit(code, signal) {
		running = false;
		if(events.exit) {
			events.exit(code, signal);
		}
	}
};

module.exports.manager = function() {
	var commands = {};
	return {
		run :function(name, spawn) {
			if(commands[name]){
				throw new Error("Process " + name + " already existis");
			} else {
				commands[name] = spawn.run();
			}
		},
		kill: function(name) {
			if(name)
				if (commands[name]) {
					commands[name].kill();
					delete commads[name];
				}
			else {
				for(var command in commands) {
					commands[command].kill();
				}
				commands = {};
			}

		}
	};
};