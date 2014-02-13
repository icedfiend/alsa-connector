var fs = require('fs'),
	extend = require("extend");

module.exports = function(file, interval, callback) {
	var self = this;
	var timer = null;
	var defaults = {
		interval : 1000,
	};

	checkFile();
	parseInterval();
	checkValidCallback();

	self.start = function() {
		if(timer === null) {
			checkFile();
			timer = setInterval(callback, defaults.interval);
		} else {
			self.stop();
			self.start();
		}
	};

	self.stop = function(){
		clearInterval(timer);
		timer = null;
	};
	
	return self;

	function checkFile() {
		if(!file) {
			throw new Error("No file specified");
		}

		if (!fs.existsSync(file)) {
			throw new Error("File not found");
		}
	}

	function parseInterval() {
		if(typeof interval === "number") {
			defaults.interval = interval;
		} else if (typeof interval === "function"){
			callback = interval;
		} else if (typeof interval === "string") {
			defaults.interval = parseInt(interval, 10);
		}
	}

	function checkValidCallback(){
		if ( !callback && ((typeof interval) !== "function") ){
			throw new Error("Missing callback function");
		}
	}
};