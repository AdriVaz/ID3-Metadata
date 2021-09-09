
const myutils = require("../../Utils");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const FlagBytes = function(bytes, flagSpec) {
	//if(arguments.length < 2)
		//throw "FlagBytes: incorrect argument number: 2 expected"

	//if(typeof flagSpec !== "object" || (typeof bytes !== "number" && !Buffer.isBuffer(bytes)))
		//throw "FlagBytes: incorrect argument type: <buffer|number>, object expected"

	//if(typeof bytes == "number")
		//FlagBytesEmpty.call(this, bytes, flagSpec);
	//else
		//FlagBytesParse.call(this, bytes, flagSpec);

	myutils.dispatchCall(this, arguments, [
		[FlagBytesEmpty, ["number", "object"]],
		[FlagBytesParse, ["buffer", "object"]],
	], "FlagBytes");


	// Create custom get and set functions for each flag
	Object.keys(this.flagSpec).forEach(flagName => {
		let camelCaseName = flagName.toLowerCase().replace(/(^|_)./g, (x) => {
			return x.replace("_", "").toUpperCase();
		});

		this["is" + camelCaseName] = function() {
			return this.flagsSet.includes(flagName);
		}.bind(this);

		this["set" + camelCaseName] = function(value) {
			let index = this.flagsSet.indexOf(flagName);

			if(value === true && index == -1)
				this.flagsSet.push(flagName)
			else if(value === false && index !== -1)
				this.flagsSet.splice(index, 1);
		}.bind(this);

	});

}

const FlagBytesEmpty = function(byteCount, flagSpec) {
	this.byteCount = byteCount;
	this.flagSpec = flagSpec;
	this.flagsSet = [];
}

const FlagBytesParse = function(bytes, flagSpec) {
	this.byteCount = bytes.length;
	this.flagSpec = flagSpec;
	this.flagsSet = [];

	// Fill flagsSet
	Object.entries(this.flagSpec).forEach(flag => {
		if(myutils.getBitAt(bytes, flag[1]))
			this.flagsSet.push(flag[0]);
	});
}

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

//FlagBytes.prototype.getFlag = function(flagName) {

//}

//FlagBytes.prototype.setFlag = function(flagName, flagValue) {

//}

FlagBytes.prototype.toBytes = function() {

}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	FlagBytes
}
