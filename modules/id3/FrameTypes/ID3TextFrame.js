
const {ID3Frame} = require("../ID3Frame");
const myutils = require("../../Utils");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const ID3TextFrame = function() {
	myutils.dispatchCall(this, arguments, [
		[ID3TextFrameEmpty, ["string", "string", "string", "number"]],
		[ID3TextFrameParse, ["buffer", "number"]]
	], "ID3TextFrame");
}

const ID3TextFrameEmpty = function(frameId, encoding, text, id3Version) {
	//Inherit attributes
	ID3Frame.call(this, frameId, id3Version);

	this.encoding = encoding;
	this.text = text;
}

const ID3TextFrameParse = function(buffer, id3Version) {
	//Inherit attributes
	ID3Frame.call(this, buffer, id3Version);

	// ...

}

////////////////////////////////////////////////////////////////////////////////
// Inherit Methods
////////////////////////////////////////////////////////////////////////////////

// Inherit methods
ID3TextFrame.prototype = Object.create(ID3Frame.prototype);

// Set the constructor method back to its correct value
Object.defineProperty(ID3TextFrame.prototype, 'constructor', {
	value: ID3TextFrame,
	enumerable: false,
	writable: true
});

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

ID3TextFrame.prototype.toBytes = function() {
	// Call super for toBytes() method
	ID3Frame.prototype.toBytes.call(this);

	// ....
}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	ID3TextFrame
}
