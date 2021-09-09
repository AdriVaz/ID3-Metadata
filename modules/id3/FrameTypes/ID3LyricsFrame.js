
const {ID3Frame} = require("../ID3Frame");
const myutils = require("../../Utils");

////////////////////////////////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////////////////////////////////

const ID3LyricsFrame = function() {
	myutils.dispatchCall(this, arguments, [
		[ID3LyricsFrameEmpty, ["string", "string", "number"]],
		[ID3LyricsFrameParse, ["buffer", "number"]]
	], "ID3LyricsFrame");
}

const ID3LyricsFrameEmpty = function(encoding, text, id3Version) {
	//Inherit attributes
	ID3Frame.call(this, "USLT", id3Version);

	this.encoding = encoding;
	this.language = "en";
	this.contentDescription = "";
	this.value = text;
	
}

const ID3LyricsFrameParse = function(buffer, id3Version) {
	//Inherit attributes
	ID3Frame.call(this, buffer, id3Version);

}

////////////////////////////////////////////////////////////////////////////////
// Inherit Methods
////////////////////////////////////////////////////////////////////////////////

// Inherit methods
ID3LyricsFrame.prototype = Object.create(ID3Frame.prototype);

// Set the constructor method back to its correct value
Object.defineProperty(ID3LyricsFrame.prototype, 'constructor', {
	value: ID3LyricsFrame,
	enumerable: false,
	writable: true
});

////////////////////////////////////////////////////////////////////////////////
// Methods
////////////////////////////////////////////////////////////////////////////////

ID3LyricsFrame.prototype.toBytes = function() {
	// Call super for toBytes() method
	ID3Frame.prototype.toBytes.call(this);

	// ....
}

////////////////////////////////////////////////////////////////////////////////
// Exports
////////////////////////////////////////////////////////////////////////////////

module.exports = {
	ID3LyricsFrame
}
