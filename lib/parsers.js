module.exports = function(config) {
	var pattern = new RegExp(config.pattern,"m");
	
	return {
		parseAliases : function (aliases) {
			aliases = aliases.split(",");
			var aliasObj = {};
			for(var item in aliases) {
				var alias = aliases[item].split("=");
				aliasObj[alias[0]] = alias[1];
			}
			return aliasObj;
		},
		parseList : function(list) {
			return list.split(",");
		},
		parseContent : function(content, callback) {
			var split = content.split("\n");
			var adapters = [];

			for(var i = 0, L = split.length; i < L; i++) {
				var match = split[i].match(pattern);

				if(match){
					var adapter = match[1];
					if((config.ignore.indexOf(adapter) < 0)){
						adapters.push(adapter);
					}
				}
			}
			callback(adapters);
		}
	};
};