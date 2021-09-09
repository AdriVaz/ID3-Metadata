
const {FlagBytes} = require("./utils/FlagBytes");
const myutils = require("../Utils");
const constants = require("./ID3Constants");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const ID3Header = function() {
	myutils.dispatchCall(this, arguments, [
		[ID3HeaderEmpty, []],
		[ID3HeaderParse, ["buffer"]]
	], "ID3Header");
}

const ID3HeaderEmpty = function() {
	this.version = constants.ID3_DEFAULT_VERSION;
	this.revision = constants.ID3_DEFAULT_REVISION;
	this.flags = new FlagBytes(1, constants.HEADER_FLAG_SPEC[this.version]);
	this.totalSize = constants.DEFAULT_PADDING_SIZE;
}

const ID3HeaderParse = function(buffer) {
	let magic = buffer.toString("ascii", 0, 3);
	if(magic !== "ID3")
		throw "ID3Header: file is not mp3 with ID3 tags"

	this.version = buffer[3];
	this.revision = buffer[4];
	this.flags = new FlagBytes(buffer.slice(5,6), constants.HEADER_FLAG_SPEC[this.version]);
	this.totalSize = buffer[7];
}

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

ID3Header.prototype.isUnsynchronized = function() {
	let func = this.flags.isUnsynchronized;
	return func ? func() : false;
}

ID3Header.prototype.isExtendedHeaderPresent = function() {
	let func = this.flags.isExtendedHeaderPresent;
	return func ? func() : false;
}

ID3Header.prototype.isExperimental = function() {
	let func = this.flags.isExperimental;
	return func ? func() : false;
}

ID3Header.prototype.isFooterPresent = function() {
	let func = this.flags.isFooterPresent;
	return func ? func() : false;
}

ID3Header.prototype.incrementSize = function() {

}

ID3Header.prototype.toBytes = function() {

}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	ID3Header
}
