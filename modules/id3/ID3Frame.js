
const {FlagBytes} = require("./utils/FlagBytes");
const myutils = require("../Utils");
const constants = require("./ID3Constants");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const ID3Frame = function(source, id3Version) {
	myutils.dispatchCall(this, arguments, [
		[ID3FrameEmpty, ["string", "number"]],
		[ID3FrameParse, ["buffer", "number"]]
	], "ID3Frame");
}

const ID3FrameEmpty = function(frameID, id3Version) {
	this.frameID = frameID;
	this.payloadSize = 0;
	// TODO: necessary to add this? It is related to the low level representation
	// of the payload, and all the low level stuff should only be treated in the toBytes()
	// methods and in the parse constructors
	this.flags = new FlagBytes(2, constants.FRAME_FLAG_SPEC[id3Version]);
}

const ID3FrameParse = function(buffer, id3Version) {
	
}

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

ID3Frame.prototype.isTagAlterPreserved = function() {
	let func = this.flags.isTagAlterPreserved;
	return func ? func() : false;
}

ID3Frame.prototype.isFileAlterPreserved = function() {
	let func = this.flags.isFileAlterPreserved;
	return func ? func() : false;
}

ID3Frame.prototype.isReadOnly = function() {
	let func = this.flags.isReadOnly;
	return func ? func() : false;
}

ID3Frame.prototype.isCompressed = function() {
	let func = this.flags.isCompressed;
	return func ? func() : false;
}

ID3Frame.prototype.isEncrypted = function() {
	let func = this.flags.isEncrypted;
	return func ? func() : false;
}

ID3Frame.prototype.isGroupingIdentityPresent = function() {
	let func = this.flags.isGroupingIdentityPresent;
	return func ? func() : false;
}

ID3Frame.prototype.isUnsynchronized = function() {
	let func = this.flags.isUnsynchronized;
	return func ? func() : false;
}

ID3Frame.prototype.isDataLengthIndicatorPresent = function() {
	let func = this.flags.isDataLengthIndicatorPresent;
	return func ? func() : false;
}

ID3Frame.prototype.toBytes = function() {

}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	ID3Frame
}
